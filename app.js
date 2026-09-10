(function () {
  'use strict';

  var TOEGANG_SLEUTEL = 'bybol-promptbibliotheek-code';

  var toegangEl = document.getElementById('toegang');
  var toegangFormEl = document.getElementById('toegang-form');
  var toegangCodeEl = document.getElementById('toegang-code');
  var toegangFoutEl = document.getElementById('toegang-fout');
  var appEl = document.getElementById('app');

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

  function toonApp() {
    toegangEl.hidden = true;
    appEl.hidden = false;
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
