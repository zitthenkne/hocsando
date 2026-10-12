/* app.js — engine: điều hướng từng màn, bố cục trang, bài giảng động (scene), tiện ích tương tác dùng chung */
(function () {
  // append/prepend/replaceChildren nhận cả mảng lồng nhau, bỏ qua null/false
  ['append', 'prepend', 'replaceChildren'].forEach(m => {
    const o = Element.prototype[m];
    Element.prototype[m] = function (...a) { return o.apply(this, a.flat(9).filter(x => x != null && x !== false)); };
  });
  const $ = s => document.querySelector(s);
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function h(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const k in props || {}) {
      const v = props[k];
      if (k === 'class') e.className = v;
      else if (k === 'style' && typeof v === 'object') for (const s in v) (s.includes('-') ? e.style.setProperty(s, v[s]) : (e.style[s] = v[s]));
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    e.append(kids.flat(9).map(c => (c && c.nodeType) || c == null || c === false ? c : String(c)));
    return e;
  }
  window.h = h; window.pick = pick; window.CH = [];
  window.PARTS = { A: ['Nền tảng', '🧱'], B: ['Ghi đúng', '✏️'], C: ['Đọc đúng', '👀'], D: ['Lý giải & xử trí', '🩺'], E: ['Ôn thi', '🏆'] };
  const praise = ['Đỉnh luôn!', 'Chuẩn rồi!', 'Xịn xò!', 'Giỏi dữ vậy trời!', 'Ăn điểm nha!'];
  window.praise = praise;

  const st = { ci: 0, si: 0, done: {}, miss: [], right: 0, asked: 0 };
  let token = 0, cleanup = null, curKey = '', dir = 1;
  const load = () => { try { const o = JSON.parse(localStorage.getItem('sando2') || '{}'); st.done = o.done || {}; st.ci = o.ci || 0; st.si = o.si || 0; } catch (e) { } };
  const save = () => { try { localStorage.setItem('sando2', JSON.stringify({ ci: st.ci, si: st.si, done: st.done })); } catch (e) { } };
  const content = c => c.steps.filter(s => !s.cover && !s.recap);
  const total = () => CH.reduce((n, c) => n + c.steps.length, 0);

  /* ---------- hiệu ứng & phản hồi ---------- */
  function burst(el, emo) {
    if (window.RM) return;
    const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const x = r.left + r.width / 2, y = r.top + r.height / 2, list = emo || ['✨', '🌸', '⭐', '💖', '🎀'];
    for (let i = 0; i < 8; i++) {
      const s = h('i', { class: 'sp', style: { left: x + 'px', top: y + 'px', '--dx': (Math.random() * 150 - 75) + 'px', '--dy': (-30 - Math.random() * 110) + 'px' } }, pick(list));
      $('#fx').append(s); setTimeout(() => s.remove(), 1000);
    }
  }
  window.burst = burst;
  let tt = 0;
  function toast(msg, kind) {
    const t = $('#toast'); if (!msg) return;
    t.textContent = msg; t.className = 'show ' + (kind || 'info');
    clearTimeout(tt); tt = setTimeout(() => { t.className = kind || 'info'; }, 2600);
  }
  window.toast = toast;

  /* ---------- 1 màn hình ---------- */
  function go(ci, si) {
    if (cleanup) { try { cleanup(); } catch (e) { } cleanup = null; }
    $('#map').hidden = true;
    ci = Math.max(0, Math.min(CH.length - 1, ci)); si = Math.max(0, Math.min(CH[ci].steps.length - 1, si));
    dir = (ci * 100 + si) >= (st.ci * 100 + st.si) ? 1 : -1;
    st.ci = ci; st.si = si; save();
    const my = ++token, c = CH[ci], s = c.steps[si], key = ci + '.' + si; curKey = key;
    const body = h('div', { class: 'body' }), xb = h('div', { class: 'xbox' });
    const no = s.cover ? 'Chương ' + (ci + 1) : s.recap ? '🧠' : (ci + 1) + '.' + s.n;
    const page = h('section', { class: 'page c-' + c.c + (dir < 0 ? ' back' : '') + (s.cover ? ' iscover' : '') },
      h('div', { class: 'phead' }, h('h2', { class: 'ttl' }, h('span', { class: 'no' }, no), ' ' + s.t), h('span', { class: 'okb' }, '✓ Xong')),
      s.say ? h('div', { class: 'task' }, h('b', {}, '👉'), h('span', {}, s.say)) : null, body);
    $('#stage').replaceChildren(page);
    scrollTo(0, 0);
    const ctx = {
      say(t) { if (!t) { xb.replaceChildren(); xb.classList.remove('on'); return; } xb.replaceChildren(t); xb.classList.remove('on'); void xb.offsetWidth; xb.classList.add('on'); if (!xb.isConnected) body.append(xb); },
      xbox: () => xb,
      ok(m) { toast(m || pick(praise), 'ok'); }, oops(m) { toast(m || 'Chưa đúng, thử lại nè!', 'no'); }, info(m) { toast(m, 'info'); },
      later(fn, ms) { return setTimeout(() => { if (my === token) fn(); }, ms); },
      alive: () => my === token,
      done() {
        if (my !== token) return;
        if (!st.done[key]) { st.done[key] = 1; save(); burst($('#stars')); }
        page.classList.add('is-done'); $('#next').classList.remove('lock'); $('#next').classList.add('ready'); refresh();
      },
      need(n) { let k = 0; return () => { if (++k >= n) ctx.done(); }; }
    };
    $('#next').classList.toggle('lock', !!s.gate && !st.done[key]);
    $('#next').classList.remove('ready');
    if (st.done[key]) page.classList.add('is-done');
    try { cleanup = s.run(body, ctx) || null; }
    catch (e) { body.append(h('pre', { class: 'err' }, 'Lỗi màn này: ' + e.message)); console.error(e); }
    if (st.done[key]) $('#next').classList.add('ready');
    refresh();
    try { history.replaceState(null, '', '#' + ci + '.' + si); } catch (e) { }
  }
  function step(d) {
    let ci = st.ci, si = st.si + d;
    if (si < 0) { if (ci === 0) return; ci--; si = CH[ci].steps.length - 1; }
    else if (si >= CH[ci].steps.length) { if (ci === CH.length - 1) return; ci++; si = 0; }
    go(ci, si);
  }
  function refresh() {
    const c = CH[st.ci], n = Object.keys(st.done).length;
    $('#stars').textContent = `⭐ ${n}/${total()}`;
    $('#bar i').style.width = (n / total() * 100) + '%';
    const tabs = $('#tabs');
    tabs.querySelectorAll('.tab').forEach((b, i) => {
      b.classList.toggle('now', i === st.ci);
      b.classList.toggle('ok', CH[i].steps.every((_, j) => st.done[i + '.' + j]));
      if (i === st.ci && tabs.scrollWidth > tabs.clientWidth) tabs.scrollLeft = b.offsetLeft - tabs.offsetLeft - tabs.clientWidth / 2 + b.offsetWidth / 2;
    });
    $('#where').replaceChildren(h('span', { class: 'pp' }, PARTS[c.part][1] + ' ' + PARTS[c.part][0]), h('b', {}, ` ${c.e} Chương ${st.ci + 1} · ${c.t}`));
    $('#dots').replaceChildren(c.steps.map((s, i) => h('button', {
      class: 'dot' + (i === st.si ? ' now' : '') + (st.done[st.ci + '.' + i] ? ' ok' : '') + (s.cover || s.recap ? ' sq' : ''),
      title: s.t, 'aria-label': s.t, onclick: () => go(st.ci, i)
    })));
    const k = st.si + 1, m = c.steps.length;
    $('#pos').textContent = `${k} / ${m}`;
    $('#prev').disabled = st.ci === 0 && st.si === 0;
    const last = st.ci === CH.length - 1 && st.si === m - 1;
    $('#next').style.visibility = last ? 'hidden' : '';
    $('#next').textContent = st.si === m - 1 ? 'Chương sau ▶' : 'Tiếp ▶';
  }
  function openMap() {
    const m = $('#map'), groups = {};
    CH.forEach((c, ci) => (groups[c.part] = groups[c.part] || []).push([c, ci]));
    m.replaceChildren(h('div', { class: 'mapin' },
      h('div', { class: 'mtop' }, h('h2', {}, '🗺️ Mục lục'), h('button', { class: 'chip c-pink', onclick: () => m.hidden = true }, '✖ đóng')),
      Object.keys(groups).map(p => h('div', { class: 'mpart' },
        h('div', { class: 'mph' }, PARTS[p][1] + ' Phần ' + p + ' · ' + PARTS[p][0]),
        groups[p].map(([c, ci]) => {
          const d = c.steps.filter((_, si) => st.done[ci + '.' + si]).length;
          return h('div', { class: 'mc c-' + c.c },
            h('div', { class: 'mch' }, h('b', {}, c.e + ' ' + (ci + 1) + '. ' + c.t), h('span', { class: 'mprog' }, h('i', { style: { width: (d / c.steps.length * 100) + '%' } })), h('small', {}, d + '/' + c.steps.length)),
            h('div', { class: 'ms' }, c.steps.map((s, si) => h('button', { class: 'chip' + (st.done[ci + '.' + si] ? ' on' : '') + (ci === st.ci && si === st.si ? ' here' : ''), onclick: () => { m.hidden = true; go(ci, si); } }, s.cover ? '🎯 Mục tiêu' : s.recap ? '🧠 Chốt' : s.n + '. ' + s.t))));
        }))),
      h('div', { class: 'row' }, h('button', { class: 'chip', onclick() { if (confirm('Xoá toàn bộ tiến độ ⭐?')) { st.done = {}; save(); m.hidden = true; go(0, 0); } } }, '🧹 Xoá tiến độ'))));
    m.hidden = false;
  }

  /* ---------- màn mở chương / chốt chương (sinh tự động) ---------- */
  const coverStep = (c, ci) => ({
    t: 'Mục tiêu chương', cover: true, say: 'Đọc 3 mục tiêu rồi bấm Tiếp ▶', run(host, ctx) {
      const cs = content(c);
      host.append(h('div', { class: 'chcover' },
        h('div', { class: 'part' }, PARTS[c.part][1] + ' Phần ' + c.part + ' · ' + PARTS[c.part][0]),
        h('div', { class: 'chem' }, c.e), h('div', { class: 'bigt' }, c.t),
        h('div', { class: 'goals' }, c.goals.map((g, i) => h('div', { class: 'goal', style: { 'animation-delay': (.15 + i * .15) + 's' } }, h('span', { class: 'gi' }, ['🎯', '🧩', '🏁'][i] || '✨'), g))),
        h('div', { class: 'chmap' }, cs.map(s => h('span', { class: 'pill' }, s.n + '. ' + s.t))),
        h('div', { class: 'cap' }, `${cs.length} màn · khoảng ${Math.max(3, Math.round(cs.length * 1.3))} phút`)));
      ctx.done();
    }
  });
  const recapStep = c => ({
    t: 'Chốt chương', recap: true, say: 'Tự trả lời trong đầu trước, rồi lật thẻ để kiểm tra', run(host, ctx) {
      tapCards(host, ctx, c.keys.map(([q, a], i) => ({ e: ['🤔', '💭', '🧐'][i % 3], f: q, b: a, c: ['pink', 'blue', 'mint'][i % 3], q: true })));
      const ci = CH.indexOf(c), cs = c.steps.map((s, si) => [s, si]).filter(([s]) => !s.cover && !s.recap);
      host.append(h('div', { class: 'cap' }, `⭐ Đã xong ${cs.filter(([, si]) => st.done[ci + '.' + si]).length}/${cs.length} màn của chương này`));
    }
  });

  /* ---------- tiện ích bố cục ---------- */
  window.box = (p, o) => {
    o = o || {};
    const lg = o.legend === false ? null : h('div', { class: 'legend' },
      h('span', {}, h('i', { class: 'lx' }, '✕'), 'Mở CTC'), h('span', {}, h('i', { class: 'lo' }, '○'), 'Ngôi'),
      h('span', {}, h('i', { class: 'la' }), 'Báo động'), h('span', {}, h('i', { class: 'lc' }), 'Hành động'));
    return h('div', { class: 'chartbox' + (o.cls ? ' ' + o.cls : '') }, lg, p.el);
  };
  /* bố cục 2 cột: hình bên trái, lời giảng/điều khiển bên phải (xếp dọc trên điện thoại) */
  window.lay = (vis, side, cls) => h('div', { class: 'lay ' + (cls || '') }, h('div', { class: 'vis' }, vis), h('div', { class: 'side' }, side));

  window.seg = function (items, on, start) {
    start = start || 0;
    const w = h('div', { class: 'seg', role: 'tablist' }), bs = items.map(([k, t], i) => {
      const b = h('button', { class: 'chip' + (i === start ? ' on' : ''), role: 'tab', onclick() { bs.forEach(x => x.classList.remove('on')); b.classList.add('on'); on(k, i); } }, t);
      return b;
    });
    w.append(bs); w.pick = i => bs[i].click(); return w;
  };
  window.slider = function (o) {
    const out = h('b', { class: 'val' });
    const i = h('input', { type: 'range', min: o.min, max: o.max, step: o.step || 1, value: o.value, class: 'rng', 'aria-label': o.label || '' });
    const f = () => { out.textContent = o.fmt ? o.fmt(+i.value) : i.value; o.on && o.on(+i.value); };
    i.addEventListener('input', f);
    const w = h('label', { class: 'sl' }, o.label ? h('span', {}, o.label) : null, i, out);
    w.init = f; w.set = v => { i.value = v; f(); }; return w;
  };
  window.stamp = (t, cls) => h('div', { class: 'stamp ' + (cls || '') }, t);
  window.note = (t, cls) => h('div', { class: 'note ' + (cls || '') }, t);

  /* thẻ lật: bấm để xem mặt sau; lật đủ `need` thẻ thì xong màn */
  window.tapCards = function (host, ctx, items, need) {
    const tick = ctx.need(need || items.length), wrap = h('div', { class: 'cards' });
    items.forEach(it => {
      const c = h('button', {
        class: 'flip c-' + (it.c || 'pink') + (it.q ? ' qc' : ''), 'aria-label': it.f, onclick() {
          if (c.classList.contains('on')) { c.classList.toggle('on'); return; }
          c.classList.add('on'); burst(c, ['✨']); if (it.say) ctx.say(it.say); tick();
        }
      }, h('div', { class: 'in' }, h('div', { class: 'ff' }, h('span', { class: 'em' }, it.e), h('b', {}, it.f), h('small', {}, 'chạm để lật')), h('div', { class: 'fb' }, it.b)));
      wrap.append(c);
    });
    host.append(wrap); return wrap;
  };

  /* trắc nghiệm: o = {q, opts, ans, why, wrong:{i:msg}, time, onEnd(good)} */
  window.Q = function (ctx, host, o) {
    const box = h('div', { class: 'q' }), list = h('div', { class: 'opts' });
    let over = false, wrongs = 0;
    const max = Math.min(2, o.opts.length - 1);
    const timer = o.time ? h('div', { class: 'timer' }, h('i', { style: { animationDuration: o.time + 's' } })) : null;
    if (o.q) box.append(h('div', { class: 'qq' }, h('span', { class: 'qi' }, '❓'), o.q));
    box.append(timer, list);
    const bs = o.opts.map((t, i) => {
      const b = h('button', {
        class: 'opt', onclick() {
          if (over || b.disabled) return;
          if (i === o.ans) { b.classList.add('good'); burst(b); ctx.ok(); end(true); }
          else {
            b.classList.add('bad'); b.disabled = true; wrongs++;
            ctx.oops((o.wrong && o.wrong[i]) || 'Chưa đúng. Thử lại nè!');
            if (wrongs >= max) end(false);
          }
        }
      }, h('span', { class: 'k' }, 'ABCDEF'[i]), h('span', {}, t));
      list.append(b); return b;
    });
    function end(good) {
      if (over) return; over = true;
      if (timer) timer.classList.add('stop');
      bs.forEach((b, i) => { b.disabled = true; if (i === o.ans) b.classList.add('good'); });
      if (o.why) box.append(h('div', { class: 'why' }, h('b', {}, good ? '✅ ' : '💡 Đáp án ' + 'ABCDEF'[o.ans] + ': '), o.why));
      o.onEnd && o.onEnd(good);
      ctx.done();
    }
    if (o.time) ctx.later(() => { if (!over) { ctx.oops('Hết giờ!'); end(false); } }, o.time * 1000);
    host.append(box); return box;
  };

  /* xếp từng thẻ ✅ / ❌ */
  window.sorter = function (host, ctx, items, yes, no) {
    let i = 0;
    const stage = h('div', { class: 'sortbox' }), fb = h('div', { class: 'fb2' }), prog = h('div', { class: 'sprog' });
    const show = () => {
      stage.replaceChildren(); prog.textContent = items.map((_, j) => j < i ? '🟢' : j === i ? '🟡' : '⚪').join(' ');
      if (i >= items.length) { stage.append(h('div', { class: 'allok' }, '🎉 Xếp đủ rồi!')); ctx.done(); return; }
      stage.append(h('div', { class: 'scard' }, items[i].t),
        h('div', { class: 'row' }, h('button', { class: 'btn good', onclick: () => ans(true) }, yes), h('button', { class: 'btn bad', onclick: () => ans(false) }, no)));
    };
    const ans = v => {
      const it = items[i];
      if (v === it.ok) { burst(stage); ctx.ok(); fb.replaceChildren(note('✅ ' + it.why, 'm')); i++; ctx.later(show, 1300); }
      else { ctx.oops('Ủa? Nghĩ lại nè.'); fb.replaceChildren(note('💡 ' + it.why, 'p')); stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); }
    };
    host.append(prog, stage, fb); show();
  };

  /* ---------- BÀI GIẢNG ĐỘNG ----------
     o = { vis, p?, beats:[{ t, run(b){…}, ask?:{q, opts, ans, no:{i:msg}}, ms? }], reset(), auto?, onEnd? }
     b = { fast, later(fn, ms) } — fast=true khi tua lại (vẽ tức thì). Câu hỏi (ask) chặn cảnh tới khi trả lời đúng. */
  window.scene = function (ctx, o) {
    const B = o.beats; let k = -1, tok = 0, playing = o.auto !== false && !window.RM, ended = false;
    const tl = h('ol', { class: 'tl' });
    const mk = (t, title, fn) => h('button', { class: 'sc-b', title, 'aria-label': title, onclick: fn }, t);
    const bPlay = mk('⏸', 'Phát / tạm dừng', () => { playing = !playing; if (playing) go(k >= B.length - 1 ? 0 : k + 1); else sync(); });
    const bPrev = mk('◀', 'Bước trước', () => { playing = false; go(k - 1); });
    const bNext = mk('▶', 'Bước sau', () => { playing = false; go(k + 1); });
    const bRe = mk('⟲', 'Xem lại từ đầu', () => { playing = true; go(0); });
    const cnt = h('span', { class: 'sc-n' }), meter = h('div', { class: 'sc-meter' }, h('i'));
    const panel = h('div', { class: 'panel' }, h('div', { class: 'sc-ctl' }, h('b', { class: 'sc-h' }, '🎬 Giảng bài'), cnt, bRe, bPrev, bPlay, bNext), meter, tl);
    const root = h('div', { class: 'lesson' }, h('div', { class: 'vis' }, o.vis), panel);
    const solved = new Set();
    function sync() {
      bPlay.textContent = playing ? '⏸' : '▶︎';
      cnt.textContent = (k + 1) + '/' + B.length;
      meter.firstChild.style.width = ((k + 1) / B.length * 100) + '%';
      bPrev.disabled = k <= 0;
      bNext.disabled = k >= B.length - 1 || (B[k].ask && !solved.has(k));
    }
    function askUI(i) {
      const a = B[i].ask, w = h('div', { class: 'sc-ask' }, h('div', { class: 'sc-q' }, '❓ ' + a.q));
      const row = h('div', { class: 'row left' });
      a.opts.forEach((t, j) => {
        const b = h('button', {
          class: 'chip' + (solved.has(i) && j === a.ans ? ' on' : ''), onclick() {
            if (solved.has(i)) return;
            if (j === a.ans) { solved.add(i); b.classList.add('on'); burst(b); ctx.ok(a.ok); playing = true; sync(); ctx.later(() => { if (k === i) go(i + 1); }, 650); }
            else { b.classList.add('bad'); ctx.oops((a.no && a.no[j]) || 'Chưa đúng, nghĩ lại nè!'); }
          }
        }, t);
        row.append(b);
      });
      w.append(row); return w;
    }
    function render() {
      tl.replaceChildren(B.slice(0, k + 1).map((b, i) => {
        const txt = b.ask && i < k ? [b.t, ' ', b.ask.q, ' → ', h('b', {}, '✅ ' + b.ask.opts[b.ask.ans])] : b.t;
        const li = h('li', { class: i === k ? 'now' : 'past', onclick: () => { if (i !== k) { playing = false; go(i); } } }, h('span', { class: 'bn' }, i < k ? '✓' : i + 1), h('div', { class: 'bt' }, txt));
        if (b.ask && i === k) li.append(askUI(i));
        return li;
      }));
      if (k === B.length - 1) tl.append(h('li', { class: 'end' }, h('span', { class: 'bn' }, '🏁'), h('div', { class: 'bt' }, o.end || 'Xong bài giảng! Bấm ⟲ xem lại hoặc Tiếp ▶')));
      tl.scrollTop = tl.scrollHeight;
    }
    function go(n) {
      n = Math.max(0, Math.min(B.length - 1, n));
      for (let i = 0; i < n; i++) if (B[i].ask && !solved.has(i)) { n = i; break; }
      k = n; const my = ++tok;
      const api = fast => ({ fast, later: (fn, ms) => fast ? fn() : ctx.later(() => { if (my === tok) fn(); }, ms) });
      o.reset && o.reset();
      for (let i = 0; i < n; i++) { if (o.p) o.p.fast = true; B[i].run && B[i].run(api(true)); }
      if (o.p) o.p.fast = false;
      B[n].run && B[n].run(api(false));
      if (B[n].ask && !solved.has(n)) playing = false;
      if (n === B.length - 1) { playing = false; if (!ended) { ended = true; o.onEnd && o.onEnd(); ctx.done(); } }
      render(); sync();
      if (playing) ctx.later(() => { if (my === tok && playing) go(k + 1); }, B[n].ms || o.ms || 3800);
    }
    ctx.later(() => go(0), 60);
    return root;
  };

  /* BÀI TẬP NHIỀU BƯỚC trên 1 sản đồ.
     task = { ask, info?, tap:[x,y] | opts:[...], ans | act:'nhãn nút', hint?, why?, no?, then() } */
  window.drill = function (ctx, p, tasks, o) {
    o = o || {}; let k = 0, bad = 0;
    const card = h('div', { class: 'frame stack' }), log = h('ol', { class: 'tl' });
    const finish = t => { t.then && t.then(); if (t.why) ctx.say(h('div', {}, '💡 ', t.why)); log.prepend(h('li', { class: 'past' }, h('span', { class: 'bn' }, '✓'), h('div', { class: 'bt' }, t.short || t.ask))); k++; ctx.later(show, 650); };
    function show() {
      card.replaceChildren(); bad = 0;
      if (k >= tasks.length) { card.append(stamp(o.end || '🎉 Xong bài tập!', 'ok')); ctx.done(); return; }
      const t = tasks[k];
      card.append(h('div', { class: 'row left' }, h('span', { class: 'pill' }, `Bước ${k + 1}/${tasks.length}`)), t.info ? note(t.info, 'b') : null, h('div', { class: 'qq' }, t.ask));
      if (t.opts) {
        const list = h('div', { class: 'stack' });
        t.opts.forEach((s, i) => { const b = h('button', { class: 'opt', onclick() {
          if (b.disabled) return;
          if (i === t.ans) { b.classList.add('good'); burst(b); ctx.ok(); finish(t); }
          else { b.classList.add('bad'); b.disabled = true; ctx.oops((t.no && t.no[i]) || 'Chưa đúng, nghĩ lại nè!'); }
        } }, h('span', { class: 'k' }, 'ABCD'[i]), h('span', {}, s)); list.append(b); });
        card.append(list);
      } else if (t.act) card.append(h('div', { class: 'row' }, h('button', { class: 'btn go', onclick() { this.disabled = true; finish(t); } }, t.act)));
      else card.append(h('div', { class: 'cap' }, '👆 Chạm vào đúng ô trên sản đồ'), t.hint ? h('button', { class: 'chip c-lav', onclick() { p.col(t.tap[0]); ctx.say(h('div', {}, '💡 ', t.hint)); } }, '💡 Gợi ý') : null);
    }
    p.onGrid(({ x, y }) => {
      const t = tasks[k]; if (!t || !t.tap) return;
      if (x === t.tap[0] && y === t.tap[1]) { p.gOver.querySelectorAll('.band').forEach(e => e.remove()); ctx.ok(); finish(t); }
      else { bad++; ctx.oops(y !== t.tap[1] ? `Tung độ phải là ${t.tap[1]} cm.` : 'Sai hoành độ rồi.'); if (bad >= 2 && t.hint) ctx.say(h('div', {}, '💡 ', t.hint)); }
    });
    show();
    return h('div', { class: 'stack' }, card, log);
  };

  /* chạy lần lượt các lần khám của 1 ca lên sản đồ (dùng cho hình nền động) */
  window.play = function (p, c, ctx, o) {
    o = o || {}; const gap = o.gap || 700;
    const run = () => {
      p.clear();
      c.X.forEach((pt, i) => ctx.later(() => { p.exam(c, i); if (i === c.X.length - 1 && o.then) o.then(); }, 300 + i * gap));
      if (o.loop) ctx.later(run, 300 + c.X.length * gap + 2600);
    };
    run(); return 300 + c.X.length * gap;
  };
  /* vẽ ngay cả ca (không animation) */
  window.plotNow = (p, c) => { const f = p.fast; p.fast = true; c.X.forEach((_, i) => p.exam(c, i)); p.fast = f; };

  /* các ca mẫu. X=[giờ,CTC] · O=ngôi/5 · L=ối · M=biến dạng · C=[số cơn, độ dài 0:<20s 1:20–40s 2:>40s] */
  window.CASE = {
    typ: { X: [[0, 4], [1, 6], [2, 7], [3, 9], [4, 10]], O: [5, 4, 3, 1, 0], L: ['C', 'T', 'T', 'T', 'T'], M: ['0', '0', '+', '+', '+'], C: [[3, 1], [4, 1], [4, 2], [4, 2], [5, 2]] },
    full: { X: [[0, 4], [1, 6], [2, 7], [3, 9], [4, 10]], O: [5, 4, 3, 1, 0], Pos: [null, 'CCTT', 'CCTT', 'CV', null], L: ['C', 'T', 'T', 'T', 'T'], M: ['0', '0', '+', '+', '+'], C: [[3, 1], [4, 1], [4, 2], [4, 2], [5, 2]],
      F: [140, 142, 138, 146, 140], P: [80, 82, 84, 84, 86], BP: [[120, 70], null, [118, 72], null, [120, 74]], T: ['37', null, '37', null, '37,2'], U: [['−', '−', '150'], null, null, null, ['−', '−', '100']], D: [null, 'dịch', null, null, null] },
    dec: { X: [[0, 4], [1, 6], [2, 8], [3, 9], [4, 10]], O: [5, 5, 4, 4, 3], L: ['C', 'T', 'T', 'T', 'T'], M: ['0', '+', '++', '+++', '+++'], C: [[4, 1], [5, 2], [5, 2], [5, 2], [5, 2]] },
    fast: { X: [[0, 4], [1, 8], [2, 10]], O: [4, 2, 0], L: ['T', 'T', 'T'], M: ['0', '0', '0'], C: [[5, 2], [5, 2], [5, 2]] },
    weak: { X: [[0, 4], [2, 5], [4, 6]], O: [5, 5, 4], L: ['T', 'T', 'T'], M: ['0', '0', '0'], C: [[2, 1], [2, 1], [2, 1]] },
    bag: { X: [[0, 4], [2, 5], [4, 6]], O: [5, 5, 5], L: ['C', 'C', 'C'], M: ['0', '0', '0'], C: [[3, 1], [3, 1], [3, 1]] },
    stuck: { X: [[0, 4], [2, 4.8], [4, 5], [6, 6], [8, 6.6]], O: [5, 5, 5, 5, 5], L: ['T', 'T', 'T', 'T', 'T'], M: ['0', '+', '++', '++', '+++'], C: [[4, 2], [5, 2], [5, 2], [5, 2], [5, 2]] }
  };

  /* ---------- khởi động ---------- */
  window.Sando = {
    st,
    start() {
      CH.forEach((c, ci) => {
        let n = 0; c.steps.forEach(s => { s.n = ++n; });
        if (c.goals) c.steps.unshift(coverStep(c, ci));
        if (c.keys) c.steps.push(recapStep(c));
      });
      load();
      // tab chương, nhóm theo phần
      let lp = '';
      CH.forEach((c, ci) => {
        if (c.part !== lp) { lp = c.part; $('#tabs').append(h('span', { class: 'pt', title: 'Phần ' + c.part + ' · ' + PARTS[c.part][0] }, c.part)); }
        $('#tabs').append(h('button', { class: 'tab c-' + c.c, title: (ci + 1) + '. ' + c.t, 'aria-label': 'Chương ' + (ci + 1) + ': ' + c.t, onclick: () => go(ci, 0) }, c.e));
      });
      $('#prev').onclick = () => step(-1);
      $('#next').onclick = () => {
        const b = $('#next');
        if (b.classList.contains('lock')) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); toast('Làm xong phần tương tác của màn này đã nha 👆', 'no'); return; }
        step(1);
      };
      $('#menu').onclick = openMap; $('#home').onclick = () => go(0, 0);
      addEventListener('keydown', e => {
        if (e.target.tagName === 'INPUT') return;
        if (e.key === 'ArrowRight') $('#next').click(); else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'Escape') $('#map').hidden = true;
      });
      const m = /^#(\d+)\.(\d+)$/.exec(location.hash);
      if (m) go(+m[1], +m[2]); else go(st.ci, st.si);
      addEventListener('hashchange', () => { const q = /^#(\d+)\.(\d+)$/.exec(location.hash); if (q && q[1] + '.' + q[2] !== curKey) go(+q[1], +q[2]); });
    }
  };
})();
