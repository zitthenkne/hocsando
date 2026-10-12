/* art.js — hình minh họa SVG động (cổ tử cung, ngôi 5/5, xương sọ, tử cung, sóng cơn co, chai truyền)
   Mỗi hàm trả về { el, set(...) } để bài học điều khiển. */
(function () {
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => 1 - Math.pow(1 - t, 3);
  /* tween(from, to, ms, fn, key): key là object để huỷ tween cũ cùng đối tượng */
  window.tween = function (from, to, ms, fn, key) {
    const my = key ? (key._tw = (key._tw || 0) + 1) : 0;
    if (RM || ms <= 0 || from === to) { fn(to); return; }
    const t0 = performance.now();
    const f = now => {
      if (key && key._tw !== my) return;
      const t = Math.min(1, (now - t0) / ms); fn(from + (to - from) * ease(t));
      if (t < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  window.roman = n => { let s = ''; [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']].forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } }); return s; };
  window.RM = RM;

  let uid = 0;
  const T = (parent, x, y, text, a) => { const e = S('text', Object.assign({ x, y }, a || {}), parent); e.textContent = text; return e; };
  const grad = (defs, id, stops, radial) => {
    const g = S(radial ? 'radialGradient' : 'linearGradient', radial ? { id } : { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    stops.forEach(([o, c]) => S('stop', { offset: o, 'stop-color': c }, g)); return 'url(#' + id + ')';
  };
  const hair = (g, pts) => pts.forEach(d => S('path', { d, fill: 'none', stroke: '#b98353', 'stroke-width': 3, 'stroke-linecap': 'round' }, g));
  const art = window.art = {};

  /* ---------- Cổ tử cung nhìn từ âm đạo + thước ✕ ---------- */
  art.cervix = function () {
    const id = 'cx' + (++uid), svg = S('svg', { viewBox: '0 0 440 300', class: 'art' }), defs = S('defs', {}, svg);
    const bg = grad(defs, id + 'b', [[0, '#ffeef4'], [1, '#ffd1df']], true);
    const tissue = grad(defs, id + 't', [[0, '#ff86ab'], [.62, '#ffb6cb'], [1, '#ffc9d8']], true);
    const cp = S('clipPath', { id: id + 'o' }, defs), hole = S('circle', { cx: 150, cy: 150, r: 3 }, cp);
    S('circle', { cx: 150, cy: 150, r: 142, fill: bg }, svg);
    S('circle', { cx: 150, cy: 150, r: 120, fill: tissue, stroke: '#e06b92', 'stroke-width': 3 }, svg);
    const head = S('g', { 'clip-path': `url(#${id}o)` }, svg);
    S('circle', { cx: 150, cy: 150, r: 120, fill: '#f4cfac' }, head);
    hair(head, ['M92,118 q22,-26 48,-6', 'M128,96 q26,-22 54,0', 'M160,122 q22,-22 48,0', 'M104,160 q26,-22 52,0', 'M150,178 q26,-22 52,0', 'M116,200 q22,-16 44,0', 'M170,214 q16,-12 32,0']);
    const edge = S('circle', { cx: 150, cy: 150, r: 3, fill: 'none', stroke: '#c94f78', 'stroke-width': 3 }, svg);
    const meas = S('g', {}, svg), ml = S('line', { y1: 150, y2: 150, stroke: '#4b3b5c', 'stroke-width': 2.5, 'stroke-dasharray': '5 4' }, meas);
    const pill = S('rect', { width: 64, height: 26, rx: 13, fill: '#fff', stroke: '#4b3b5c', 'stroke-width': 2.5, x: 118, y: 120 }, meas);
    const lab = T(meas, 150, 138, '', { 'text-anchor': 'middle', class: 'art-b' });
    // thước bên phải
    S('line', { x1: 340, y1: 260, x2: 340, y2: 40, stroke: '#4b3b5c', 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
    for (let v = 0; v <= 10; v++) { S('line', { x1: 331, x2: 349, y1: 260 - v * 22, y2: 260 - v * 22, stroke: '#4b3b5c', 'stroke-width': 2 }, svg); if (v % 2 === 0) T(svg, 360, 265 - v * 22, v, { class: 'art-s' }); }
    T(svg, 340, 26, 'cm', { 'text-anchor': 'middle', class: 'art-s' });
    const mk = S('g', {}, svg); S('path', { d: 'M-9-9L9 9M9-9L-9 9', stroke: '#e63b7a', 'stroke-width': 5, 'stroke-linecap': 'round' }, mk);
    let cur = 0;
    const R = d => d <= 0 ? 3 : 7 + d * 10.4;
    const paint = d => {
      const r = R(d); hole.setAttribute('r', r); edge.setAttribute('r', r);
      ml.setAttribute('x1', 150 - r + 4); ml.setAttribute('x2', 150 + r - 4);
      meas.style.opacity = d >= .8 ? 1 : 0; lab.textContent = Math.round(d) + ' cm';
      mk.setAttribute('transform', `translate(340 ${260 - d * 22})`);
    };
    paint(0);
    return { el: svg, set(d) { tween(cur, d, 260, v => paint(v), svg); cur = d; } };
  };

  /* ---------- Ngôi thai: số phần năm sờ được trên bờ xương mu ---------- */
  art.fifths = function () {
    const id = 'ff' + (++uid), svg = S('svg', { viewBox: '0 0 440 320', class: 'art' }), defs = S('defs', {}, svg);
    const BR = 190, BH = 24;
    S('rect', { x: 8, y: 8, width: 424, height: 304, rx: 30, fill: '#fff4ea' }, svg);
    S('path', { d: 'M50,190 L392,190 Q372,306 222,310 Q72,306 50,190 Z', fill: '#e9ddff' }, svg);
    T(svg, 222, 292, 'trong tiểu khung', { 'text-anchor': 'middle', class: 'art-s' });
    const cp = S('clipPath', { id: id + 'h' }, defs); S('circle', { cx: 250, cy: 0, r: 60 }, cp);
    const fr = S('clipPath', { id: id + 'f' }, defs); S('rect', { x: 8, y: 8, width: 424, height: 304, rx: 30 }, fr);
    const baby = S('g', {}, S('g', { 'clip-path': `url(#${id}f)` }, svg));
    S('ellipse', { cx: 268, cy: -96, rx: 48, ry: 66, fill: '#ffe2cc', stroke: '#4b3b5c', 'stroke-width': 3, transform: 'rotate(-14 268 -96)' }, baby);
    const bands = [0, 1, 2, 3, 4].map(i => S('rect', { x: 190, y: -60 + i * BH, width: 120, height: BH, 'clip-path': `url(#${id}h)`, stroke: '#fff', 'stroke-width': 2 }, baby));
    S('circle', { cx: 250, cy: 0, r: 60, fill: 'none', stroke: '#4b3b5c', 'stroke-width': 3.5 }, baby);
    hair(baby, ['M214,-42 q14,-14 30,-6', 'M244,-54 q16,-10 32,2']);
    S('path', { d: 'M222,4 q6,5 12,0 M246,4 q6,5 12,0', fill: 'none', stroke: '#4b3b5c', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, baby);
    S('ellipse', { cx: 222, cy: 18, rx: 7, ry: 4, fill: '#ff9fbf', opacity: .8 }, baby);
    S('line', { x1: 36, y1: BR, x2: 408, y2: BR, stroke: '#4b3b5c', 'stroke-width': 4, 'stroke-dasharray': '10 7' }, svg);
    T(svg, 426, BR - 8, 'bờ trên xương mu', { 'text-anchor': 'end', class: 'art-s', 'font-size': 12 });
    S('rect', { x: 44, y: BR - 8, width: 34, height: 64, rx: 16, fill: '#fff7dd', stroke: '#4b3b5c', 'stroke-width': 3 }, svg);
    T(svg, 61, BR + 76, 'xương mu', { 'text-anchor': 'middle', class: 'art-s' });
    const fingers = [0, 1, 2, 3, 4].map(i => S('rect', { x: 118, y: BR - (i + 1) * BH + 2, width: 72, height: BH - 4, rx: 10, fill: '#ffd7bf', stroke: '#4b3b5c', 'stroke-width': 2.5 }, svg));
    const palm = S('rect', { x: 92, width: 40, rx: 14, fill: '#ffd7bf', stroke: '#4b3b5c', 'stroke-width': 2.5 }, svg);
    const big = T(svg, 372, 64, '', { 'text-anchor': 'middle', class: 'art-big' });
    T(svg, 372, 88, 'sờ được', { 'text-anchor': 'middle', class: 'art-s' });
    let cur = 5;
    const paint = n => {
      const cy = BR - n * BH + 60; baby.setAttribute('transform', `translate(0 ${cy})`);
      bands.forEach((b, i) => b.setAttribute('fill', cy - 60 + (i + 1) * BH <= BR + .5 ? '#ffadc6' : '#cbb8f2'));
      const k = Math.round(n); fingers.forEach((f, i) => f.style.opacity = i < k ? 1 : 0);
      palm.style.opacity = k ? 1 : 0; palm.setAttribute('y', BR - k * BH); palm.setAttribute('height', Math.max(k * BH - 2, 0));
      big.textContent = k + '/5';
    };
    paint(5);
    return { el: svg, set(n) { tween(cur, n, 380, paint, svg); cur = n; } };
  };

  /* ---------- Xương sọ thai nhìn từ trên: biến dạng 0/+/++/+++ ---------- */
  art.skull = function () {
    const id = 'sk' + (++uid), svg = S('svg', { viewBox: '0 0 380 290', class: 'art' }), defs = S('defs', {}, svg);
    const cp = S('clipPath', { id: id + 'c' }, defs); S('ellipse', { cx: 190, cy: 140, rx: 150, ry: 108 }, cp);
    const inner = S('g', { 'clip-path': `url(#${id}c)` }, svg);
    S('rect', { x: 0, y: 0, width: 380, height: 290, fill: '#fff4ea' }, inner);
    T(inner, 92, 182, 'xương trán', { 'text-anchor': 'middle', class: 'art-s' }); T(inner, 304, 182, 'xương chẩm', { 'text-anchor': 'middle', class: 'art-s' });
    const bone = (y, fill) => { const g = S('g', {}, inner); S('rect', { x: 150, y, width: 112, height: 112, rx: 10, fill, stroke: '#4b3b5c', 'stroke-width': 3 }, g); return g; };
    const up = bone(22, '#ffcbdc'); T(up, 206, 80, 'xương đỉnh', { 'text-anchor': 'middle', class: 'art-s' });
    const low = bone(146, '#cfe5ff'); T(low, 206, 212, 'xương đỉnh', { 'text-anchor': 'middle', class: 'art-s' }); low.classList.add('skl');
    S('polygon', { points: '150,124 162,140 150,156 138,140', fill: '#fffaf3', stroke: '#4b3b5c', 'stroke-width': 2.5 }, svg);
    S('polygon', { points: '262,140 274,131 274,149', fill: '#fffaf3', stroke: '#4b3b5c', 'stroke-width': 2.5 }, svg);
    S('ellipse', { cx: 190, cy: 140, rx: 150, ry: 108, fill: 'none', stroke: '#4b3b5c', 'stroke-width': 4 }, svg);
    const sq = S('g', { class: 'squeeze' }, svg); T(sq, 206, 26, '⬇', { 'text-anchor': 'middle', 'font-size': 22 }); T(sq, 206, 270, '⬆', { 'text-anchor': 'middle', 'font-size': 22 });
    T(svg, 150, 284, '◆ thóp trước', { 'text-anchor': 'middle', class: 'art-s' }); T(svg, 274, 284, '▲ thóp sau', { 'text-anchor': 'middle', class: 'art-s' });
    const off = [0, -12, -26, -46];
    return { el: svg, set(l) { low.style.transform = `translateY(${off[l]}px)`; low.classList.toggle('over', l >= 2); sq.style.opacity = l >= 2 ? 1 : 0; } };
  };

  /* ---------- Tử cung cắt dọc: cơn co → ngôi xuống → CTC mở (o.bag: vẽ đầu ối) ---------- */
  art.uterus = function (o) {
    o = o || {};
    const svg = S('svg', { viewBox: '0 0 360 360', class: 'art' });
    const wall = S('path', { d: 'M150,290 C68,262 40,150 80,88 C118,30 242,30 280,88 C320,150 292,262 210,290', fill: '#e8f5ff', stroke: '#ff9fc0', 'stroke-width': 18, 'stroke-linecap': 'round', class: 'wall' }, svg);
    const arrows = S('g', { class: 'squeeze' }, svg);
    [['⇘', 46, 70], ['⇙', 300, 70], ['⇓', 180, 22]].forEach(([t, x, y]) => T(arrows, x, y, t, { 'text-anchor': 'middle', 'font-size': 24, fill: '#ec4c72' }));
    const bag = o.bag ? S('ellipse', { cx: 180, rx: 26, ry: 30, fill: '#bfe3ff', stroke: '#2f93e0', 'stroke-width': 3, 'stroke-dasharray': '6 4' }, svg) : null;
    const baby = S('g', { class: 'baby' }, svg);
    S('ellipse', { cx: 180, cy: 128, rx: 50, ry: 62, fill: '#ffe2cc', stroke: '#4b3b5c', 'stroke-width': 3 }, baby);
    S('path', { d: 'M150,108 q-18,20 -2,40 M210,108 q18,20 2,40', fill: 'none', stroke: '#4b3b5c', 'stroke-width': 3, 'stroke-linecap': 'round' }, baby);
    S('circle', { cx: 180, cy: 222, r: 38, fill: '#ffe2cc', stroke: '#4b3b5c', 'stroke-width': 3 }, baby);
    S('path', { d: 'M166,216 q5,5 10,0 M186,216 q5,5 10,0', fill: 'none', stroke: '#4b3b5c', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, baby);
    S('ellipse', { cx: 162, cy: 229, rx: 6, ry: 3.5, fill: '#ff9fbf' }, baby); S('ellipse', { cx: 198, cy: 229, rx: 6, ry: 3.5, fill: '#ff9fbf' }, baby);
    hair(baby, ['M160,250 q20,12 40,0']);
    const lipL = S('path', { fill: 'none', stroke: '#ff7aa3', 'stroke-width': 14, 'stroke-linecap': 'round' }, svg);
    const lipR = S('path', { fill: 'none', stroke: '#ff7aa3', 'stroke-width': 14, 'stroke-linecap': 'round' }, svg);
    T(svg, 262, 320, 'cổ tử cung', { class: 'art-s' });
    const st = { w: 4, y: 0, b: 0 };
    const paint = () => {
      lipL.setAttribute('d', `M150,290 Q158,312 ${180 - st.w},328`); lipR.setAttribute('d', `M210,290 Q202,312 ${180 + st.w},328`);
      baby.setAttribute('transform', `translate(0 ${st.y})`);
      if (bag) { bag.setAttribute('cy', 292 + st.b * 20); bag.setAttribute('rx', 26 - st.b * 6); bag.setAttribute('ry', 30 - st.b * 22); }
    };
    paint();
    const to = (k, ms) => { const a = Object.assign({}, st); tween(0, 1, ms || 520, t => { for (const q in k) st[q] = a[q] + (k[q] - a[q]) * t; paint(); }, svg); };
    return {
      el: svg,
      set(k) { to({ w: 4 + k * 9, y: k * 16 }); },              // k = 0..4 (cơ chế mở CTC)
      setBag(low) { to(low ? { w: 20, y: 44, b: 1 } : { w: 20, y: -18, b: 0 }); }, // đầu ối: đầu cao / đầu thấp
      pulse() {
        if (RM) return;
        wall.animate([{ strokeWidth: 18, transform: 'scale(1)' }, { strokeWidth: 30, transform: 'scale(.95)' }, { strokeWidth: 18, transform: 'scale(1)' }], { duration: 700, easing: 'ease-in-out' });
        arrows.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], { duration: 700 });
      }
    };
  };

  /* ---------- Băng ghi cơn co 10 phút: đếm sóng → tô ô ---------- */
  art.strip = function () {
    const svg = S('svg', { viewBox: '0 0 540 200', class: 'art wide' });
    const X0 = 30, WD = 480, BASE = 152, HT = 100;
    S('rect', { x: X0, y: 40, width: WD, height: 112, fill: '#fff', stroke: '#e5d3e6' }, svg);
    for (let m = 0; m <= 10; m++) { S('line', { x1: X0 + m * 48, x2: X0 + m * 48, y1: 40, y2: BASE, stroke: '#f0e3f0' }, svg); T(svg, X0 + m * 48, BASE + 18, m, { 'text-anchor': 'middle', class: 'art-s' }); }
    T(svg, X0 + WD, BASE + 36, 'phút', { 'text-anchor': 'end', class: 'art-s' });
    const area = S('path', { fill: 'rgba(255,127,174,.22)', stroke: '#e63b7a', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
    const nums = S('g', {}, svg), head = S('line', { y1: 34, y2: BASE, stroke: '#4aa8f0', 'stroke-width': 3 }, svg);
    const cnt = T(svg, X0, 24, '', { class: 'art-b' });
    const brk = S('g', {}, svg), bl = S('line', { y1: BASE - 6, y2: BASE - 6, stroke: '#4b3b5c', 'stroke-width': 2 }, brk), bt = T(brk, 0, BASE - 12, '', { 'text-anchor': 'middle', class: 'art-s' });
    let cs = [], raf = 0, t0 = 0;
    function set(n, d) {
      const sec = [14, 30, 50][d], w = sec / 60 * 48;
      cs = [...Array(n)].map((_, i) => X0 + (i + .5) * WD / n);
      let p = `M${X0},${BASE}`;
      for (let x = 0; x <= WD; x += 2) { let y = 0; cs.forEach(c => { y += Math.exp(-Math.pow((X0 + x - c) / (w / 2.4), 2) / 2); }); p += ` L${X0 + x},${BASE - Math.min(1, y) * HT}`; }
      area.setAttribute('d', p + ` L${X0 + WD},${BASE} Z`);
      bl.setAttribute('x1', cs[0] - w / 2); bl.setAttribute('x2', cs[0] + w / 2); bt.setAttribute('x', cs[0]); bt.textContent = '↔ ' + ['< 20 giây', '20–40 giây', '> 40 giây'][d];
      t0 = performance.now(); nums.replaceChildren();
    }
    const loop = now => {
      const k = ((now - t0) % 5200) / 4600, x = X0 + Math.min(1, k) * WD;
      head.setAttribute('x1', x); head.setAttribute('x2', x);
      const passed = cs.filter(c => c <= x).length;
      if (nums.childNodes.length !== passed) { nums.replaceChildren(...cs.slice(0, passed).map((c, i) => { const g = S('g', { class: 'pop' }, null); S('circle', { cx: c, cy: 44, r: 11, fill: '#ffc928' }, g); T(g, c, 49, i + 1, { 'text-anchor': 'middle', class: 'art-b sm' }); g.style.transformOrigin = `${c}px 44px`; return g; })); }
      cnt.textContent = `Đếm trong 10 phút: ${passed} cơn`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return { el: svg, set, stop: () => cancelAnimationFrame(raf) };
  };

  /* ---------- Kiểu thế: đầu thai nhìn từ dưới lên, xoay theo kiểu thế ---------- */
  art.pos = function () {
    const svg = S('svg', { viewBox: '0 0 360 300', class: 'art' });
    S('ellipse', { cx: 180, cy: 150, rx: 150, ry: 128, fill: '#f3ecff', stroke: '#9b7cf0', 'stroke-width': 3, 'stroke-dasharray': '8 6' }, svg);
    T(svg, 180, 16, '⬆ khớp vệ (trước)', { 'text-anchor': 'middle', class: 'art-s' });
    T(svg, 180, 296, '⬇ xương cùng (sau)', { 'text-anchor': 'middle', class: 'art-s' });
    T(svg, 6, 154, 'PHẢI mẹ', { class: 'art-s' }); T(svg, 354, 154, 'TRÁI mẹ', { 'text-anchor': 'end', class: 'art-s' });
    const rot = S('g', { class: 'posrot' }, svg); rot.style.transformOrigin = '180px 150px';
    drawPos(rot, 180, 150, 88, 'CV', true);
    const lab = T(svg, 180, 262, '', { 'text-anchor': 'middle', class: 'art-b' });
    let ang = 0;
    return {
      el: svg,
      set(kind) {
        const target = POS[kind][0] + 90; let d = ((target - ang) % 360 + 540) % 360 - 180; // xoay đường ngắn nhất
        ang += d; rot.style.transform = `rotate(${ang}deg)`; lab.textContent = POS[kind][1];
      }
    };
  };

  /* ---------- Tim thai: nghe mỗi 30 phút, chấm lên băng 100–180 ---------- */
  art.fhr = function () {
    const svg = S('svg', { viewBox: '0 0 520 190', class: 'art wide' });
    const X0 = 52, WD = 450, y = v => 20 + (180 - v) / 10 * 18;
    S('rect', { x: X0, y: y(160), width: WD, height: y(120) - y(160), fill: 'rgba(52,192,142,.15)' }, svg);
    for (let v = 100; v <= 180; v += 10) { S('line', { x1: X0, x2: X0 + WD, y1: y(v), y2: y(v), stroke: '#ecdcec' }, svg); if (v % 20 === 0) T(svg, X0 - 8, y(v) + 4, v, { 'text-anchor': 'end', class: 'art-s' }); }
    for (let k = 0; k <= 10; k++) S('line', { x1: X0 + k * 45, x2: X0 + k * 45, y1: y(180), y2: y(100), stroke: '#ecdcec' }, svg);
    T(svg, X0 + WD, y(100) + 18, 'mỗi ô = 30 phút', { 'text-anchor': 'end', class: 'art-s' });
    T(svg, X0 + 6, y(160) + 14, 'vùng 120–160', { class: 'art-s' });
    const g = S('g', {}, svg); let pts = [];
    return {
      el: svg,
      add(v) {
        if (pts.length >= 11) { pts = []; g.replaceChildren(); }
        const x = X0 + pts.length * 45, yy = y(Math.max(100, Math.min(180, v)));
        if (pts.length) { const l = S('line', { x1: pts[pts.length - 1][0], y1: pts[pts.length - 1][1], x2: x, y2: yy, stroke: '#e63b7a', 'stroke-width': 2.5 }, g); dash(l, 300); }
        const c = S('circle', { cx: x, cy: yy, r: 6, fill: v > 160 || v < 120 ? '#ff9f1c' : '#e63b7a', class: 'pop' }, g); c.style.transformOrigin = `${x}px ${yy}px`;
        pts.push([x, yy]); return pts.length;
      }
    };
  };

  /* ---------- Chai truyền oxytocin / bơm tiêm điện ---------- */
  art.drip = function () {
    const svg = S('svg', { viewBox: '0 0 320 300', class: 'art' });
    S('line', { x1: 160, y1: 0, x2: 160, y2: 16, stroke: '#4b3b5c', 'stroke-width': 3 }, svg);
    const iv = S('g', {}, svg);
    S('rect', { x: 110, y: 14, width: 100, height: 96, rx: 16, fill: '#f6f0ff', stroke: '#4b3b5c', 'stroke-width': 3 }, iv);
    S('rect', { x: 116, y: 50, width: 88, height: 54, rx: 10, fill: '#d9c8ff' }, iv);
    T(iv, 160, 38, 'Oxytocin', { 'text-anchor': 'middle', class: 'art-b sm' }); T(iv, 160, 82, '… IU/L', { 'text-anchor': 'middle', class: 'art-s' });
    S('line', { x1: 160, y1: 110, x2: 160, y2: 124, stroke: '#4b3b5c', 'stroke-width': 3 }, iv);
    S('rect', { x: 146, y: 124, width: 28, height: 58, rx: 9, fill: '#fff', stroke: '#4b3b5c', 'stroke-width': 2.5 }, iv);
    S('rect', { x: 149, y: 164, width: 22, height: 15, rx: 5, fill: '#d9c8ff' }, iv);
    const drop = S('circle', { cx: 160, cy: 134, r: 4.5, fill: '#9b7cf0', class: 'drop' }, iv);
    S('path', { d: 'M160,182 C160,240 220,230 268,280', fill: 'none', stroke: '#c9b6f5', 'stroke-width': 6, 'stroke-linecap': 'round' }, iv);
    const rate = T(iv, 200, 160, '', { class: 'art-b' }); const rsub = T(iv, 200, 180, '', { class: 'art-s' });
    const pump = S('g', {}, svg);
    S('rect', { x: 40, y: 70, width: 240, height: 110, rx: 20, fill: '#eef7ff', stroke: '#4b3b5c', 'stroke-width': 3 }, pump);
    S('rect', { x: 60, y: 92, width: 120, height: 44, rx: 8, fill: '#bfe3ff', stroke: '#4b3b5c', 'stroke-width': 2.5 }, pump);
    T(pump, 120, 121, '… mIU/phút', { 'text-anchor': 'middle', class: 'art-b sm' });
    S('rect', { x: 192, y: 100, width: 72, height: 26, rx: 6, fill: '#fff', stroke: '#4b3b5c', 'stroke-width': 2.5 }, pump);
    S('rect', { x: 196, y: 104, width: 40, height: 18, rx: 4, fill: '#d9c8ff' }, pump);
    T(pump, 160, 162, '💉 bơm tiêm điện', { 'text-anchor': 'middle', class: 'art-s' });
    return {
      el: svg,
      set(mode, n) {
        iv.style.display = mode ? 'none' : ''; pump.style.display = mode ? '' : 'none';
        drop.style.animationDuration = (60 / Math.max(n, 1)) + 's';
        rate.textContent = roman(n); rsub.textContent = `(${n} giọt/phút)`;
      }
    };
  };
})();
