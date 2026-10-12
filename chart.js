/* chart.js — tờ sản đồ WHO bằng SVG (không thư viện)
   Toạ độ dữ liệu: x = cột giờ (0..X1), y = cm CTC (0..10). Ngôi n/5 vẽ ở y = n.
   p.fast = true → vẽ tức thì, không animation (dùng khi tua lại cảnh). */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  function S(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in a || {}) e.setAttribute(k, a[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  window.S = S;
  let uid = 0;

  function dash(l, ms) {
    let len = 0;
    if (l.tagName === 'line') len = Math.hypot(+l.getAttribute('x2') - +l.getAttribute('x1'), +l.getAttribute('y2') - +l.getAttribute('y1'));
    else try { len = l.getTotalLength(); } catch (e) { }
    if (!len) return;
    l.style.strokeDasharray = len;
    l.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: ms || 450, easing: 'ease-out' });
  }
  window.dash = dash;

  /* icon kiểu thế (theo hình handout): trên = khớp vệ (trước), dưới = xương cùng (sau), PHẢI hình = TRÁI mẹ.
     Vùng hồng nhỏ = thóp sau, chỉ về phía chẩm. */
  window.POS = { CV: [-90, 'Chẩm vệ'], CCTT: [-45, 'Chẩm chậu trái trước'], CCTN: [0, 'Chẩm chậu trái ngang'], CCTS: [45, 'Chẩm chậu trái sau'],
    CC: [90, 'Chẩm cùng'], CCPS: [135, 'Chẩm chậu phải sau'], CCPN: [180, 'Chẩm chậu phải ngang'], CCPT: [-135, 'Chẩm chậu phải trước'] };
  window.drawPos = function (parent, cx, cy, r, kind, still) {
    const a = POS[kind][0] * Math.PI / 180, g = S('g', { class: 'posi' + (still ? '' : ' pop') }, parent);
    g.style.transformOrigin = cx + 'px ' + cy + 'px';
    const pt = (t, k) => [cx + Math.cos(t) * r * k, cy + Math.sin(t) * r * k];
    const J = pt(a, .48), A1 = pt(a - .8, 1), A2 = pt(a + .8, 1), B = pt(a + Math.PI, 1);
    S('circle', { cx, cy, r, class: 'ph' }, g);
    S('path', { d: 'M' + J + 'L' + A1 + 'A' + r + ',' + r + ' 0 0 1 ' + A2 + 'Z', class: 'pf' }, g);
    S('path', { d: 'M' + A1 + 'L' + J + 'L' + A2 + 'M' + J + 'L' + B, class: 'ps' }, g);
    S('title', {}, g).textContent = POS[kind][1];
    return g;
  };

  window.Partograph = function (o) {
    o = o || {};
    const mod = o.mode !== 'orig', id = 'pg' + (++uid);
    const A = mod ? { x: 0, y: 4 } : { x: 8, y: 3 };
    let gap = o.gap || 4, fast = false;
    const X1 = o.x1 || (mod ? 12 : 19), cw = o.cw || (mod ? 38 : 25), rh = 22, LM = 64, TM = 4, rowH = 19;
    const R = Object.assign({ liquor: true, cont: true, oxy: true, fhr: false, mom: false }, o.rows);
    const W = (X1 + 1) * cw;

    // tim thai 100–180 (8 nấc × 8px) ở trên cùng, như tờ WHO
    const fhrTop = TM + 4, FH = 64;
    const top0 = R.fhr ? fhrTop + FH + 10 : TM;
    const liqTop = top0, mouldTop = top0 + rowH;
    const ctcTop = top0 + (R.liquor ? rowH * 2 + 6 : 0) + 12;
    const ctcBot = ctcTop + rh * 10;
    const hourY = ctcBot + 13;
    let yy = ctcBot + 18;
    const timeY = yy + 9; if (o.times) yy += 14;          // giờ thực tế dưới trục giờ
    const contTop = yy; if (R.cont) yy += 5 * 12 + 4;
    const oxyTop = yy; if (R.oxy) yy += 30;
    // phần dưới: thuốc & dịch · mạch•/HA↕ (60–180) · nhiệt độ · nước tiểu
    const drugTop = yy + 4, pbTop = drugTop + 28, PB = 60, tempTop = pbTop + PB + 6, urTop = tempTop + 19;
    if (R.mom) yy = urTop + 39;
    const H = yy + 6;
    const fy = v => fhrTop + (180 - v) / 10 * 8, by = v => pbTop + (180 - v) / 20 * 10;

    const px = x => LM + (x + .5) * cw, py = y => ctcTop + (10 - y) * rh;
    const P = (x, y) => px(x) + ',' + py(y);
    const alertY = x => A.y + (x - A.x), actionY = x => A.y + (x - A.x - gap);
    const pop = c => (fast ? c : c + ' pop');

    const svg = S('svg', { viewBox: `0 0 ${LM + W + 6} ${H}`, class: 'pg', role: 'img', 'aria-label': 'Sản đồ' });
    const defs = S('defs', {}, svg);
    const clip = S('clipPath', { id: id + 'c' }, defs);
    S('rect', { x: LM, y: ctcTop, width: W, height: rh * 10 }, clip);
    const pd = S('pattern', { id: id + 'd', width: 5, height: 5, patternUnits: 'userSpaceOnUse' }, defs);
    S('circle', { cx: 2.5, cy: 2.5, r: 1.1, class: 'ink' }, pd);
    const ph = S('pattern', { id: id + 'h', width: 4.5, height: 4.5, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    S('line', { x1: 0, y1: 0, x2: 0, y2: 4.5, class: 'inkl' }, ph);

    // --- tim thai
    const grid = (y0, h, step, cls) => {
      S('rect', { x: LM, y: y0, width: W, height: h, class: 'bg' }, svg);
      for (let c = 0; c <= X1 + 1; c++) S('line', { x1: LM + c * cw, y1: y0, x2: LM + c * cw, y2: y0 + h, class: 'gl' }, svg);
      for (let k = 0; k <= h / step; k++) S('line', { x1: LM, y1: y0 + k * step, x2: LM + W, y2: y0 + k * step, class: cls || 'gl' }, svg);
    };
    if (R.fhr) {
      grid(fhrTop, FH, 8);
      S('rect', { x: LM, y: fy(160), width: W, height: fy(120) - fy(160), class: 'fhrz' }, svg);
      [180, 160, 140, 120, 100].forEach(v => S('text', { x: LM - 5, y: fy(v) + 3.5, class: 'rl', 'text-anchor': 'end' }, svg).textContent = v);
      S('text', { x: 4, y: fhrTop + 26, class: 'rl hr' }, svg).textContent = 'Tim';
      S('text', { x: 4, y: fhrTop + 38, class: 'rl hr' }, svg).textContent = 'thai';
    }
    // --- hàng ối / biến dạng
    if (R.liquor) {
      [['Ối', liqTop], ['Biến dạng', mouldTop]].forEach(([t, y0]) => {
        S('text', { x: LM - 5, y: y0 + 13, class: 'rl', 'text-anchor': 'end' }, svg).textContent = t;
        for (let c = 0; c <= X1; c++) S('rect', { x: LM + c * cw, y: y0, width: cw, height: rowH, class: 'cell' }, svg);
      });
    }
    // --- khung CTC
    S('rect', { x: LM, y: ctcTop, width: W, height: rh * 10, class: 'bg' }, svg);
    const gz = S('g', { 'clip-path': `url(#${id}c)` }, svg);
    const zl = S('polygon', { class: 'zl' }, gz), zm = S('polygon', { class: 'zm' }, gz), zr = S('polygon', { class: 'zr' }, gz);
    if (!mod) {
      S('rect', { x: LM, y: py(3), width: px(A.x) - cw / 2 - LM, height: ctcBot - py(3), class: 'lat' }, gz);
      S('text', { x: LM + 8, y: py(1.4), class: 'lbl' }, svg).textContent = 'tiềm thời';
      S('text', { x: LM + 8, y: py(.7), class: 'lbl' }, svg).textContent = '(CTC < 3 cm)';
    }
    for (let c = 0; c <= X1 + 1; c++) S('line', { x1: LM + c * cw, y1: ctcTop, x2: LM + c * cw, y2: ctcBot, class: 'gl' }, svg);
    for (let v = 0; v <= 10; v++) {
      S('line', { x1: LM, y1: py(v), x2: LM + W, y2: py(v), class: v === 5 ? 'gt' : 'gl' }, svg);
      S('text', { x: LM - 26, y: py(v) + 4, class: 'num', 'text-anchor': 'end' }, svg).textContent = v;
      if (v <= 5) S('text', { x: LM - 7, y: py(v) + 4, class: 'numo', 'text-anchor': 'end' }, svg).textContent = v;
    }
    S('text', { x: LM - 24, y: ctcTop - 4, class: 'rl num', 'text-anchor': 'end' }, svg).textContent = '✕ cm';
    S('text', { x: LM - 3, y: py(5.6), class: 'rl numo', 'text-anchor': 'end' }, svg).textContent = '○/5';
    for (let c = 0; c <= X1; c++) S('text', { x: px(c), y: hourY, class: 'lbl', 'text-anchor': 'middle' }, svg).textContent = c;
    S('text', { x: LM - 5, y: hourY, class: 'rl', 'text-anchor': 'end' }, svg).textContent = 'Giờ';

    // --- hàng cơn co / oxytocin
    if (R.cont) {
      for (let r = 0; r < 5; r++) {
        S('text', { x: LM - 5, y: contTop + r * 12 + 10, class: 'rl', 'text-anchor': 'end' }, svg).textContent = 5 - r;
        for (let c = 0; c <= X1; c++) S('rect', { x: LM + c * cw, y: contTop + r * 12, width: cw, height: 12, class: 'cell' }, svg);
      }
      S('text', { x: 4, y: contTop + 34, class: 'rl' }, svg).textContent = 'Cơn co';
    }
    if (R.oxy) {
      [['IU/L', 0], ['giọt/p', 1]].forEach(([t, r]) => {
        S('text', { x: LM - 5, y: oxyTop + r * 15 + 11, class: 'rl', 'text-anchor': 'end' }, svg).textContent = t;
        for (let c = 0; c <= X1; c++) S('rect', { x: LM + c * cw, y: oxyTop + r * 15, width: cw, height: 15, class: 'cell' }, svg);
      });
    }
    if (o.times) {
      S('text', { x: LM - 5, y: timeY, class: 'rl', 'text-anchor': 'end' }, svg).textContent = 'Lúc';
      o.times.forEach(([x, t]) => S('text', { x: px(x), y: timeY, class: 'lbl tm', 'text-anchor': 'middle' }, svg).textContent = t);
    }
    if (R.mom) {
      S('text', { x: LM - 5, y: drugTop + 16, class: 'rl', 'text-anchor': 'end' }, svg).textContent = 'Thuốc/dịch';
      for (let c = 0; c <= X1; c++) S('rect', { x: LM + c * cw, y: drugTop, width: cw, height: 24, class: 'cell' }, svg);
      grid(pbTop, PB, 10);
      [180, 140, 100, 60].forEach(v => S('text', { x: LM - 5, y: by(v) + 3.5, class: 'rl', 'text-anchor': 'end' }, svg).textContent = v);
      S('text', { x: 4, y: pbTop + 26, class: 'rl hr' }, svg).textContent = 'Mạch •';
      S('text', { x: 4, y: pbTop + 38, class: 'rl hr' }, svg).textContent = 'HA ↕';
      S('text', { x: LM - 5, y: tempTop + 11, class: 'rl', 'text-anchor': 'end' }, svg).textContent = 'Nhiệt °C';
      for (let c = 0; c <= X1; c++) S('rect', { x: LM + c * cw, y: tempTop, width: cw, height: 15, class: 'cell' }, svg);
      ['Đạm niệu', 'Acetone', 'Thể tích'].forEach((t, r) => {
        S('text', { x: LM - 5, y: urTop + r * 13 + 10, class: 'rl', 'text-anchor': 'end' }, svg).textContent = t;
        for (let c = 0; c <= X1; c++) S('rect', { x: LM + c * cw, y: urTop + r * 13, width: cw, height: 13, class: 'cell' }, svg);
      });
    }

    // --- đường báo động / hành động
    const gLines = S('g', {}, svg);
    const alertL = S('line', { class: 'alert' }, gLines), actionL = S('line', { class: 'action' }, gLines);
    const alertT = S('text', { class: 'ltxt a' }, gLines), actionT = S('text', { class: 'ltxt c' }, gLines);
    alertT.textContent = 'BÁO ĐỘNG'; actionT.textContent = 'HÀNH ĐỘNG';
    const ang = -Math.atan2(rh, cw) * 180 / Math.PI;
    function layout() {
      const e = 10 - A.y;
      const poly = pts => pts.map(p => P(p[0], p[1])).join(' ');
      zl.setAttribute('points', poly([[A.x - .5, A.y], [A.x, A.y], [A.x + e, 10], [A.x - .5, 10]]));
      zm.setAttribute('points', poly([[A.x, A.y], [A.x + e, 10], [A.x + gap + e, 10], [A.x + gap, A.y]]));
      zr.setAttribute('points', poly([[A.x + gap, A.y], [A.x + gap + e, 10], [X1 + .6, 10], [X1 + .6, A.y]]));
      const set = (l, x0, x1) => { l.setAttribute('x1', px(x0)); l.setAttribute('y1', py(A.y)); l.setAttribute('x2', px(x1)); l.setAttribute('y2', py(10)); };
      set(alertL, A.x, A.x + e); set(actionL, A.x + gap, A.x + gap + e);
      const m = e * .42;
      const lt = (t, x, y) => { const X = px(x) - 9, Y = py(y) - 8; t.setAttribute('x', X); t.setAttribute('y', Y); t.setAttribute('transform', `rotate(${ang} ${X} ${Y})`); t.setAttribute('text-anchor', 'middle'); };
      lt(alertT, A.x + m, A.y + m); lt(actionT, A.x + gap + m, A.y + m);
      actionT.style.display = (A.x + gap + m > X1 + .4) ? 'none' : '';
    }
    layout();
    // ẩn/hiện từng phần để "dựng" sản đồ trong cảnh giảng
    const parts = { alert: [alertL, alertT], action: [actionL, actionT], zones: [zl, zm, zr] };
    function show(part, on) {
      (parts[part] || []).forEach(e => { e.style.display = on ? '' : 'none'; });
      if (on && !fast && part !== 'zones') dash(parts[part][0], 900);
      if (on && !fast && part === 'zones') parts.zones.forEach(z => z.animate([{ opacity: 0 }, { opacity: getComputedStyle(z).opacity }], { duration: 700 }));
    }
    if (o.bare) ['alert', 'action', 'zones'].forEach(k => show(k, false));

    // --- lớp dữ liệu
    const gCells = S('g', { class: 'mv' }, svg), gData = S('g', { class: 'mv' }, svg), gOver = S('g', {}, svg);
    let lastX = null, lastO = null;
    const xs = [], os = [];

    function addX(x, y, opt) {
      opt = opt || {};
      const cx = px(x), cy = py(y);
      if (lastX && opt.join !== false) { const l = S('line', { x1: lastX[0], y1: lastX[1], x2: cx, y2: cy, class: 'xline' }, gData); if (!fast && opt.anim !== false) dash(l); }
      const g = S('g', { class: pop('xmark'), transform: `translate(${cx} ${cy})` }, gData);
      S('title', {}, g).textContent = `Giờ ${x} · CTC ${y} cm`;
      S('circle', { r: 11, class: 'hit' }, g);
      S('path', { d: 'M-6-6L6 6M6-6L-6 6' }, g);
      lastX = [cx, cy]; xs.push({ x, y }); return g;
    }
    function addO(x, f, opt) {
      opt = opt || {};
      const cx = px(x), cy = py(f);
      if (lastO) { const l = S('line', { x1: lastO[0], y1: lastO[1], x2: cx, y2: cy, class: 'oline' }, gData); if (!fast && opt.anim !== false) dash(l); }
      const c = S('circle', { cx, cy, r: 6, class: pop('omark') }, gData);
      S('title', {}, c).textContent = `Giờ ${x} · ngôi ${f}/5`;
      c.style.transformOrigin = `${cx}px ${cy}px`;
      lastO = [cx, cy]; os.push({ x, f }); return c;
    }
    function cellText(x, rowTop, t) {
      const e = S('text', { x: px(x), y: rowTop + 14, class: pop('cellt'), 'text-anchor': 'middle' }, gCells);
      e.textContent = t; e.style.transformOrigin = `${px(x)}px ${rowTop + 10}px`; return e;
    }
    const setLiquor = (x, t) => R.liquor && cellText(x, liqTop, t);
    const setMould = (x, t) => R.liquor && cellText(x, mouldTop, t);
    function setCont(x, n, dur) {
      if (!R.cont) return;
      const fill = ['url(#' + id + 'd)', 'url(#' + id + 'h)', '#4b3b5c'][dur || 0];
      for (let i = 0; i < n; i++) {
        const r = S('rect', { x: px(x) - cw / 2 + 1.5, y: contTop + (4 - i) * 12 + 1.5, width: cw - 3, height: 9, rx: 2, class: pop('cfill'), fill }, gCells);
        r.style.transformOrigin = `${px(x)}px ${contTop + (4 - i) * 12 + 6}px`;
      }
    }
    function setOxy(x, top, bot) {
      if (!R.oxy) return;
      const t1 = S('text', { x: px(x), y: oxyTop + 11, class: 'cellt s', 'text-anchor': 'middle' }, gCells); t1.textContent = top || '';
      const t2 = S('text', { x: px(x), y: oxyTop + 26, class: 'cellt s', 'text-anchor': 'middle' }, gCells); t2.textContent = bot || '';
    }
    function oxySpan(x0, x1) {
      if (!R.oxy) return;
      S('rect', { x: px(x0) - cw / 2 + 1, y: oxyTop + 2, width: (x1 - x0 + 1) * cw - 2, height: 11, rx: 5, class: 'oxbar' }, gCells);
    }
    // tim thai (chấm •, nối liền) · mạch • · HA ↕ · nhiệt · nước tiểu · thuốc
    let lastF = null, lastP = null;
    function setFHR(x, v) {
      if (!R.fhr) return;
      const cx = px(x), cy = fy(Math.max(100, Math.min(180, v)));
      if (lastF) { const l = S('line', { x1: lastF[0], y1: lastF[1], x2: cx, y2: cy, class: 'fline' }, gData); if (!fast) dash(l); }
      const c = S('circle', { cx, cy, r: 3.6, class: pop('fdot' + (v > 160 || v < 120 ? ' bad' : '')) }, gData);
      S('title', {}, c).textContent = `Giờ ${x} · tim thai ${v} lần/phút`; c.style.transformOrigin = `${cx}px ${cy}px`;
      lastF = [cx, cy];
    }
    function setPulse(x, v) {
      if (!R.mom) return;
      const cx = px(x), cy = by(v);
      if (lastP) S('line', { x1: lastP[0], y1: lastP[1], x2: cx, y2: cy, class: 'pline' }, gData);
      S('circle', { cx, cy, r: 3.2, class: 'pdot' }, gData); lastP = [cx, cy];
    }
    function setBP(x, s, d) {
      if (!R.mom) return;
      const g = S('g', { class: 'bp' }, gData), X = px(x), a = by(s), b = by(d);
      S('line', { x1: X, y1: a, x2: X, y2: b }, g);
      S('path', { d: `M${X - 4},${a + 5}L${X},${a}L${X + 4},${a + 5}M${X - 4},${b - 5}L${X},${b}L${X + 4},${b - 5}` }, g);
    }
    const small = (x, y0, t) => { const e = S('text', { x: px(x), y: y0, class: 'cellt s', 'text-anchor': 'middle' }, gCells); e.textContent = t; return e; };
    const setTemp = (x, t) => R.mom && small(x, tempTop + 11, t);
    const setUrine = (x, u) => { if (R.mom) u.forEach((t, r) => small(x, urTop + r * 13 + 10, t)); };
    const setDrug = (x, t) => R.mom && small(x, drugTop + 15, t);
    // icon kiểu thế đặt tại điểm ○
    const posIcon = (x, f, kind) => window.drawPos(gData, px(x), py(f), 9, kind, fast);
    /* vẽ trọn 1 lần khám: c = {X:[[x,y]..], O, L, M, C} */
    function exam(c, i) {
      const x = c.X[i][0];
      if (c.X[i][1] != null) addX(x, c.X[i][1], { join: !(c.J && c.J[i] === 0) });
      if (c.O && c.O[i] != null) addO(x, c.O[i]);
      if (c.Pos && c.Pos[i]) posIcon(x, c.O[i], c.Pos[i]);
      if (c.L && c.L[i]) setLiquor(x, c.L[i]);
      if (c.M && c.M[i]) setMould(x, c.M[i]);
      if (c.C && c.C[i]) setCont(x, c.C[i][0], c.C[i][1]);
      if (c.F && c.F[i]) setFHR(x, c.F[i]);
      if (c.P && c.P[i]) setPulse(x, c.P[i]);
      if (c.BP && c.BP[i]) setBP(x, c.BP[i][0], c.BP[i][1]);
      if (c.T && c.T[i]) setTemp(x, c.T[i]);
      if (c.U && c.U[i]) setUrine(x, c.U[i]);
      if (c.D && c.D[i]) setDrug(x, c.D[i]);
    }

    // --- lớp chú thích
    function col(x, cls) {
      return S('rect', { x: px(x) - cw / 2, y: TM, width: cw, height: H - TM - 4, rx: 6, class: 'band ' + (cls || '') }, gOver);
    }
    function band(x0, x1, cls, label) {
      const r = S('rect', { x: px(x0) - cw / 2, y: ctcTop, width: (x1 - x0 + 1) * cw, height: rh * 10, class: 'fband ' + cls }, gOver);
      if (label) { const t = S('text', { x: px(x0) - cw / 2 + 6, y: ctcTop + 14, class: 'fbl ' + cls }, gOver); t.textContent = label; }
      return r;
    }
    function flag(x, text) {
      S('line', { x1: px(x), y1: ctcTop, x2: px(x), y2: ctcBot, class: 'flagl' }, gOver);
      const t = S('text', { x: px(x) + 4, y: ctcBot - 6, class: 'flagt' }, gOver); t.textContent = text; return t;
    }
    /* nhãn bong bóng cạnh điểm (x,y dữ liệu) */
    function note(x, y, text, cls) {
      const g = S('g', { class: pop('note ' + (cls || '')) }, gOver);
      const w = text.length * 6.6 + 14, X = Math.min(px(x) + 10, LM + W - w - 2), Y = Math.max(py(y) - 30, 2);
      S('rect', { x: X, y: Y, width: w, height: 20, rx: 10 }, g);
      const t = S('text', { x: X + w / 2, y: Y + 14, 'text-anchor': 'middle' }, g); t.textContent = text;
      g.style.transformOrigin = `${X}px ${Y + 20}px`;
      return g;
    }
    function hline(y, cls) { const l = S('line', { x1: LM, y1: py(y), x2: LM + W, y2: py(y), class: 'hl ' + (cls || '') }, gOver); if (!fast) dash(l, 600); return l; }
    function vline(x, cls) { const l = S('line', { x1: px(x), y1: ctcTop, x2: px(x), y2: ctcBot, class: 'hl ' + (cls || '') }, gOver); if (!fast) dash(l, 500); return l; }
    function ring(x, y, cls) { const c = S('circle', { cx: px(x), cy: py(y), r: 13, class: pop('ring ' + (cls || '')) }, gOver); c.style.transformOrigin = `${px(x)}px ${py(y)}px`; return c; }
    function arrow(x0, y0, x1, y1, cls) {
      const g = S('g', { class: 'arw ' + (cls || '') }, gOver);
      const l = S('line', { x1: px(x0), y1: py(y0), x2: px(x1), y2: py(y1) }, g);
      const a = Math.atan2(py(y1) - py(y0), px(x1) - px(x0)), X = px(x1), Y = py(y1);
      S('polygon', { points: `${X},${Y} ${X - 12 * Math.cos(a) + 7 * Math.sin(a)},${Y - 12 * Math.sin(a) - 7 * Math.cos(a)} ${X - 12 * Math.cos(a) - 7 * Math.sin(a)},${Y - 12 * Math.sin(a) + 7 * Math.cos(a)}` }, g);
      if (!fast) dash(l, 700);
      return g;
    }
    // vùng nhấn mạnh 1 hàng (ối, biến dạng, CTC, cơn co, oxy)
    function rowBox(which, cls) {
      const r = { liq: [liqTop, rowH], mould: [mouldTop, rowH], ctc: [ctcTop, rh * 10], cont: [contTop, 60], oxy: [oxyTop, 30], fhr: [fhrTop, FH], mom: [drugTop, urTop + 39 - drugTop], pb: [pbTop, PB] }[which];
      if (!r) return null;
      return S('rect', { x: LM - 2, y: r[0] - 2, width: W + 4, height: r[1] + 4, rx: 8, class: pop('rowbox ' + (cls || '')) }, gOver);
    }

    // con trỏ thời gian
    const cur = S('g', { class: 'cur', visibility: 'hidden' }, svg);
    S('line', { x1: px(0), y1: ctcTop - 4, x2: px(0), y2: ctcBot + 4 }, cur);
    function cursor(x) {
      if (x == null) { cur.setAttribute('visibility', 'hidden'); return; }
      cur.setAttribute('visibility', 'visible');
      cur.style.transition = fast ? 'none' : '';
      cur.style.transform = `translateX(${x * cw}px)`;
    }

    // trượt cả bộ dữ liệu sang ngang dx cột (animation tịnh tiến)
    function slide(dx, ms) {
      [gCells, gData].forEach(g => { g.style.transition = `transform ${ms || 900}ms cubic-bezier(.6,0,.3,1)`; g.style.transform = `translateX(${dx * cw}px)`; });
    }
    function unslide() { [gCells, gData].forEach(g => { g.style.transition = 'none'; g.style.transform = ''; }); }

    function clear() {
      unslide(); gCells.replaceChildren(); gData.replaceChildren(); gOver.replaceChildren();
      lastX = lastO = lastF = lastP = null; xs.length = os.length = 0;
    }
    function toData(e) {
      const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const q = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { x: (q.x - LM) / cw - .5, y: 10 - (q.y - ctcTop) / rh, px: q.x, py: q.y };
    }
    const inside = d => !(d.y < -.4 || d.y > 10.4 || d.x < -.5 || d.x > X1 + .5);
    function onGrid(cb) {
      svg.classList.add('tap');
      const ghost = S('circle', { r: 7, class: 'ghost', visibility: 'hidden' }, svg);
      svg.addEventListener('pointermove', e => {
        const d = toData(e);
        if (!inside(d)) { ghost.setAttribute('visibility', 'hidden'); return; }
        ghost.setAttribute('visibility', 'visible'); ghost.setAttribute('cx', px(Math.round(d.x))); ghost.setAttribute('cy', py(Math.round(d.y)));
      });
      svg.addEventListener('pointerleave', () => ghost.setAttribute('visibility', 'hidden'));
      svg.addEventListener('click', e => { const d = toData(e); if (inside(d)) cb({ x: Math.round(d.x), y: Math.round(d.y), raw: d }); });
    }
    /* dấu ✕ kéo ngang được (tung độ khoá) — cb.move(x), cb.drop(x) */
    function dragX(x0, y, cb) {
      const g = S('g', { class: 'drag', transform: `translate(${px(x0)} ${py(y)})` }, gOver);
      S('circle', { r: 16, class: 'hit' }, g); S('path', { d: 'M-7-7L7 7M7-7L-7 7' }, g);
      let on = false, x = x0;
      g.addEventListener('pointerdown', e => { on = true; g.setPointerCapture(e.pointerId); g.classList.add('on'); e.preventDefault(); });
      g.addEventListener('pointermove', e => {
        if (!on) return;
        const d = toData(e); const nx = Math.max(x0, Math.min(X1, Math.round(d.x)));
        if (nx !== x) { x = nx; g.setAttribute('transform', `translate(${px(x)} ${py(y)})`); cb.move && cb.move(x); }
      });
      const up = () => { if (!on) return; on = false; g.classList.remove('on'); cb.drop && cb.drop(x); };
      g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up);
      g.moveTo = nx => { x = nx; g.setAttribute('transform', `translate(${px(x)} ${py(y)})`); };
      return g;
    }
    // vùng của 1 điểm: left | alert | mid | action | right
    function zoneOf(x, y) {
      const d = x - (A.x + y - A.y), t = .12;
      if (d < -t) return 'left';
      if (d <= t) return 'alert';
      if (d < gap - t) return 'mid';
      if (d <= gap + t) return 'action';
      return 'right';
    }
    function setGap(g) { gap = g; layout(); }
    function flash(cls) {
      const e = { l: zl, m: zm, r: zr }[cls]; if (!e) return;
      e.classList.remove('flash'); void e.getBoundingClientRect(); e.classList.add('flash');
    }
    const L = { liq: liqTop + rowH / 2, mould: mouldTop + rowH / 2, cont: contTop + 30, oxy: oxyTop + 15, fhr: fhrTop + 30, drug: drugTop + 12, pb: pbTop + 30, temp: tempTop + 7, urine: urTop + 19 };
    const api = {
      el: svg, svg, px, py, P, A, X1, cw, rh, ctcTop, ctcBot, H, L, gOver, gData, xs, os, mod,
      get gap() { return gap; }, get fast() { return fast; }, set fast(v) { fast = !!v; },
      alertY, actionY, setGap, addX, addO, setLiquor, setMould, setCont, setOxy, oxySpan, exam, setFHR, setPulse, setBP, setTemp, setUrine, setDrug, posIcon,
      col, band, flag, note, hline, vline, ring, arrow, rowBox, cursor, slide, unslide, show,
      clear, onGrid, dragX, zoneOf, flash
    };
    svg.__p = api; // để test/debug lấy lại API từ phần tử
    return api;
  };
})();
