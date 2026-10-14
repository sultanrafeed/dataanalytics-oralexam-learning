(function () {
  'use strict';
  const D = window.DATA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ---------------- storage ----------------
  const KEY = 'at3-defence-v1';
  const blank = () => ({ cards: {}, mocks: [], plan: {}, checklist: {}, storyRuns: 0, official: {}, quizBest: {}, theme: 'auto' });
  let S = blank();
  try { S = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* private mode */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignore */ } };
  const applyTheme = () => {
    if (S.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', S.theme);
  };
  applyTheme();

  // ---------------- helpers ----------------
  // Escape without numeric entities so number highlighting never touches them.
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const hl = (s) => esc(s).replace(/(^|[^A-Za-z0-9_.])(\d[\d,]*(?:\.\d+)?%?)(?![A-Za-z_])/g, (m, p, n) => p + '<b class="num">' + n + '</b>');
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const cellLinks = (cells) => (cells || []).map((c) => `<a class="pill" href="#/learn/walkthrough?cell=${c}">cell ${c}</a>`).join('');
  const toast = (msg) => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1600); };
  const fmtTime = (s) => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  const ICON = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
    learn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/></svg>',
    practice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="14" rx="2.5"/><path d="M7 3h11.5A2.5 2.5 0 0 1 21 5.5V17"/></svg>',
    mock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3.5"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    chev: '<svg width="8" height="14" viewBox="0 0 8 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m1 1 6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 12 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2 2 10l8 8"/></svg>'
  };
  const C = { blue: '#2f6fde', purple: '#6b3fd1', green: '#1f8a4c', orange: '#d97a00', red: '#c2362f', teal: '#0f8a8a', pink: '#c23a7a', gray: '#6b6b73', indigo: '#4b4fd1' };

  const row = (href, color, icon, title, sub, meta) => `
    <a class="row" href="${href}">
      <span class="ic" style="background:${color}">${icon}</span>
      <span class="t"><b>${esc(title)}</b>${sub ? `<span>${esc(sub)}</span>` : ''}</span>
      ${meta ? `<span class="meta">${meta}</span>` : ''}
      <span class="chev">${ICON.chev}</span>
    </a>`;

  // ---------------- decks ----------------
  const DECKS = {
    numbers: { name: 'Numbers to remember', color: C.blue, icon: '#', cards: D.numberCards.map((c, i) => ({ id: 'n' + i, kind: 'Number', q: c.q, a: hl(c.a) })) },
    official: { name: 'The 5 official questions', color: C.purple, icon: '5', cards: D.official.map((o) => ({ id: 'o' + o.id, kind: 'Official Q' + o.id, q: o.q,
      a: `<div class="tag good">Good</div><p>${hl(o.good)}</p><div class="tag exc">Excellent add-on</div><p>${hl(o.excellent)}</p><div class="tag show">Show</div><p>${hl(o.show)}</p>` })) },
    followups: { name: 'Follow-up questions (27)', color: C.orange, icon: '?', cards: D.followups.map((f) => ({ id: 'f' + f.n, kind: f.g, q: f.n + '. ' + f.q, a: hl(f.a) })) },
    cells: { name: 'Notebook cells', color: C.teal, icon: '{}', cards: D.walkthrough.map((w, i) => ({ id: 'w' + i, kind: 'Code walkthrough',
      q: `${w.section} (cell ${w.cells.join(', ')}): what code do you point at, and what do you say?`,
      a: `<div class="code">${esc(w.code)}</div><p>"${hl(w.say)}"</p>` })) },
    models: { name: 'Models in plain words', color: C.green, icon: 'M', cards: D.models.map((m, i) => ({ id: 'm' + i, kind: m.week, q: `${m.name}: how does it decide, what did you tune, what did you find, and one weakness?`,
      a: `<p><b>How:</b> ${hl(m.how)}</p><p><b>Settings:</b> ${hl(m.settings)}</p><p><b>Result:</b> ${hl(m.result)}</p><p><b>Weakness:</b> ${hl(m.weak)}</p>` }))
      .concat(D.modelNotes.map((n, i) => ({ id: 'mn' + i, kind: 'Explain', q: n.title + '?', a: hl(n.text) }))) },
    concepts: { name: 'Evaluation ideas', color: C.indigo, icon: 'E', cards: D.concepts.map((c) => ({ id: 'c' + c.id, kind: 'What is…', q: `What is ${c.name.replace(/ \(Week 8\)/, '')}? How did you use it?`, a: hl(c.text) })) },
    at2: { name: 'AT2 preprocessing', color: C.pink, icon: 'A2', cards: D.at2.map((t, i) => ({ id: 'a' + i, kind: 'AT2 technique', q: `${t.t}: what is it, what did you do in AT2, and how does it link to AT3?`,
      a: `<p><b>What:</b> ${hl(t.what)}</p><p><b>AT2:</b> ${hl(t.did)}</p><p><b>AT3 link:</b> ${hl(t.link)}</p>` }))
      .concat(D.at2Questions.map((q, i) => ({ id: 'aq' + i, kind: 'Likely AT2 question', q: q.q, a: hl(q.a) }))) }
  };
  const allCards = () => Object.values(DECKS).flatMap((d) => d.cards);
  const box = (id) => (S.cards[id] ? S.cards[id].b : -1);
  const deckStats = (d) => {
    const n = d.cards.length; let seen = 0, mastered = 0;
    d.cards.forEach((c) => { const b = box(c.id); if (b >= 0) seen++; if (b >= 3) mastered++; });
    return { n, seen, mastered };
  };

  // ---------------- mock pool ----------------
  const MOCK_SOURCES = {
    official: { name: 'Official Q1 to Q5', items: () => D.official.map((o) => ({ id: 'o' + o.id, q: o.q, a: `<div class="tag good">Good</div><p>${hl(o.good)}</p><div class="tag exc">Excellent add-on</div><p>${hl(o.excellent)}</p><div class="tag show">Show</div><p>${hl(o.show)} ${cellLinks(o.cells)}</p>` })) },
    followups: { name: 'Follow-ups 1 to 27', items: () => D.followups.map((f) => ({ id: 'f' + f.n, q: f.q, a: `<p>${hl(f.a)}</p>` })) },
    concepts: { name: '"What is X?"', items: () => D.concepts.map((c) => ({ id: 'c' + c.id, q: `What is ${c.name.replace(/ \(Week 8\)/, '')}, and how did you use it?`, a: `<p>${hl(c.text)}</p>` })) },
    models: { name: 'Explain a model', items: () => D.models.map((m, i) => ({ id: 'm' + i, q: `Explain your ${m.name.toLowerCase()}: how it decides, what you tuned and what you found.`, a: `<p><b>How:</b> ${hl(m.how)}</p><p><b>Settings:</b> ${hl(m.settings)}</p><p><b>Result:</b> ${hl(m.result)}</p><p><b>Weakness:</b> ${hl(m.weak)}</p>` }))
      .concat(D.modelNotes.map((n, i) => ({ id: 'mn' + i, q: n.title.replace(/ in one breath/, '') + '?', a: `<p>${hl(n.text)}</p>` }))) },
    code: { name: '"Show me in the code"', items: () => D.walkthrough.map((w, i) => ({ id: 'w' + i, q: `Show me ${w.section.replace(/^\d+(\.\d+)? /, '')} in your notebook. What is happening there?`,
      a: `<p>${cellLinks(w.cells)} <b>${esc(w.section)}</b></p><div class="code">${esc(w.code)}</div><p>"${hl(w.say)}"</p>` })) },
    at2: { name: 'AT2 questions', items: () => D.at2Questions.map((q, i) => ({ id: 'aq' + i, q: q.q, a: `<p>${hl(q.a)}</p>` })) }
  };

  // ---------------- timer + recorder ----------------
  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);

  function mountTimer(root, target, opts = {}) {
    const el = $('.timer', root), bar = $('.tbar', root), btn = $('[data-timer]', root);
    let start = 0, acc = 0, iv = null;
    const now = () => acc + (iv ? (Date.now() - start) / 1000 : 0);
    const draw = () => {
      const t = now();
      el.textContent = fmtTime(t);
      el.className = 'timer' + (t > target ? ' over' : t > 0 ? ' ok' : '');
      bar.className = 'tbar' + (t > target ? ' over' : '');
      $('i', bar).style.width = Math.min(100, (t / target) * 100) + '%';
    };
    const stop = () => { if (iv) { acc = now(); clearInterval(iv); iv = null; } btn.textContent = acc ? 'Resume' : 'Start timer'; draw(); };
    btn.onclick = () => {
      if (iv) { stop(); if (opts.onStop) opts.onStop(acc); return; }
      start = Date.now(); iv = setInterval(draw, 200); btn.textContent = 'Stop';
    };
    const reset = $('[data-reset]', root);
    if (reset) reset.onclick = () => { if (iv) clearInterval(iv); iv = null; acc = 0; btn.textContent = 'Start timer'; draw(); };
    draw();
    onLeave(() => iv && clearInterval(iv));
    return { stop, start: () => { if (!iv) btn.click(); }, value: now };
  }
  const timerHtml = (target, label) => `
    <div class="card">
      <div class="small" style="text-align:center">${esc(label)} · target ${fmtTime(target)}</div>
      <div class="timer">0:00</div>
      <div class="tbar"><i></i></div>
      <div class="btnrow"><button class="btn" data-timer>Start timer</button><button class="btn plain" data-reset>Reset</button></div>
    </div>`;

  function mountRecorder(root) {
    const btn = $('[data-rec]', root), audio = $('audio', root), note = $('.recnote', root);
    if (!btn) return;
    if (!(navigator.mediaDevices && window.MediaRecorder)) { btn.disabled = true; note.textContent = 'Recording is not available in this browser.'; return; }
    let rec = null, stream = null, chunks = [];
    btn.onclick = async () => {
      if (rec && rec.state === 'recording') { rec.stop(); return; }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        rec = new MediaRecorder(stream); chunks = [];
        rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
        rec.onstop = () => {
          const blob = new Blob(chunks, { type: rec.mimeType || 'audio/mp4' });
          audio.src = URL.createObjectURL(blob); audio.hidden = false;
          stream.getTracks().forEach((t) => t.stop());
          btn.textContent = '● Record again'; btn.classList.remove('bad');
          note.textContent = 'Play it back. Did you hit every beat, and say numbers to 3 decimals?';
        };
        rec.start(); btn.textContent = '■ Stop recording'; btn.classList.add('bad'); note.textContent = 'Recording… speak as if the examiner is listening.';
      } catch (e) { note.textContent = 'Microphone permission was refused, so recording is off. You can still practise with the timer.'; }
    };
    onLeave(() => { try { if (rec && rec.state === 'recording') rec.stop(); if (stream) stream.getTracks().forEach((t) => t.stop()); } catch (e) { /* ignore */ } });
  }
  const recHtml = `<div class="card"><button class="btn ghost block" data-rec>● Record yourself</button><audio controls hidden style="width:100%;margin-top:10px"></audio><div class="small recnote" style="margin-top:6px">Recording stays on this phone. Nothing is uploaded.</div></div>`;

  // ---------------- 3-layer self check ----------------
  const layerCheckHtml = `
    <div class="list" data-layers>
      <div class="check" data-l="1"><span class="box"></span><span class="lbl"><b>What</b> – I gave the direct answer in 1 sentence</span></div>
      <div class="check" data-l="2"><span class="box"></span><span class="lbl"><b>Evidence</b> – I said a number (3 decimals) and where it is in the notebook</span></div>
      <div class="check" data-l="3"><span class="box"></span><span class="lbl"><b>Why / trade-off</b> – I gave the reason, an alternative, and why I rejected it</span></div>
    </div>
    <div class="card tight" style="text-align:center"><span class="small">Your answer scores</span><div data-grade style="font-size:22px;font-weight:700">—</div></div>`;
  const gradeOf = (l) => (l[1] && l[2] && l[3] ? 'Excellent' : l[1] && l[2] ? 'Good' : l[1] ? 'Pass' : 'Not yet');
  const gradeColor = (g) => ({ Excellent: 'var(--exc)', Good: 'var(--good)', Pass: 'var(--warn)', 'Not yet': 'var(--bad)' }[g]);
  function mountLayerCheck(root, onChange) {
    const l = { 1: false, 2: false, 3: false };
    const draw = () => { const g = gradeOf(l); const el = $('[data-grade]', root); el.textContent = g; el.style.color = gradeColor(g); onChange && onChange(g, l); };
    $$('[data-layers] .check', root).forEach((c) => (c.onclick = () => { const k = c.dataset.l; l[k] = !l[k]; c.classList.toggle('on', l[k]); draw(); }));
    draw();
    return l;
  }

  // ---------------- pages ----------------
  const daysLeft = () => {
    const [y, m, d] = D.examDate.split('-').map(Number);
    const exam = new Date(y, m - 1, d); const t = new Date(); t.setHours(0, 0, 0, 0);
    return Math.round((exam - t) / 86400000);
  };
  const readiness = () => {
    const all = allCards(); const mastered = all.filter((c) => box(c.id) >= 3).length;
    const cardPart = mastered / all.length;
    const story = Math.min(S.storyRuns, 3) / 3;
    const off = D.official.filter((o) => S.official[o.id] === 'Excellent').length / 5;
    const mock = S.mocks.length ? Math.min(1, Math.max(...S.mocks.map((m) => m.pct)) / 100) : 0;
    return Math.round((cardPart * 0.4 + story * 0.2 + off * 0.2 + mock * 0.2) * 100);
  };

  const pages = {};

  pages.home = () => {
    const dl = daysLeft();
    const when = dl > 1 ? `${dl} days` : dl === 1 ? 'Tomorrow' : dl === 0 ? 'Today' : 'Done';
    const lbl = dl > 1 ? 'until your AT3 oral defence (15 Oct)' : dl === 1 ? 'is your AT3 oral defence (15 Oct). Use the one-evening plan below.' : dl === 0 ? 'is your AT3 oral defence. Run the day-of checklist.' : 'The exam date has passed. Well done.';
    const r = readiness();
    const all = allCards(); const mastered = all.filter((c) => box(c.id) >= 3).length;
    const best = S.mocks.length ? Math.max(...S.mocks.map((m) => m.pct)) + '%' : '—';
    const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
    return {
      title: 'AT3 Oral Defence', html: `
      <div class="hero">
        <div class="big">${when}</div>
        <div class="lbl">${esc(lbl)}</div>
        <div class="bar"><i style="width:${r}%"></i></div>
        <div class="lbl" style="margin-top:6px">Readiness ${r}% · cards, story, Q1 to Q5 and mocks</div>
      </div>
      <div class="stats">
        <div class="stat"><b>${mastered}/${all.length}</b><span>cards mastered</span></div>
        <div class="stat"><b>${S.storyRuns}</b><span>story run-throughs</span></div>
        <div class="stat"><b>${best}</b><span>best mock</span></div>
      </div>
      <div class="quick">
        <a href="#/learn/story"><span class="qi" style="background:${C.purple}">90</span><b>90-second story</b><span>Say this first. Practise with timer.</span></a>
        <a href="#/learn/official"><span class="qi" style="background:${C.blue}">5</span><b>Official Q1 to Q5</b><span>Good + Excellent answers</span></a>
        <a href="#/cards/numbers"><span class="qi" style="background:${C.orange}">#</span><b>Number cards</b><span>Memorise the key results</span></a>
        <a href="#/mock"><span class="qi" style="background:${C.red}">●</span><b>Mock defence</b><span>Random questions, self-score</span></a>
      </div>
      <h3>The 3-layer answer</h3>
      <div class="card">
        ${D.marking.layers.map((l) => `<div class="layer" style="margin-bottom:8px"><span class="n" style="background:${[C.blue, C.green, C.purple][l.n - 1]}">${l.n}</span><div><b>${esc(l.name)}</b> <span class="small">(${esc(l.len)})</span><div class="small">${esc(l.desc)}</div></div></div>`).join('')}
        <div class="small" style="margin-top:4px">${esc(D.marking.layersNote)}</div>
      </div>
      ${dl <= 1 && dl >= 0 ? `<h3>One-evening plan</h3><div class="list">${D.cram.map((c, i) => `<div class="check ${S.plan['c' + i] ? 'on' : ''}" data-plan="c${i}"><span class="box"></span><span class="lbl">${esc(c)}</span></div>`).join('')}</div>` : ''}
      <h3>Golden rules</h3>
      <div class="card">${D.marking.rules.map((r) => `<p>• ${esc(r)}</p>`).join('')}</div>
      ${standalone ? '' : `<h3>Install on your iPhone</h3><div class="card small">Open this page in <b>Safari</b>, tap the <b>Share</b> button, then <b>Add to Home Screen</b>. It then opens full-screen like an app and works offline.</div>`}
      <h3>Settings</h3>
      <div class="card">
        <div class="seg" data-theme-seg>${['auto', 'light', 'dark'].map((t) => `<button data-t="${t}" class="${S.theme === t ? 'on' : ''}">${t[0].toUpperCase() + t.slice(1)}</button>`).join('')}</div>
        <button class="btn plain block" data-resetall>Reset all progress</button>
      </div>
      <div class="footer">Personal study app · content from your AT3 Oral Defence Study Guide</div>`,
      after(root) {
        $$('[data-plan]', root).forEach((c) => (c.onclick = () => { const k = c.dataset.plan; S.plan[k] = !S.plan[k]; c.classList.toggle('on', S.plan[k]); save(); }));
        $$('[data-theme-seg] button', root).forEach((b) => (b.onclick = () => { S.theme = b.dataset.t; save(); applyTheme(); render(); }));
        $('[data-resetall]', root).onclick = () => { if (confirm('Reset all cards, mocks and checklists?')) { const th = S.theme; S = blank(); S.theme = th; save(); render(); toast('Progress reset'); } };
      }
    };
  };

  pages.learn = () => ({
    title: 'Learn', html: `
    <h2>Learn</h2><div class="sub">Every part of the study guide, in order.</div>
    <div class="list">
      ${row('#/learn/marking', C.gray, '1', 'How you are marked', '40 / 30 / 20 · the 3-layer method · golden rules')}
      ${row('#/learn/story', C.purple, '2', 'The 90-second story', 'Say this first · practise with timer and recorder')}
      ${row('#/learn/numbers', C.blue, '3', 'Numbers to remember', '20 results with the key ones starred')}
      ${row('#/learn/official', C.indigo, '4', 'The 5 official questions', 'Good answer + Excellent add-on + what to show')}
      ${row('#/learn/walkthrough', C.teal, '5', 'Code walkthrough', 'What to show and what to say, cell by cell')}
      ${row('#/learn/models', C.green, '6', 'Every model in plain words', '9 models · how, settings, result, weakness')}
      ${row('#/learn/concepts', C.orange, '7', 'Evaluation ideas', 'Confusion matrix, AUC, CV, bootstrap…')}
      ${row('#/learn/followups', C.red, '8', 'Follow-up and tricky questions', '27 "why" questions')}
      ${row('#/learn/at2', C.pink, '9', 'AT2 preprocessing', '13 techniques + 5 likely questions')}
      ${row('#/learn/plan', C.gray, '10', 'Practice plan and day-of checklist', '5-day plan · checklist')}
    </div>`
  });

  pages.marking = () => ({
    title: 'How you are marked', back: '#/learn', html: `
    <h2>1. How you are marked</h2>
    <div class="card"><p>${esc(D.marking.intro)}</p></div>
    ${D.marking.bands.map((b) => `<div class="card"><span class="pill ${b.mark === '40' ? 'exc' : b.mark === '30' ? 'good' : 'warn'}">${b.mark} ${esc(b.name)}</span>
      <p style="margin-top:6px"><b>What the marker sees:</b> ${esc(b.sees)}</p><p class="small" style="margin:0"><b>Your evidence:</b> ${hl(b.evidence)}</p></div>`).join('')}
    <h3>The 3-layer answer method · use it for every question</h3>
    ${D.marking.layers.map((l) => `<div class="card"><div class="layer"><span class="n" style="background:${[C.blue, C.green, C.purple][l.n - 1]}">${l.n}</span><div><b>${esc(l.name)}</b> <span class="small">(${esc(l.len)})</span><p class="small" style="margin:2px 0 6px">${esc(l.desc)}</p><div class="quote">${hl(l.ex)}</div></div></div></div>`).join('')}
    <div class="card" style="background:var(--exc-soft)"><b>${esc(D.marking.layersNote)}</b></div>
    <h3>Golden rules</h3>
    <div class="card">${D.marking.rules.map((r) => `<p>• ${hl(r)}</p>`).join('')}</div>`
  });

  // ----- story -----
  let storyMode = 'read';
  const keyRegex = (() => {
    const keys = D.storyKeys.slice().sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp('(' + keys.join('|') + ')', 'g');
  })();
  const gapText = (t) => esc(t).replace(keyRegex, (m, _k, off, str) => {
    const a = str[off - 1], b = str[off + m.length];
    if ((a && /[A-Za-z0-9]/.test(a)) || (b && /[A-Za-z0-9]/.test(b))) return m;
    return `<span class="blank" data-blank>${m}</span>`;
  });
  const cueText = (t) => esc(t).split(' ').map((w) => (/\d/.test(w) ? `<b class="num">${w}</b>` : w.replace(/^([^A-Za-z]*)([A-Za-z])([A-Za-z'-]*)/, (m, p, f, rest) => p + f + '<span style="opacity:.25">' + rest.replace(/./g, '·') + '</span>'))).join(' ');
  pages.story = () => {
    const body = D.story.map((p, i) => {
      const beat = `<div class="beat">${i + 1}. ${esc(D.storyBeats[i])}</div>`;
      if (storyMode === 'read') return beat + `<p>${hl(p)}</p>`;
      if (storyMode === 'gaps') return beat + `<p>${gapText(p)}</p>`;
      if (storyMode === 'cue') return beat + `<p data-reveal="${i}">${cueText(p)}</p>`;
      return `<details class="card"><summary>${i + 1}. ${esc(D.storyBeats[i])}</summary><p>${hl(p)}</p></details>`;
    }).join('');
    return {
      title: '90-second story', back: '#/learn', html: `
      <h2>2. The 90-second story</h2>
      <div class="sub">${esc(D.storyIntro)}</div>
      <div class="seg" data-mode>${[['read', 'Read'], ['cue', 'First letters'], ['gaps', 'Fill gaps'], ['beats', 'Beats only']].map(([k, n]) => `<button data-m="${k}" class="${storyMode === k ? 'on' : ''}">${n}</button>`).join('')}</div>
      <div class="small" style="margin:-4px 4px 10px">${{ read: 'Read it out loud, scrolling the notebook as you speak.', cue: 'Only first letters shown. Tap a paragraph to reveal it.', gaps: 'Say the hidden words, then tap a gap to check.', beats: 'Only the 5 beats. Say each part from memory, then open it to check.' }[storyMode]}</div>
      <div class="${storyMode === 'beats' ? '' : 'card story'}">${body}
        ${storyMode === 'beats' ? '' : `<div class="quote exc">Then say: "${esc(D.storyEnd)}"</div><div class="small">${esc(D.storyNote)}</div>`}</div>
      ${timerHtml(75, 'Say it out loud')}
      ${recHtml}
      <button class="btn good block" data-done>I said it out loud ✓ (${S.storyRuns} so far)</button>
      <div class="small" style="text-align:center;margin-top:8px">Day 1 goal: 3 times with the notebook open.</div>`,
      after(root) {
        $$('[data-mode] button', root).forEach((b) => (b.onclick = () => { storyMode = b.dataset.m; render(); }));
        $$('[data-blank]', root).forEach((b) => (b.onclick = () => b.classList.toggle('shown')));
        $$('[data-reveal]', root).forEach((p) => (p.onclick = () => { p.innerHTML = hl(D.story[+p.dataset.reveal]); }));
        mountTimer(root, 75);
        mountRecorder(root);
        $('[data-done]', root).onclick = (e) => { S.storyRuns++; save(); e.target.textContent = `I said it out loud ✓ (${S.storyRuns} so far)`; toast(S.storyRuns >= 3 ? 'Nice. Keep it fresh.' : `${3 - S.storyRuns} more to hit 3`); };
      }
    };
  };

  // ----- numbers -----
  let numHide = false;
  pages.numbers = () => ({
    title: 'Numbers', back: '#/learn', html: `
    <h2>3. Numbers to remember</h2>
    <div class="sub">${esc(D.numbersNote)}</div>
    <div class="seg" data-hide><button data-h="0" class="${numHide ? '' : 'on'}">Show all</button><button data-h="1" class="${numHide ? 'on' : ''}">Test me (tap to reveal)</button></div>
    <div class="list">${D.numbers.map((n, i) => `<div class="row" data-n="${i}" style="display:block;cursor:${numHide ? 'pointer' : 'default'}">
        <div class="small" style="font-weight:600">${n.key ? '★ ' : ''}${esc(n.topic)}</div>
        <div data-v style="${numHide ? 'filter:blur(7px)' : ''}">${hl(n.value)}</div></div>`).join('')}</div>
    <a class="btn block" href="#/cards/numbers">Drill ${D.numberCards.length} number flashcards</a>`,
    after(root) {
      $$('[data-hide] button', root).forEach((b) => (b.onclick = () => { numHide = b.dataset.h === '1'; render(); }));
      if (numHide) $$('[data-n]', root).forEach((r) => (r.onclick = () => { const v = $('[data-v]', r); v.style.filter = v.style.filter ? '' : 'blur(7px)'; }));
    }
  });

  // ----- official -----
  pages.official = () => ({
    title: 'Official questions', back: '#/learn', html: `
    <h2>4. The 5 official questions</h2>
    <div class="sub">Each has a Good answer (2 to 3 sentences) and the Excellent add-on (the why). Say the Good part, then the add-on.</div>
    <div class="list">${D.official.map((o) => row('#/learn/official/' + o.id, [C.blue, C.purple, C.green, C.orange, C.red][o.id - 1], 'Q' + o.id, o.q, '', S.official[o.id] ? `<span class="pill ${S.official[o.id] === 'Excellent' ? 'exc' : S.official[o.id] === 'Good' ? 'good' : 'warn'}">${S.official[o.id]}</span>` : '')).join('')}</div>
    <a class="btn block" href="#/cards/official">Flashcards for Q1 to Q5</a>`
  });

  let offPractice = false;
  pages.officialOne = (id) => {
    const o = D.official.find((x) => x.id === +id);
    if (!o) return pages.notFound();
    const prev = o.id > 1 ? `#/learn/official/${o.id - 1}` : null, next = o.id < 5 ? `#/learn/official/${o.id + 1}` : null;
    const answer = `
      <div class="card"><div class="tag good">Good (layers 1 + 2)</div><div class="quote good">${hl(o.good)}</div></div>
      <div class="card"><div class="tag exc">Excellent add-on (layer 3)</div><div class="quote exc">${hl(o.excellent)}</div></div>
      <div class="card"><div class="tag show">Show</div><p>${hl(o.show)}</p><div>${cellLinks(o.cells)}</div></div>`;
    return {
      title: 'Q' + o.id, back: '#/learn/official', html: `
      <div class="small" style="font-weight:600;color:var(--accent)">OFFICIAL QUESTION ${o.id} OF 5</div>
      <h2>${esc(o.q)}</h2>
      <div class="seg" data-pm><button data-p="0" class="${offPractice ? '' : 'on'}">Study</button><button data-p="1" class="${offPractice ? 'on' : ''}">Practise out loud</button></div>
      ${offPractice ? `
        ${timerHtml(40, 'Answer out loud')}
        <div data-hidden hidden>${answer}<h3>Score yourself</h3>${layerCheckHtml}<button class="btn block" data-saveg>Save score</button></div>
        <button class="btn ghost block" data-show>Reveal model answer</button>` : answer}
      <div class="btnrow" style="margin-top:16px">${prev ? `<a class="btn plain" href="${prev}">‹ Q${o.id - 1}</a>` : ''}${next ? `<a class="btn plain" href="${next}">Q${o.id + 1} ›</a>` : ''}</div>`,
      after(root) {
        $$('[data-pm] button', root).forEach((b) => (b.onclick = () => { offPractice = b.dataset.p === '1'; render(); }));
        if (!offPractice) return;
        const t = mountTimer(root, 40);
        let g = 'Not yet';
        $('[data-show]', root).onclick = (e) => { t.stop(); $('[data-hidden]', root).hidden = false; e.target.remove(); };
        mountLayerCheck(root, (gr) => (g = gr));
        $('[data-saveg]', root).onclick = () => { S.official[o.id] = g; save(); toast('Saved: ' + g); if (next) location.hash = next; else location.hash = '#/learn/official'; };
      }
    };
  };

  // ----- walkthrough -----
  let walkHide = false;
  pages.walkthrough = (q) => ({
    title: 'Code walkthrough', back: '#/learn', html: `
    <h2>5. Code walkthrough</h2>
    <div class="sub">${esc(D.walkIntro)}</div>
    <div class="seg" data-hide><button data-h="0" class="${walkHide ? '' : 'on'}">Show all</button><button data-h="1" class="${walkHide ? 'on' : ''}">Hide "what to say"</button></div>
    ${D.walkthrough.map((w) => `<div class="card" data-cells="${w.cells.join(',')}">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><h4>${esc(w.section)}</h4><span class="small">cell ${w.cells.join(', ')}</span></div>
        <div class="code">${esc(w.code)}</div>
        ${walkHide ? `<details><summary class="small" style="cursor:pointer">Tap to check what to say</summary><div class="quote">${hl(w.say)}</div></details>` : `<div class="quote">${hl(w.say)}</div>`}
      </div>`).join('')}
    <div class="btnrow"><a class="btn" href="#/quiz/cell">"Which cell?" quiz</a><a class="btn ghost" href="#/cards/cells">Cell flashcards</a></div>`,
    after(root) {
      $$('[data-hide] button', root).forEach((b) => (b.onclick = () => { walkHide = b.dataset.h === '1'; render(); }));
      if (q.cell) {
        const el = $$('[data-cells]', root).find((c) => c.dataset.cells.split(',').includes(q.cell));
        if (el) { el.style.outline = '2px solid var(--accent)'; setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60); }
      }
    }
  });

  // ----- models -----
  pages.models = () => ({
    title: 'Models', back: '#/learn', html: `
    <h2>6. Every model in plain words</h2>
    <div class="sub">${esc(D.modelsIntro)}</div>
    ${D.models.map((m) => `<details class="card" ${m.best ? 'open' : ''}><summary><span>${esc(m.name)} <span class="pill">${m.week}</span>${m.best ? '<span class="pill exc">Best</span>' : ''}</span></summary>
      <p><b>How it decides:</b> ${hl(m.how)}</p>
      <p><b>Settings you tuned:</b> ${hl(m.settings)}</p>
      <p><b>Your result:</b> ${hl(m.result)}</p>
      <p style="margin:0"><b>Weakness:</b> ${hl(m.weak)}</p></details>`).join('')}
    <h3>Say these in one breath</h3>
    ${D.modelNotes.map((n) => `<div class="card"><h4>${esc(n.title)}</h4><p style="margin:0">${hl(n.text)}</p></div>`).join('')}
    <div class="btnrow"><a class="btn" href="#/quiz/model">"Which model?" quiz</a><a class="btn ghost" href="#/cards/models">Model flashcards</a></div>`
  });

  // ----- concepts -----
  const CM_METRICS = {
    Accuracy: { hl: ['TP', 'TN'], hl2: ['FP', 'FN'], line: 0 },
    Recall: { hl: ['TP'], hl2: ['FN'], line: 1 },
    Precision: { hl: ['TP'], hl2: ['FP'], line: 2 },
    Specificity: { hl: ['TN'], hl2: ['FP'], line: 3 },
    F1: { hl: ['TP'], hl2: ['FP', 'FN'], line: 4 }
  };
  let cmSel = 'Recall';
  pages.concepts = () => {
    const m = CM_METRICS[cmSel]; const cm = D.cm;
    const cell = (k, label) => `<div class="c ${m.hl.includes(k) ? 'hl' : m.hl2.includes(k) ? 'hl2' : ''}"><span>${label}</span><b>${k} ${cm[k].toLocaleString('en-US')}</b></div>`;
    return {
      title: 'Evaluation ideas', back: '#/learn', html: `
      <h2>7. Evaluation ideas</h2>
      <div class="sub">${esc(D.conceptsIntro)}</div>
      <div class="card">
        <h4>Confusion matrix at 0.5 (Week 8)</h4>
        <div class="small">A 2×2 table of truth vs prediction. Tap a metric: blue = top of the fraction, orange = also in the bottom.</div>
        <div class="chips">${Object.keys(CM_METRICS).map((k) => `<button class="chip ${k === cmSel ? 'on' : ''}" data-cm="${k}">${k}</button>`).join('')}</div>
        <div class="cm">
          <div></div><div class="h">Predicted no</div><div class="h">Predicted yes</div>
          <div class="h">Actually no</div>${cell('TN', 'true negative')}${cell('FP', 'false positive')}
          <div class="h">Actually yes</div>${cell('FN', 'false negative')}${cell('TP', 'true positive')}
        </div>
        <div class="quote">${hl(D.cmLines[m.line])}</div>
        <details style="margin-top:8px"><summary class="small" style="cursor:pointer">All five formulas</summary>${D.cmLines.map((l) => `<p class="small">• ${hl(l)}</p>`).join('')}</details>
      </div>
      <div class="card">
        <h4>Cut-off 0.5 vs 0.27</h4>
        <table class="tbl"><tr><th></th><th>0.5</th><th>0.27</th></tr>
          <tr><td>Recall</td><td>${hl('79.8%')}</td><td>${hl('93.9%')}</td></tr>
          <tr><td>Precision</td><td>${hl('73.5%')}</td><td>${hl('65.4%')}</td></tr>
          <tr><td>Accuracy</td><td>${hl('75.5%')}</td><td>${hl('72.1%')}</td></tr></table>
        <p class="small" style="margin:8px 0 0">0.27 = the lowest cut-off keeping precision at 0.65 or above, chosen on out-of-fold development predictions, not the test set.</p>
      </div>
      ${D.concepts.filter((c) => c.id !== 'cm').map((c) => `<details class="card"><summary>${esc(c.name)}</summary><p style="margin:0">${hl(c.text)}</p></details>`).join('')}
      <a class="btn block" href="#/cards/concepts">Flashcards for these ideas</a>`,
      after(root) { $$('[data-cm]', root).forEach((b) => (b.onclick = () => { cmSel = b.dataset.cm; render(); })); }
    };
  };

  // ----- follow-ups -----
  pages.followups = () => {
    const groups = [...new Set(D.followups.map((f) => f.g))];
    return {
      title: 'Follow-up questions', back: '#/learn', html: `
      <h2>8. Follow-up and tricky questions</h2>
      <div class="sub">${esc(D.followIntro)} Tap a question to check your answer.</div>
      ${groups.map((g) => `<h3>About ${g === 'Honesty' ? '' : 'the '}${esc(g.toLowerCase())}</h3>${D.followups.filter((f) => f.g === g).map((f) => `<details class="card"><summary><span>${f.n}. ${esc(f.q)}</span></summary><p style="margin:0">${hl(f.a)}</p></details>`).join('')}`).join('')}
      <a class="btn block" href="#/cards/followups">Drill all 27 as flashcards</a>`
    };
  };

  // ----- AT2 -----
  pages.at2 = () => ({
    title: 'AT2 preprocessing', back: '#/learn', html: `
    <h2>9. AT2 preprocessing questions</h2>
    <div class="sub">${esc(D.at2Intro)}</div>
    ${D.at2.map((t) => `<details class="card"><summary>${esc(t.t)}</summary>
      <p><b>What it is:</b> ${hl(t.what)}</p><p><b>What you did in AT2:</b> ${hl(t.did)}</p><p style="margin:0"><b>Link to AT3:</b> ${hl(t.link)}</p></details>`).join('')}
    <h3>Likely AT2 questions</h3>
    ${D.at2Questions.map((q) => `<details class="card"><summary>${esc(q.q)}</summary><p style="margin:0">${hl(q.a)}</p></details>`).join('')}
    <a class="btn block" href="#/cards/at2">AT2 flashcards</a>`
  });

  // ----- plan + checklist -----
  pages.plan = () => ({
    title: 'Plan & checklist', back: '#/learn', html: `
    <h2>10. Practice plan and day-of checklist</h2>
    <div class="sub">${esc(D.planIntro)}</div>
    <h3>5-day plan</h3>
    <div class="list">${D.plan.map((p) => `<div class="check ${S.plan['d' + p.day] ? 'on' : ''}" data-plan="d${p.day}"><span class="box"></span><span class="lbl"><b>Day ${p.day}</b> – ${esc(p.text)}</span></div>`).join('')}</div>
    <h3>If you only have one evening</h3>
    <div class="list">${D.cram.map((c, i) => `<div class="check ${S.plan['c' + i] ? 'on' : ''}" data-plan="c${i}"><span class="box"></span><span class="lbl">${esc(c)}</span></div>`).join('')}</div>
    <h3>Day-of checklist</h3>
    <div class="small" style="margin:0 4px 8px">${esc(D.checklistNote)}</div>
    <div class="list">${D.checklist.map((c, i) => `<div class="check ${S.checklist[i] ? 'on' : ''}" data-cl="${i}"><span class="box"></span><span class="lbl">${hl(c)}</span></div>`).join('')}</div>
    <button class="btn plain block" data-clreset>Untick checklist</button>`,
    after(root) {
      $$('[data-plan]', root).forEach((c) => (c.onclick = () => { const k = c.dataset.plan; S.plan[k] = !S.plan[k]; c.classList.toggle('on', S.plan[k]); save(); }));
      $$('[data-cl]', root).forEach((c) => (c.onclick = () => { const k = c.dataset.cl; S.checklist[k] = !S.checklist[k]; c.classList.toggle('on', S.checklist[k]); save(); }));
      $('[data-clreset]', root).onclick = () => { S.checklist = {}; save(); render(); };
    }
  });

  // ----- practice hub -----
  pages.practice = () => ({
    title: 'Practice', html: `
    <h2>Practice</h2><div class="sub">Flashcards remember what you know. Cards you miss come back first.</div>
    <h3>Flashcard decks</h3>
    <div class="list">${Object.entries(DECKS).map(([k, d]) => { const s = deckStats(d); return row('#/cards/' + k, d.color, d.icon, d.name, `${s.mastered} of ${s.n} mastered · ${s.n - s.seen} new`, ''); }).join('')}</div>
    <a class="btn ghost block" href="#/cards/all">Mixed review: weakest cards from every deck</a>
    <h3>Quick quizzes</h3>
    <div class="list">
      ${row('#/quiz/model', C.green, 'M', '"Which model?"', 'A clue from your results → pick the model', S.quizBest.model != null ? 'best ' + S.quizBest.model + '/10' : '')}
      ${row('#/quiz/cell', C.teal, '{}', '"Which cell?"', 'Code or a line you say → pick the section', S.quizBest.cell != null ? 'best ' + S.quizBest.cell + '/10' : '')}
    </div>
    <h3>Speak it</h3>
    <div class="list">
      ${row('#/learn/story', C.purple, '90', '90-second story', 'Timer, recorder, first-letter and gap modes')}
      ${row('#/learn/official/1', C.indigo, '5', 'Official Q1 to Q5 out loud', '40-second timer + 3-layer self-score')}
      ${row('#/mock', C.red, '●', 'Mock defence', 'Random examiner questions')}
    </div>`
  });

  // ----- flashcards -----
  let session = null;
  pages.cards = (deckKey) => {
    const deck = deckKey === 'all' ? { name: 'Mixed review', cards: allCards() } : DECKS[deckKey];
    if (!deck) return pages.notFound();
    if (!session || session.deck !== deckKey) {
      const sorted = shuffle(deck.cards).sort((a, b) => box(a.id) - box(b.id));
      session = { deck: deckKey, queue: sorted.slice(0, deckKey === 'all' ? 25 : Math.min(30, sorted.length)), i: 0, again: 0, ok: 0, requeued: {} };
    }
    const s = session;
    if (s.i >= s.queue.length) {
      const st = deckKey === 'all' ? null : deckStats(deck);
      return {
        title: deck.name, back: '#/practice', html: `
        <div class="card" style="text-align:center;padding:28px 16px">
          <div style="font-size:44px">🎉</div><h2>Session done</h2>
          <p>${s.ok} got it · ${s.again} to repeat</p>
          ${st ? `<p class="small">${st.mastered} of ${st.n} cards mastered in this deck</p>` : ''}
          <div class="btnrow"><button class="btn" data-again>Another round</button><a class="btn plain" href="#/practice">Back</a></div>
        </div>`,
        after(root) { $('[data-again]', root).onclick = () => { session = null; render(); }; }
      };
    }
    const c = s.queue[s.i]; const b = box(c.id);
    return {
      title: deck.name, back: '#/practice', html: `
      <div style="display:flex;justify-content:space-between" class="small"><span>${s.i + 1} / ${s.queue.length}</span><span>${b < 0 ? 'New card' : 'Box ' + (b + 1) + ' of 5'}</span></div>
      <div class="progress"><i style="width:${(s.i / s.queue.length) * 100}%"></i></div>
      <div class="fc" data-fc><div class="fc-inner">
        <div class="fc-face fc-front"><div class="kind">${esc(c.kind)}</div><div class="q">${esc(c.q)}</div><div class="hint">Say your answer out loud, then tap to flip</div></div>
        <div class="fc-face fc-back"><div class="kind">Answer</div><div class="a" style="margin-top:14px">${c.a}</div></div>
      </div></div>
      <div data-rate hidden>
        <div class="btnrow"><button class="btn bad" data-r="0">Again</button><button class="btn warn" data-r="1">Unsure</button><button class="btn good" data-r="2">Got it</button></div>
      </div>
      <button class="btn ghost block" data-flip>Show answer</button>
      <div class="boxes" style="margin-top:14px">${[0, 1, 2, 3, 4].map((i) => `<i style="${i <= b ? 'background:var(--good)' : ''}"></i>`).join('')}</div>
      <div class="small" style="text-align:center;margin-top:4px">Box 4+ counts as mastered</div>`,
      after(root) {
        const fc = $('[data-fc]', root), rate = $('[data-rate]', root), flip = $('[data-flip]', root);
        const doFlip = () => { fc.classList.toggle('flipped'); rate.hidden = false; flip.hidden = true; };
        fc.onclick = doFlip; flip.onclick = doFlip;
        // size card to content
        const back = $('.fc-back', root); const inner = $('.fc-inner', root);
        inner.style.minHeight = Math.max(290, back.scrollHeight + 10) + 'px';
        $$('[data-r]', root).forEach((btn) => (btn.onclick = (e) => {
          e.stopPropagation();
          const r = +btn.dataset.r; const cur = S.cards[c.id] ? S.cards[c.id].b : -1;
          let nb = r === 0 ? 0 : r === 1 ? Math.max(0, Math.min(cur, 1)) : Math.min(4, cur + 1);
          if (r === 2 && cur < 0) nb = 1;
          S.cards[c.id] = { b: nb, t: Date.now() }; save();
          if (r === 2) s.ok++; else { s.again++; if (!s.requeued[c.id]) { s.requeued[c.id] = 1; s.queue.push(c); } }
          s.i++; render();
        }));
      }
    };
  };

  // ----- quizzes -----
  let quiz = null;
  const makeQuiz = (type) => {
    if (type === 'model') {
      const names = D.models.map((m) => m.name);
      const qs = shuffle(D.models.flatMap((m) => [
        { clue: 'How it decides: ' + m.how, ans: m.name },
        { clue: 'Your result: ' + m.result, ans: m.name },
        { clue: 'Weakness: ' + m.weak, ans: m.name }
      ])).slice(0, 10);
      return qs.map((q) => ({ ...q, opts: shuffle([q.ans, ...shuffle(names.filter((n) => n !== q.ans)).slice(0, 3)]) }));
    }
    const label = (w) => `${w.section} (cell ${w.cells.join(', ')})`;
    const labels = D.walkthrough.map(label);
    const qs = shuffle(D.walkthrough.flatMap((w) => [
      { clue: 'You point at: ' + w.code, ans: label(w) },
      { clue: 'You say: "' + w.say + '"', ans: label(w) }
    ])).slice(0, 10);
    return qs.map((q) => ({ ...q, opts: shuffle([q.ans, ...shuffle(labels.filter((n) => n !== q.ans)).slice(0, 3)]) }));
  };
  pages.quiz = (type) => {
    if (type !== 'model' && type !== 'cell') return pages.notFound();
    if (!quiz || quiz.type !== type) quiz = { type, qs: makeQuiz(type), i: 0, score: 0, answered: false };
    const title = type === 'model' ? 'Which model?' : 'Which cell?';
    const back = '#/practice';
    if (quiz.i >= quiz.qs.length) {
      const sc = quiz.score;
      if (S.quizBest[type] == null || sc > S.quizBest[type]) { S.quizBest[type] = sc; save(); }
      return { title, back, html: `<div class="card" style="text-align:center;padding:28px 16px"><h2>${sc} / 10</h2><p class="small">Best: ${S.quizBest[type]} / 10</p>
        <div class="btnrow"><button class="btn" data-again>Play again</button><a class="btn plain" href="${type === 'model' ? '#/learn/models' : '#/learn/walkthrough'}">Review</a></div></div>`,
        after(root) { $('[data-again]', root).onclick = () => { quiz = null; render(); }; } };
    }
    const q = quiz.qs[quiz.i];
    return {
      title, back, html: `
      <div class="small" style="display:flex;justify-content:space-between"><span>Question ${quiz.i + 1} of 10</span><span>Score ${quiz.score}</span></div>
      <div class="progress"><i style="width:${quiz.i * 10}%"></i></div>
      <div class="card"><div class="tag" style="color:var(--accent)">${type === 'model' ? 'Which model is this?' : 'Which section of your notebook?'}</div><p style="font-size:17px;margin:4px 0 0">${type === 'cell' && q.clue.startsWith('You point') ? 'You point at: <span class="code">' + esc(q.clue.replace('You point at: ', '')) + '</span>' : hl(q.clue)}</p></div>
      ${q.opts.map((o) => `<button class="opt" data-o="${esc(o)}">${esc(o)}</button>`).join('')}
      <button class="btn block" data-next hidden>Next</button>`,
      after(root) {
        $$('[data-o]', root).forEach((b) => (b.onclick = () => {
          if (quiz.answered) return; quiz.answered = true;
          const ok = b.dataset.o === q.ans; if (ok) quiz.score++;
          $$('[data-o]', root).forEach((x) => { if (x.dataset.o === q.ans) x.classList.add('right'); else if (x === b) x.classList.add('wrong'); });
          $('[data-next]', root).hidden = false;
        }));
        $('[data-next]', root).onclick = () => { quiz.i++; quiz.answered = false; render(); };
      }
    };
  };

  // ----- mock defence -----
  let mock = null;
  let mockCfg = { n: 10, src: { official: true, followups: true, concepts: true, models: true, code: true, at2: true } };
  pages.mock = () => {
    if (!mock) {
      const hist = S.mocks.slice(-5).reverse();
      return {
        title: 'Mock defence', html: `
        <h2>Mock defence</h2>
        <div class="sub">The app plays the examiner. Answer out loud in under 40 seconds, reveal the model answer, then tick which of the 3 layers you actually said.</div>
        <div class="card"><b>Open with the 90-second story?</b><p class="small" style="margin:4px 0 0">In the real defence you say the story first. Practise it on the story page, then come back here for questions.</p></div>
        <h3>Number of questions</h3>
        <div class="seg" data-n>${[5, 10, 20].map((n) => `<button data-v="${n}" class="${mockCfg.n === n ? 'on' : ''}">${n}</button>`).join('')}</div>
        <h3>Question types</h3>
        <div class="list">${Object.entries(MOCK_SOURCES).map(([k, s]) => `<div class="check ${mockCfg.src[k] ? 'on' : ''}" data-src="${k}"><span class="box"></span><span class="lbl">${esc(s.name)} <span class="small">(${s.items().length})</span></span></div>`).join('')}</div>
        <button class="btn block" data-start>Start mock defence</button>
        ${hist.length ? `<h3>Recent mocks</h3><div class="list">${hist.map((m) => `<div class="row" style="cursor:default"><span class="t"><b>${m.pct}% Excellent-ready</b><span>${new Date(m.at).toLocaleString()} · ${m.n} questions · ${m.exc} Excellent, ${m.good} Good</span></span></div>`).join('')}</div>` : ''}`,
        after(root) {
          $$('[data-n] button', root).forEach((b) => (b.onclick = () => { mockCfg.n = +b.dataset.v; render(); }));
          $$('[data-src]', root).forEach((c) => (c.onclick = () => { const k = c.dataset.src; mockCfg.src[k] = !mockCfg.src[k]; c.classList.toggle('on', mockCfg.src[k]); }));
          $('[data-start]', root).onclick = () => {
            const pool = Object.entries(MOCK_SOURCES).filter(([k]) => mockCfg.src[k]).flatMap(([, s]) => s.items());
            if (!pool.length) { toast('Pick at least one type'); return; }
            // official questions first (they are always asked), then a random mix
            const off = mockCfg.src.official ? shuffle(pool.filter((p) => p.id[0] === 'o')).slice(0, Math.min(2, mockCfg.n)) : [];
            const rest = shuffle(pool.filter((p) => !off.includes(p))).slice(0, mockCfg.n - off.length);
            mock = { qs: shuffle(off.concat(rest)), i: 0, results: [], phase: 'ask' };
            render();
          };
        }
      };
    }
    if (mock.i >= mock.qs.length) {
      const n = mock.results.length, exc = mock.results.filter((r) => r.g === 'Excellent').length, good = mock.results.filter((r) => r.g === 'Good').length;
      const pct = Math.round((exc / n) * 100);
      if (!mock.saved) { S.mocks.push({ at: Date.now(), n, exc, good, pct }); save(); mock.saved = true; }
      const weak = mock.results.filter((r) => r.g !== 'Excellent');
      return {
        title: 'Mock result', html: `
        <div class="card" style="text-align:center;padding:24px 16px">
          <div class="small">EXCELLENT-READY</div><div style="font-size:52px;font-weight:750;letter-spacing:-.03em">${pct}%</div>
          <p>${exc} Excellent · ${good} Good · ${n - exc - good} below Good</p>
          <p class="small">Excellent = what + a number + why/trade-off. Good = what + a number.</p>
        </div>
        ${weak.length ? `<h3>Go over these again</h3>${weak.map((r) => `<details class="card"><summary><span>${esc(r.q.q)} <span class="pill ${r.g === 'Good' ? 'good' : 'bad'}">${r.g}</span></span></summary>${r.q.a}</details>`).join('')}` : '<div class="card" style="text-align:center">Every answer reached Excellent. 🎉</div>'}
        <button class="btn block" data-new>New mock</button>`,
        after(root) { $('[data-new]', root).onclick = () => { mock = null; render(); }; }
      };
    }
    const q = mock.qs[mock.i];
    return {
      title: `Question ${mock.i + 1} of ${mock.qs.length}`, html: `
      <div class="progress"><i style="width:${(mock.i / mock.qs.length) * 100}%"></i></div>
      <div class="card" style="padding:20px 18px"><div class="tag" style="color:var(--accent)">Examiner asks</div><div style="font-size:21px;font-weight:650;line-height:1.3">${esc(q.q)}</div></div>
      ${timerHtml(40, 'Answer out loud')}
      <div data-ans hidden><h3>Model answer</h3><div class="card">${q.a}</div><h3>Which layers did you say?</h3>${layerCheckHtml}<button class="btn block" data-next>Next question</button></div>
      <button class="btn ghost block" data-reveal>I've answered · reveal</button>
      <button class="btn plain block" style="margin-top:8px" data-quit>End mock</button>`,
      after(root) {
        const t = mountTimer(root, 40); t.start();
        let g = 'Not yet';
        $('[data-reveal]', root).onclick = (e) => { t.stop(); $('[data-ans]', root).hidden = false; e.target.remove(); };
        mountLayerCheck(root, (gr) => (g = gr));
        $('[data-next]', root).onclick = () => { mock.results.push({ q, g }); mock.i++; render(); };
        $('[data-quit]', root).onclick = () => { if (mock.results.length) { mock.qs = mock.qs.slice(0, mock.results.length); mock.i = mock.qs.length; } else mock = null; render(); };
      }
    };
  };

  // ----- search -----
  const INDEX = (() => {
    const ix = [];
    const add = (title, text, href) => ix.push({ title, text, href, low: (title + ' ' + text).toLowerCase() });
    add('How you are marked', D.marking.intro + ' ' + D.marking.layersNote + ' ' + D.marking.rules.join(' '), '#/learn/marking');
    D.story.forEach((p) => add('90-second story', p, '#/learn/story'));
    D.numbers.forEach((n) => add('Number: ' + n.topic, n.value, '#/learn/numbers'));
    D.official.forEach((o) => add('Q' + o.id + '. ' + o.q, o.good + ' ' + o.excellent + ' Show: ' + o.show, '#/learn/official/' + o.id));
    D.walkthrough.forEach((w) => add('Cell ' + w.cells.join(', ') + ' · ' + w.section, w.code + ' — ' + w.say, '#/learn/walkthrough?cell=' + w.cells[0]));
    D.models.forEach((m) => add('Model: ' + m.name, [m.how, m.settings, m.result, m.weak].join(' · '), '#/learn/models'));
    D.modelNotes.forEach((n) => add(n.title, n.text, '#/learn/models'));
    D.concepts.forEach((c) => add(c.name, c.text, '#/learn/concepts'));
    D.followups.forEach((f) => add(f.n + '. ' + f.q, f.a, '#/learn/followups'));
    D.at2.forEach((t) => add('AT2: ' + t.t, [t.what, t.did, t.link].join(' · '), '#/learn/at2'));
    D.at2Questions.forEach((q) => add('AT2: ' + q.q, q.a, '#/learn/at2'));
    return ix;
  })();
  let lastQuery = '';
  const markQ = (s, q) => { const e = esc(s); if (!q) return e; const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'); return e.replace(re, '<mark>$1</mark>'); };
  const snippet = (t, q) => { const i = t.toLowerCase().indexOf(q); if (i < 0 || t.length < 160) return t; const s = Math.max(0, i - 60); return (s ? '…' : '') + t.slice(s, s + 170) + '…'; };
  pages.search = () => ({
    title: 'Search', html: `
    <h2>Search</h2>
    <input class="search" type="search" placeholder="Try: pid, 0.27, cell 57, bootstrap, k-NN" value="${esc(lastQuery)}" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div data-res></div>`,
    after(root) {
      const inp = $('input', root), res = $('[data-res]', root);
      const run = () => {
        const q = inp.value.trim().toLowerCase(); lastQuery = inp.value;
        if (!q) { res.innerHTML = '<div class="empty">Search every answer, number and cell in your guide.</div>'; return; }
        const terms = q.split(/\s+/);
        const hits = INDEX.filter((x) => terms.every((t) => x.low.includes(t))).slice(0, 40);
        res.innerHTML = hits.length ? `<div class="list">${hits.map((h) => `<a class="row" href="${h.href}" style="display:block"><b style="font-weight:600">${markQ(h.title, terms[0])}</b><div class="small">${markQ(snippet(h.text, terms[0]), terms[0])}</div></a>`).join('')}</div>` : '<div class="empty">No matches.</div>';
      };
      inp.oninput = run; run();
    }
  });

  pages.notFound = () => ({ title: 'Not found', back: '#/home', html: '<div class="empty">That page does not exist.</div>' });

  // ---------------- router ----------------
  const parse = () => {
    const h = location.hash.replace(/^#\/?/, '') || 'home';
    const [path, qs] = h.split('?');
    const q = {}; (qs || '').split('&').filter(Boolean).forEach((kv) => { const [k, v] = kv.split('='); q[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
    return { parts: path.split('/').filter(Boolean), q };
  };
  const route = ({ parts, q }) => {
    const [a, b, c] = parts;
    if (a === 'home') return [pages.home(), 'home'];
    if (a === 'learn' && !b) return [pages.learn(), 'learn'];
    if (a === 'learn') {
      if (b === 'official' && c) return [pages.officialOne(c), 'learn'];
      const map = { marking: pages.marking, story: pages.story, numbers: pages.numbers, official: pages.official, walkthrough: pages.walkthrough, models: pages.models, concepts: pages.concepts, followups: pages.followups, at2: pages.at2, plan: pages.plan };
      return [map[b] ? map[b](q) : pages.notFound(), 'learn'];
    }
    if (a === 'practice') return [pages.practice(), 'practice'];
    if (a === 'cards') return [pages.cards(b), 'practice'];
    if (a === 'quiz') return [pages.quiz(b), 'practice'];
    if (a === 'mock') return [pages.mock(), 'mock'];
    if (a === 'search') return [pages.search(), 'search'];
    return [pages.notFound(), ''];
  };

  let lastRoute = '';
  function render() {
    cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); cleanups = [];
    const r = parse();
    const key = r.parts.join('/');
    if (key !== lastRoute) {
      // leaving a deck or quiz restarts it next time
      if (!key.startsWith('cards')) session = null;
      if (!key.startsWith('quiz')) quiz = null;
    }
    const [page, tab] = route(r);
    $('#title').textContent = page.title || '';
    const back = $('#back');
    back.innerHTML = page.back ? `${ICON.back}<span>Back</span>` : '';
    back.onclick = page.back ? () => { location.hash = page.back; } : null;
    const main = $('main');
    main.innerHTML = page.html;
    $$('.tabbar a').forEach((t) => t.classList.toggle('on', t.dataset.tab === tab));
    if (key !== lastRoute) window.scrollTo(0, 0);
    lastRoute = key;
    if (page.after) page.after(main);
  }

  // tab bar
  $('.tabbar').innerHTML = [['home', 'Home'], ['learn', 'Learn'], ['practice', 'Practice'], ['mock', 'Mock'], ['search', 'Search']]
    .map(([k, n]) => `<a href="#/${k}" data-tab="${k}">${ICON[k]}<span>${n}</span></a>`).join('');

  window.addEventListener('hashchange', render);
  render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
  }
})();
