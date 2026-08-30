  'use strict';
  // Belirlenimci puanlama: yapay zekâ yok, uydurma yok — sonuç metinleri
  // sabittir ve uzmanla birlikte yazılacak sürümün genel taslağıdır.
  var SPORSMAL = [
    { id: 's1', q: 'Tilpasser du CV-en til hver enkelt stilling du søker på?',
      tip: 'Tilpass CV-en til stillingen: løft frem erfaringen som er mest relevant for akkurat denne jobben.' },
    { id: 's2', q: 'Har CV-en et kort sammendrag øverst (3–4 linjer om hvem du er)?',
      tip: 'Legg til et kort sammendrag øverst, slik at leseren forstår profilen din på ti sekunder.' },
    { id: 's3', q: 'Beskriver du resultater (tall, effekter) — ikke bare arbeidsoppgaver?',
      tip: 'Skriv resultater, ikke bare oppgaver: hva ble bedre, raskere eller billigere fordi du gjorde jobben?' },
    { id: 's4', q: 'Er CV-en på maks to sider?',
      tip: 'Kort ned til maks to sider — behold det som er relevant for stillingen, kutt resten.' },
    { id: 's5', q: 'Bruker du nøkkelord fra stillingsannonsen i CV-en?',
      tip: 'Bruk sentrale ord fra annonsen: mange arbeidsgivere søker etter dem, både manuelt og digitalt.' },
    { id: 's6', q: 'Er alle perioder i tidslinjen dekket — eller kort forklart?',
      tip: 'Forklar hull i tidslinjen med én nøytral linje i stedet for å la leseren gjette.' },
    { id: 's7', q: 'Er språk- og kompetansenivåene dine konkret beskrevet?',
      tip: 'Beskriv nivå konkret (for eksempel «norsk: B2», «Excel: avansert») i stedet for generelle ord.' },
    { id: 's8', q: 'Har en annen person kvalitetssikret CV-en din?',
      tip: 'Få en annen person til å lese CV-en: skrivefeil og uklarheter er lettest å se utenfra.' }
  ];
  var VALG = [
    { v: 2, t: 'Ja' },
    { v: 1, t: 'Delvis / usikker' },
    { v: 0, t: 'Nei' }
  ];
  var BAND = [
    { min: 13, t: 'CV-en din har et godt grunnlag. Forbedringene under er finpuss som kan gjøre en god CV enda tydeligere.' },
    { min: 7,  t: 'CV-en din har potensial, men noen viktige grep mangler. Punktene under er stedene det lønner seg å starte.' },
    { min: 0,  t: 'Her er det stor forbedringsmulighet — og det er gode nyheter: grepene under er konkrete og fullt gjennomførbare.' }
  ];

  var form = document.getElementById('quiz');
  var feilP = document.getElementById('feil');
  SPORSMAL.forEach(function (s, i) {
    var fs = document.createElement('fieldset');
    var lg = document.createElement('legend');
    lg.textContent = (i + 1) + '. ' + s.q;
    fs.append(lg);
    VALG.forEach(function (o) {
      var lab = document.createElement('label'); lab.className = 'opt';
      var inp = document.createElement('input');
      inp.type = 'radio'; inp.name = s.id; inp.value = String(o.v); inp.required = true;
      var sp = document.createElement('span'); sp.textContent = o.t;
      lab.append(inp, sp); fs.append(lab);
    });
    form.insertBefore(fs, feilP);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var feil = document.getElementById('feil');
    var sum = 0, mangler = false, tips = [];
    SPORSMAL.forEach(function (s) {
      var valgt = form.querySelector('input[name="' + s.id + '"]:checked');
      if (!valgt) { mangler = true; return; }
      var v = Number(valgt.value);
      sum += v;
      if (v < 2) tips.push({ v: v, tip: s.tip });
    });
    feil.hidden = !mangler;
    if (mangler) return;

    document.getElementById('poeng').textContent = String(sum);
    document.getElementById('band').textContent =
      BAND.find(function (b) { return sum >= b.min; }).t;

    // Kişiselleştirme: 0 puanlı maddeler önce, sonra 1 puanlılar.
    tips.sort(function (a, b) { return a.v - b.v; });
    var ul = document.getElementById('tips');
    ul.textContent = '';
    tips.forEach(function (t) {
      var li = document.createElement('li'); li.textContent = t.tip; ul.append(li);
    });
    document.getElementById('tipsBoks').hidden = tips.length === 0;

    var res = document.getElementById('resultat');
    res.hidden = false;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Demo düğmeleri: gerçek kurulumdaki hedefi anlatır, hiçbir yere gitmez.
  document.querySelectorAll('[data-demo]').forEach(function (b) {
    b.addEventListener('click', function () {
      document.getElementById('demoNote').hidden = false;
    });
  });
