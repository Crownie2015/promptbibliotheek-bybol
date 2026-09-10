window.CATEGORIEEN = [
  {
    id: 'social',
    titel: 'Social media post',
    omschrijving: 'Voor Facebook of Instagram',
    doel: 'een social media post schrijven voor Facebook of Instagram',
    extraRegels: [
      'Vraag in de prompt om 2 of 3 versies, zodat de zelfstandige kan kiezen.'
    ],
    velden: [
      { id: 'platform', label: 'Platform', type: 'select', opties: ['Facebook', 'Instagram', 'Beide'] },
      { id: 'onderwerp', label: 'Waarover gaat de post?', type: 'textarea',
        placeholder: 'Bijvoorbeeld: nieuwe openingsuren, een actie, een blik achter de schermen' },
      { id: 'toon', label: 'Gewenste toon', type: 'select',
        opties: ['Enthousiast', 'Rustig en informatief', 'Grappig', 'Persoonlijk'] },
      { id: 'actie', label: 'Wat moet de lezer doen na het lezen?', type: 'text',
        placeholder: 'Bijvoorbeeld: langskomen, reageren, een link aanklikken' }
    ]
  },
  {
    id: 'email',
    titel: 'E-mail of bericht',
    omschrijving: 'Voor een klant of contact',
    doel: 'een e-mail of bericht schrijven',
    extraRegels: [
      'Vraag in de prompt om de toon te bewaken en niet formeel of stijf te klinken.',
      'Als de situatie een klacht of een lastige mail is, vraag in de prompt om eerst begrip te tonen voor er een oplossing wordt voorgesteld.'
    ],
    velden: [
      { id: 'situatie', label: 'Wat voor mail is het?', type: 'select',
        opties: ['Offerte opvolgen', 'Lastige mail beantwoorden', 'Klacht afhandelen', 'Review vragen', 'Iets anders'] },
      { id: 'context', label: 'Wat speelt er precies?', type: 'textarea',
        placeholder: 'Beschrijf kort de situatie, in je eigen woorden' },
      { id: 'toon', label: 'Gewenste toon', type: 'select',
        opties: ['Vriendelijk en zacht', 'Zakelijk en kort', 'Warm en persoonlijk'] }
    ]
  },
  {
    id: 'afbeelding',
    titel: 'Afbeelding maken',
    omschrijving: 'Een prompt voor een AI-beeldgenerator',
    doel: 'een prompt voor een AI-beeldgenerator schrijven',
    extraRegels: [
      'Beschrijf in de prompt wat er exact te zien moet zijn, de stijl, de sfeer en de verhouding (bijvoorbeeld vierkant voor Instagram, breed voor een website), zodat een beeldgenerator er meteen mee vooruit kan.',
      'Vermeld geen merknamen van AI-beeldtools in de prompt zelf.'
    ],
    velden: [
      { id: 'onderwerp', label: 'Wat moet er te zien zijn?', type: 'textarea',
        placeholder: 'Beschrijf zo concreet mogelijk wat er op het beeld moet staan' },
      { id: 'stijl', label: 'Stijl', type: 'select',
        opties: ['Foto-realistisch', 'Illustratie', 'Minimalistisch', 'Speels'] },
      { id: 'gebruik', label: 'Waarvoor gebruik je het beeld?', type: 'select',
        opties: ['Social media post', 'Advertentie', 'Website'] }
    ]
  },
  {
    id: 'tekst',
    titel: 'Tekst voor website of advertentie',
    omschrijving: 'Verkooptekst of productbeschrijving',
    doel: 'een verkooptekst of websitetekst schrijven',
    extraRegels: [
      'Vraag in de prompt om de tekst te schrijven vanuit wat de klant eraan heeft, niet vanuit de techniek.',
      'Vraag om ook een korte versie van een zin toe te voegen die bovenaan een website of advertentie kan.'
    ],
    velden: [
      { id: 'product', label: 'Wat verkoop je of bied je aan?', type: 'textarea',
        placeholder: 'Beschrijf je product of dienst in je eigen woorden' },
      { id: 'doelgroep', label: 'Voor wie is dit bedoeld?', type: 'text',
        placeholder: 'Bijvoorbeeld: drukke ouders, andere zelfstandigen, particulieren in de buurt' },
      { id: 'doel', label: 'Wat moet de tekst doen?', type: 'select',
        opties: ['Uitleggen wat het is', 'Overtuigen om te kopen', 'Aanzetten tot een actie'] }
    ]
  },
  {
    id: 'ander',
    titel: 'Ander doel',
    omschrijving: 'Voor alles wat niet in de andere 4 past, zoals een samenvatting',
    doel: 'iets te doen op basis van wat hieronder beschreven staat',
    extraRegels: [
      'Is het type taak Samenvatten, vraag dan in de prompt uitdrukkelijk om de brontekst mee te plakken en een richtlijn voor de gewenste lengte.'
    ],
    velden: [
      { id: 'taak', label: 'Wat voor soort taak is het?', type: 'select',
        opties: ['Samenvatten', 'Herschrijven', 'Analyseren', 'Plannen', 'Uitleggen of lesgeven', 'Iets anders'] },
      { id: 'waarvoor', label: 'Waarvoor heb je dit nodig?', type: 'textarea',
        placeholder: 'Beschrijf kort de situatie, in je eigen woorden. Plak hier nog geen lange tekst, dat doe je straks bij de prompt zelf.' },
      { id: 'doelgroep', label: 'Voor wie is dit bedoeld?', type: 'text',
        placeholder: 'Bijvoorbeeld: mezelf, een klant, mijn team' },
      { id: 'resultaat', label: 'Wat moet het resultaat zijn?', type: 'textarea',
        placeholder: 'Beschrijf wat je aan het einde in handen wil hebben' }
    ]
  }
];
