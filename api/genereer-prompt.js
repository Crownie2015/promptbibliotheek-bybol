// Vercel serverless function. Valideert de gedeelde toegangscode, bouwt dezelfde meta-prompt
// als de vorige Claude-Artifact-versie, roept OpenRouter aan met Claude, en geeft
// { prompt, uitleg } terug als JSON.

var OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
var MODEL = 'anthropic/claude-sonnet-4.5';
var MAX_VELD_LENGTE = 800;
var MAX_DOEL_LENGTE = 300;
var MAX_TOKENS = 1500;

function knip(tekst, maxLengte) {
  var s = String(tekst || '');
  return s.length > maxLengte ? s.slice(0, maxLengte) : s;
}

function bouwMetaPrompt(categorie, antwoorden) {
  var veldenTekst = categorie.velden.map(function (v) {
    return '- ' + v.label + ': ' + knip(antwoorden[v.id], MAX_VELD_LENGTE);
  }).join('\n');
  var doel = knip(categorie.doel, MAX_DOEL_LENGTE);
  var extra = categorie.extraRegels.map(function (r) { return knip(r, MAX_VELD_LENGTE); }).join('\n');

  return 'Je bent een schrijfcoach die een Vlaamse zelfstandige helpt om een goede AI-prompt te schrijven.\n\n' +
    'Bouw een kant-en-klare prompt die deze persoon zo kan kopiëren en plakken in ChatGPT, Gemini of Claude om ' + doel + '.\n\n' +
    'Wat de persoon invulde:\n' + veldenTekst + '\n\n' +
    'Regels voor de prompt die je schrijft:\n' +
    '- Schrijf de prompt zelf in de ik-vorm, alsof de zelfstandige aan het woord is, in het Nederlands.\n' +
    '- Wees concreet: verwerk elk ingevuld antwoord expliciet in de prompt, laat niets weg.\n' +
    '- Vermijd vage woorden zoals "pakkend" of "professioneel" zonder uit te leggen wat dat betekent.\n' +
    '- Gebruik geen Engelse marketingtermen.\n' +
    extra + '\n\n' +
    'Antwoord alleen met een JSON-object met exact deze twee velden, geen andere tekst, geen markdown-codeblok:\n' +
    '{"prompt": "de volledige prompt, klaar om te kopiëren", "uitleg": "2 tot 3 zinnen die uitleggen waarom deze prompt goed werkt, in de toon van een korte tip van een coach, geen vakjargon"}';
}

function parseModelAntwoord(tekst) {
  try {
    return JSON.parse(tekst);
  } catch (fout) {
    var match = tekst.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (fout2) {
        return null;
      }
    }
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ code: 'method_not_allowed' });
    return;
  }

  var body = req.body || {};
  var code = String(body.code || '');
  var categorie = body.categorie;
  var antwoorden = body.antwoorden;

  if (!process.env.TOEGANGSCODE || code !== process.env.TOEGANGSCODE) {
    res.status(401).json({ code: 'foute_code' });
    return;
  }

  if (!categorie || typeof categorie.doel !== 'string' || !Array.isArray(categorie.velden) ||
      !Array.isArray(categorie.extraRegels) || !antwoorden) {
    res.status(400).json({ code: 'ongeldige_aanvraag' });
    return;
  }

  if (!process.env.OPENROUTER_API_KEY) {
    res.status(500).json({ code: 'geen_sleutel' });
    return;
  }

  try {
    var metaPrompt = bouwMetaPrompt(categorie, antwoorden);

    var respons = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: metaPrompt }],
        max_tokens: MAX_TOKENS
      })
    });

    if (!respons.ok) {
      res.status(502).json({ code: 'openrouter_fout' });
      return;
    }

    var data = await respons.json();
    var tekst = data && data.choices && data.choices[0] && data.choices[0].message
      ? data.choices[0].message.content
      : null;

    var resultaat = tekst ? parseModelAntwoord(tekst) : null;

    if (!resultaat || typeof resultaat.prompt !== 'string' || typeof resultaat.uitleg !== 'string') {
      res.status(502).json({ code: 'ongeldig_antwoord' });
      return;
    }

    res.status(200).json({ prompt: resultaat.prompt, uitleg: resultaat.uitleg });
  } catch (fout) {
    res.status(500).json({ code: 'onbekende_fout' });
  }
};
