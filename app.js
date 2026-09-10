(function () {
  'use strict';

  var TOEGANG_SLEUTEL = 'bybol-promptbibliotheek-code';

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

  var huidigeCategorie = null;

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

  toegangFormEl.addEventListener('submit', function (event) {
    event.preventDefault();
    var code = toegangCodeEl.value.trim();
    if (!code) {
      return;
    }
    bewaarCode(code);
    toonApp();
  });

  if (haalOpgeslagenCode()) {
    toonApp();
  } else {
    toonToegang();
  }
})();
