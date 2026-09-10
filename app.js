(function () {
  'use strict';

  var TOEGANG_SLEUTEL = 'bybol-promptbibliotheek-code';
  var GESCHIEDENIS_SLEUTEL = 'bybol-promptbibliotheek-geschiedenis';
  var MAX_GESCHIEDENIS = 8;

  var toegangEl = document.getElementById('toegang');
  var toegangFormEl = document.getElementById('toegang-form');
  var toegangCodeEl = document.getElementById('toegang-code');
  var toegangFoutEl = document.getElementById('toegang-fout');
  var appEl = document.getElementById('app');
  var tabsEl = document.getElementById('tabs');
  var vragenTitelEl = document.getElementById('vragen-titel');
  var vragenOmschrijvingEl = document.getElementById('vragen-omschrijving');
  var vragenFormEl = document.getElementById('vragen-form');
  var vragenFoutEl = document.getElementById('vragen-fout');
  var geschiedenisEl = document.getElementById('geschiedenis');
  var geschiedenisLijstEl = document.getElementById('geschiedenis-lijst');
  var annuleerKnopEl = document.getElementById('annuleer-knop');
  var opnieuwKnopEl = document.getElementById('opnieuw-knop');
  var resultaatTekstEl = document.getElementById('resultaat-tekst');
  var resultaatUitlegEl = document.getElementById('resultaat-uitleg');
  var kopieerKnopEl = document.getElementById('kopieer-knop');

  var huidigeCategorie = null;
  var actieveAanvraagController = null;

  function haalOpgeslagenCode() {
    try {
      return window.localStorage.getItem(TOEGANG_SLEUTEL) || '';
    } catch (fout) {
      return '';
    }
  }

  function bewaarCode(code) {
    try {
      window.localStorage.setItem(TOEGANG_SLEUTEL, code);
    } catch (fout) {
      // localStorage kan geweigerd zijn (bijvoorbeeld privenavigatie), niet kritiek.
    }
  }

  function wisOpgeslagenCode() {
    try {
      window.localStorage.removeItem(TOEGANG_SLEUTEL);
    } catch (fout) {
      // niet kritiek
    }
  }

  function toonScherm(naam) {
    document.querySelectorAll('.scherm').forEach(function (el) {
      el.hidden = el.dataset.scherm !== naam;
    });
  }

  function toonApp() {
    toegangEl.hidden = true;
    appEl.hidden = false;
    renderGeschiedenis();
    if (!huidigeCategorie) {
      kiesCategorie(window.CATEGORIEEN[0].id);
    }
  }

  function toonToegang(foutmelding) {
    appEl.hidden = true;
    toegangEl.hidden = false;
    if (foutmelding) {
      toegangFoutEl.textContent = foutmelding;
      toegangFoutEl.hidden = false;
    } else {
      toegangFoutEl.hidden = true;
    }
  }

  function renderTabs() {
    tabsEl.innerHTML = '';
    window.CATEGORIEEN.forEach(function (categorie) {
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'tab';
      tab.textContent = categorie.titel;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(huidigeCategorie && huidigeCategorie.id === categorie.id));
      tab.addEventListener('click', function () { kiesCategorie(categorie.id); });
      tabsEl.appendChild(tab);
    });
  }

  function kiesCategorie(id) {
    if (actieveAanvraagController) {
      actieveAanvraagController.abort();
    }
    huidigeCategorie = window.CATEGORIEEN.filter(function (c) { return c.id === id; })[0];
    renderTabs();
    vragenTitelEl.textContent = huidigeCategorie.titel;
    vragenOmschrijvingEl.textContent = huidigeCategorie.omschrijving;
    vragenFoutEl.hidden = true;
    vragenFormEl.innerHTML = '';

    huidigeCategorie.velden.forEach(function (veld) {
      var wrap = document.createElement('div');
      wrap.className = 'veld';

      var label = document.createElement('label');
      label.textContent = veld.label;
      label.htmlFor = 'veld-' + veld.id;
      wrap.appendChild(label);

      var input;
      if (veld.type === 'select') {
        input = document.createElement('select');
        veld.opties.forEach(function (optie) {
          var o = document.createElement('option');
          o.value = optie;
          o.textContent = optie;
          input.appendChild(o);
        });
      } else if (veld.type === 'textarea') {
        input = document.createElement('textarea');
        input.placeholder = veld.placeholder || '';
        input.required = true;
      } else {
        input = document.createElement('input');
        input.type = 'text';
        input.placeholder = veld.placeholder || '';
        input.required = true;
      }
      input.id = 'veld-' + veld.id;
      input.name = veld.id;
      wrap.appendChild(input);
      vragenFormEl.appendChild(wrap);
    });

    var verstuur = document.createElement('button');
    verstuur.type = 'submit';
    verstuur.className = 'knop';
    verstuur.textContent = 'Maak mijn prompt';
    vragenFormEl.appendChild(verstuur);

    toonScherm('vragen');
  }

  function leesAntwoorden() {
    var data = new FormData(vragenFormEl);
    var antwoorden = {};
    huidigeCategorie.velden.forEach(function (veld) {
      antwoorden[veld.id] = String(data.get(veld.id) || '').trim();
    });
    return antwoorden;
  }

  function toonVragenFout(tekst) {
    vragenFoutEl.textContent = tekst;
    vragenFoutEl.hidden = false;
  }

  function foutmeldingVoor(code) {
    switch (code) {
      case 'ongeldige_aanvraag':
      case 'ongeldig_antwoord':
        return 'Er kon geen prompt gemaakt worden voor deze invoer. Pas je antwoorden aan en probeer opnieuw.';
      case 'geen_sleutel':
        return 'Deze pagina is nog niet volledig ingesteld. Meld dit aan Bybol.';
      case 'openrouter_fout':
      case 'onbekende_fout':
        return 'Er ging iets mis bij het samenstellen van je prompt. Probeer het nog eens.';
      default:
        return 'Er ging iets mis, controleer je internetverbinding en probeer opnieuw.';
    }
  }

  function laadGeschiedenis() {
    try {
      var ruw = window.localStorage.getItem(GESCHIEDENIS_SLEUTEL);
      var lijst = ruw ? JSON.parse(ruw) : [];
      if (!Array.isArray(lijst)) {
        return [];
      }
      return lijst.filter(function (item) {
        return item && typeof item.categorie === 'string' && typeof item.prompt === 'string';
      });
    } catch (fout) {
      return [];
    }
  }

  function bewaarGeschiedenis(lijst) {
    try {
      window.localStorage.setItem(GESCHIEDENIS_SLEUTEL, JSON.stringify(lijst));
    } catch (fout) {
      // localStorage kan geweigerd zijn, niet kritiek.
    }
  }

  function voegToeAanGeschiedenis(categorieTitel, prompt) {
    var lijst = laadGeschiedenis();
    lijst.unshift({ categorie: categorieTitel, prompt: prompt, datum: new Date().toISOString() });
    bewaarGeschiedenis(lijst.slice(0, MAX_GESCHIEDENIS));
    renderGeschiedenis();
  }

  function renderGeschiedenis() {
    var lijst = laadGeschiedenis();
    geschiedenisEl.hidden = lijst.length === 0;
    geschiedenisLijstEl.innerHTML = '';
    lijst.forEach(function (item) {
      var li = document.createElement('li');
      var kort = item.prompt.length > 80 ? item.prompt.slice(0, 80) + '...' : item.prompt;
      li.textContent = item.categorie + ': ' + kort;
      geschiedenisLijstEl.appendChild(li);
    });
  }

  function verstuurAanvraag(event) {
    event.preventDefault();
    var antwoorden = leesAntwoorden();
    var actieveCategorie = huidigeCategorie;
    toonScherm('laden');

    var ctl = new AbortController();
    actieveAanvraagController = ctl;

    fetch('/api/genereer-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: haalOpgeslagenCode(), categorie: actieveCategorie, antwoorden: antwoorden }),
      signal: ctl.signal
    }).then(function (respons) {
      return respons.json().then(function (data) { return { status: respons.status, data: data }; });
    }).then(function (uitkomst) {
      if (uitkomst.status === 401) {
        wisOpgeslagenCode();
        toonToegang('Deze code klopt niet meer. Vraag ze opnieuw na en probeer het dan weer.');
        return;
      }
      if (uitkomst.status !== 200) {
        toonScherm('vragen');
        toonVragenFout(foutmeldingVoor(uitkomst.data && uitkomst.data.code));
        return;
      }
      resultaatTekstEl.textContent = uitkomst.data.prompt;
      resultaatUitlegEl.textContent = uitkomst.data.uitleg;
      toonScherm('resultaat');
      voegToeAanGeschiedenis(actieveCategorie.titel, uitkomst.data.prompt);
    }).catch(function (fout) {
      if (fout && fout.name === 'AbortError') {
        toonScherm('vragen');
        return;
      }
      toonScherm('vragen');
      toonVragenFout(foutmeldingVoor(null));
    }).finally(function () {
      actieveAanvraagController = null;
    });
  }

  toegangFormEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var code = toegangCodeEl.value.trim();
    if (!code) {
      return;
    }
    bewaarCode(code);
    toonApp();
  });

  vragenFormEl.addEventListener('submit', verstuurAanvraag);

  annuleerKnopEl.addEventListener('click', function () {
    if (actieveAanvraagController) {
      actieveAanvraagController.abort();
    }
  });

  opnieuwKnopEl.addEventListener('click', function () {
    toonScherm('vragen');
  });

  kopieerKnopEl.addEventListener('click', function () {
    var tekst = resultaatTekstEl.textContent;
    var origineel = kopieerKnopEl.textContent;
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      kopieerKnopEl.textContent = 'Kopieren lukte niet, selecteer de tekst zelf';
      setTimeout(function () { kopieerKnopEl.textContent = origineel; }, 2500);
      return;
    }
    navigator.clipboard.writeText(tekst).then(function () {
      kopieerKnopEl.textContent = 'Gekopieerd!';
      setTimeout(function () { kopieerKnopEl.textContent = origineel; }, 2000);
    }).catch(function () {
      kopieerKnopEl.textContent = 'Kopieren lukte niet, selecteer de tekst zelf';
      setTimeout(function () { kopieerKnopEl.textContent = origineel; }, 2500);
    });
  });

  if (haalOpgeslagenCode()) {
    toonApp();
  } else {
    toonToegang();
  }
})();
