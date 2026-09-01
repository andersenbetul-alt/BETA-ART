  'use strict';
  // Faz 0 aracı: sonuç metinleri sabit örneklerdir, gerçek AI değil, uydurma
  // rakam yok — hedef süre yalnızca kaba bir örnek oran (~%50), vaat değil.
  // mailTo adresi assets/js/config.js'teki mailTo ile aynı tutulmalı (bu
  // demo dosyası sibling demo/cv-action-page.js gibi bilinçli olarak
  // config.js'e bağımlı değil).
  var MAILTO = 'hello@qblogg.com';

  var TASKS = [
    { id: 't1', label: 'Customer email replies',
      method: 'Draft-then-edit: let an AI tool draft a first reply from the message, then just edit the tone — most people only change a small part of the draft.' },
    { id: 't2', label: 'Ticket / case summaries',
      method: 'Summarize the full thread into 3 bullet points with a saved AI prompt template before writing the resolution, instead of re-reading everything.' },
    { id: 't3', label: 'Weekly status reports',
      method: 'Feed your raw notes or numbers into an AI summarizer with a fixed template, then just check the figures instead of writing from scratch.' },
    { id: 't4', label: 'Meeting notes',
      method: 'Record or transcribe the meeting and ask AI to extract action items only — skip writing notes live during the call.' },
    { id: 't5', label: 'Finding information / documentation',
      method: 'Ask an AI assistant that has read your internal docs, instead of searching manually across several systems.' },
    { id: 't6', label: 'Data entry / spreadsheets',
      method: 'Ask an AI tool to write the formula or script for the repetitive part, instead of entering values by hand one by one.' },
    { id: 't7', label: 'Template / standard responses',
      method: 'Build a small library of AI-adjustable templates instead of writing each reply from a blank page.' },
    { id: 't8', label: 'Scheduling / planning',
      method: 'Let an AI assistant propose a first draft of the schedule from your constraints, then just resolve the conflicts.' }
  ];

  var form = document.getElementById('audit');
  var taskField = document.getElementById('taskField');
  TASKS.forEach(function (t) {
    var lab = document.createElement('label'); lab.className = 'opt';
    var inp = document.createElement('input');
    inp.type = 'radio'; inp.name = 'task'; inp.value = t.id; inp.required = true;
    var sp = document.createElement('span'); sp.textContent = t.label;
    lab.append(inp, sp); taskField.append(lab);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var feil = document.getElementById('feil');
    var checked = form.querySelector('input[name="task"]:checked');
    var minutesInput = document.getElementById('minutes');
    var minutes = Number(minutesInput.value);

    if (!checked || !minutes || minutes < 1) {
      feil.hidden = false;
      return;
    }
    feil.hidden = true;

    var task = TASKS.find(function (t) { return t.id === checked.value; });
    var target = Math.max(5, Math.round((minutes * 0.5) / 5) * 5);

    document.getElementById('method').textContent = task.method;
    document.getElementById('baseline').textContent = String(minutes);
    document.getElementById('target').textContent = String(target);

    var subject = 'Q Work Audit — ' + task.label;
    var body = 'Task: ' + task.label + '\n' +
      'Current time: ' + minutes + ' min\n' +
      'I would like to join one of the first 20 test interviews.';
    document.getElementById('joinLink').href =
      'mailto:' + MAILTO + '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    var res = document.getElementById('resultat');
    res.hidden = false;
    res.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
