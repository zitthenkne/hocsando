/* lessons-a.js — PHẦN A (Nền tảng: ch.1–2) + PHẦN B mở đầu (ch.3 Giải phẫu tờ sản đồ) */
(function () {
  const nomark = { liquor: false, cont: false, oxy: false };
  const B = t => h('b', {}, t);

  /* ---------- đồ thị đường cong Friedman / Hendricks ---------- */
  function curve() {
    const W = 520, H = 300, L = 44, Bm = 36, T = 14, R = 14, svg = S('svg', { viewBox: `0 0 ${W} ${H}`, class: 'cv' });
    const X = x => L + x / 16 * (W - L - R), Y = y => H - Bm - y / 10 * (H - Bm - T);
    for (let y = 0; y <= 10; y += 2) { S('line', { x1: L, x2: W - R, y1: Y(y), y2: Y(y), class: 'ln' }, svg); S('text', { x: L - 8, y: Y(y) + 4, 'text-anchor': 'end' }, svg).textContent = y; }
    for (let x = 0; x <= 16; x += 2) S('text', { x: X(x), y: H - Bm + 16, 'text-anchor': 'middle' }, svg).textContent = x;
    S('text', { x: L + (W - L - R) / 2, y: H - 5, 'text-anchor': 'middle' }, svg).textContent = 'giờ kể từ khi bắt đầu chuyển dạ';
    S('text', { x: 6, y: T - 2 }, svg).textContent = 'CTC (cm)';
    return { svg, X, Y, axes() { S('line', { x1: L, y1: T, x2: L, y2: H - Bm, class: 'axis' }, svg); S('line', { x1: L, y1: H - Bm, x2: W - R, y2: H - Bm, class: 'axis' }, svg); } };
  }
  const smooth = (c, pts) => {
    let d = `M${c.X(pts[0][0])},${c.Y(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) d += ` Q${c.X(pts[i][0])},${c.Y(pts[i][1])} ${c.X((pts[i][0] + pts[i + 1][0]) / 2)},${c.Y((pts[i][1] + pts[i + 1][1]) / 2)}`;
    const l = pts[pts.length - 1]; return d + ` L${c.X(l[0])},${c.Y(l[1])}`;
  };
  const fy = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) if (x <= pts[i + 1][0]) { const [a, b] = [pts[i], pts[i + 1]]; return a[1] + (b[1] - a[1]) * (x - a[0]) / ((b[0] - a[0]) || 1); } return pts[pts.length - 1][1]; };
  const FR = {
    so: [[0, 0], [2, .6], [4, 1.2], [6, 1.9], [8, 2.6], [9, 3.4], [10, 4.2], [11, 5.4], [12, 6.6], [13, 7.8], [14, 9], [15, 9.7], [16, 10]],
    ra: [[0, 0], [2, 1], [4, 1.9], [6, 2.7], [7, 3.4], [8, 4.5], [9, 6], [10, 7.5], [11, 9], [12, 9.8], [13, 10], [16, 10]]
  };
  const HR = { so: x => x < 9 ? 3 * x / 9 : Math.min(10, 3 + 1.35 * (x - 9)), ra: x => x < 7 ? 3 * x / 7 : Math.min(10, 3 + 1.35 * (x - 7)) };

  /* =====================================================================
     CHƯƠNG 1 — MỞ MÀN
  ===================================================================== */
  CH.push({ e: '🌸', c: 'pink', part: 'A', t: 'Mở màn',
    keys: [['Sản đồ làm 2 việc gì?', 'Thể hiện cuộc chuyển dạ + cảnh báo khi chuyển dạ ra khỏi giới hạn bình thường'],
      ['Sản đồ có chẩn đoán được không?', 'KHÔNG. Người dùng lý giải dữ kiện rồi mới chẩn đoán'],
      ['Chuyển dạ kéo dài dẫn tới gì?', 'Tắc nghẽn → vỡ tử cung, băng huyết, nhiễm trùng, dò niệu – sinh dục']],
    steps: [
      { t: 'Sản đồ WHO', say: 'Bấm Tiếp ▶ (hoặc phím →) để bắt đầu', run(host, ctx) {
        const p = Partograph({ rows: nomark });
        const n = CH.reduce((a, c) => a + c.steps.length, 0);
        host.append(h('div', { class: 'cover' },
          h('div', { class: 'bigt' }, 'zitthenk ', h('em', {}, 'học sản đồ'), ' ✿'),
          h('p', { class: 'sub' }, 'cơ chế → ghi → đọc → xử trí'),
          h('div', { style: { width: '100%', maxWidth: '760px' } }, box(p)),
          h('div', { class: 'row' }, h('span', { class: 'chip c-pink' }, `🎀 ${CH.length} chương · ${n} màn`), h('span', { class: 'chip c-blue' }, '👆 bấm · kéo · trả lời'), h('span', { class: 'chip c-mint' }, '1 màn = 1 ý')),
          h('p', { class: 'cap' }, 'Nguồn: Bài giảng Thực hành Sản khoa — BM Phụ Sản ĐHYD TP.HCM (Âu Nhựt Luân, Hồ Viết Thắng)')));
        play(p, CASE.typ, ctx, { loop: true });
        ctx.done();
      } },

      { t: 'Vì sao cần sản đồ?', say: 'Bấm quân domino vàng đầu tiên', run(host, ctx) {
        const items = [['🕰️', 'Chuyển dạ kéo dài'], ['🚧', 'Chuyển dạ tắc nghẽn'], ['💥', 'Vỡ tử cung'], ['🩸', 'Băng huyết sau sanh'], ['🦠', 'Nhiễm trùng hậu sản'], ['🕳️', 'Dò niệu – sinh dục']];
        const ds = items.map(([e, t]) => h('div', { class: 'dom' }, h('i', {}, e), t));
        ds[0].onclick = () => {
          if (ds[0].classList.contains('fall')) return;
          ds.forEach((d, i) => ctx.later(() => d.classList.add('fall'), i * 300));
          ctx.later(() => {
            ctx.say(h('div', {}, '🚧 Nguyên nhân chính của tắc nghẽn: ', B('bất xứng đầu chậu'), '. Kéo dài thì ', B('phòng được'), ', tắc nghẽn thì ', B('nhận ra sớm được'), ' → nhờ sản đồ.',
              h('div', { class: 'cap', style: { textAlign: 'left', marginTop: '6px' } }, '📊 Mỗi năm ~5×10⁵ ca tử vong mẹ liên quan thai sản, 99% ở nước đang phát triển (Nguyên lý sản đồ WHO).')));
            host.append(stamp('🛑 Chặn ngay quân đầu = SẢN ĐỒ', 'ok')); ctx.done();
          }, ds.length * 300 + 200);
        };
        host.append(h('div', { class: 'doms' }, ds), ctx.xbox());
      } },

      { t: 'Sản đồ giúp được gì?', say: 'Lật 4 thẻ để xem sản đồ làm giảm những gì', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🕰️', f: 'Chuyển dạ kéo dài', b: '⬇️ giảm có ý nghĩa', c: 'pink' }, { e: '💊', f: 'Thuốc dùng trong chuyển dạ', b: '⬇️ giảm có ý nghĩa', c: 'blue' },
          { e: '👶', f: 'Tử vong chu sinh', b: '⬇️ giảm có ý nghĩa', c: 'mint' }, { e: '✂️', f: 'Tỉ lệ mổ sanh', b: '⬇️ giảm có ý nghĩa', c: 'yellow' }]);
        host.append(note('💡 Hữu ích nhất ở nơi nhân viên y tế tuyến thấp còn ít kinh nghiệm theo dõi chuyển dạ.', 'b'));
      } },

      { t: 'Sản đồ làm 2 việc', say: 'Với mỗi thẻ: sản đồ LÀM ĐƯỢC hay KHÔNG?', run(host, ctx) {
        host.append(h('div', { class: 'row' }, h('span', { class: 'chip c-mint' }, '📖 Việc 1: Thể hiện chuyển dạ'), h('span', { class: 'chip c-peach' }, '🚨 Việc 2: Cảnh báo ra khỏi giới hạn')));
        sorter(host, ctx, [
          { t: 'Vẽ lại diễn tiến chuyển dạ theo thời gian', ok: true, why: 'Việc 1: thể hiện cuộc chuyển dạ.' },
          { t: 'Tự động chẩn đoán bất xứng đầu chậu', ok: false, why: 'Sản đồ KHÔNG có chức năng chẩn đoán — người dùng lý giải rồi mới chẩn đoán.' },
          { t: 'Báo động khi CTC mở chậm hơn tối thiểu', ok: true, why: 'Việc 2: cảnh báo chuyển dạ ra khỏi giới hạn bình thường.' },
          { t: 'Giúp nhân viên y tế nói cùng một "ngôn ngữ"', ok: true, why: 'Sản đồ là công cụ giao tiếp giữa các nhân viên y tế.' },
          { t: 'Quyết định thay bác sĩ: mổ hay không mổ', ok: false, why: 'Chỉ cảnh báo. Quyết định là việc của người dùng, dựa trên lâm sàng.' }
        ], '✅ Làm được', '❌ Không');
      } },

      { t: 'Lộ trình học', say: 'Xem lộ trình 5 phần rồi bấm Tiếp ▶', run(host, ctx) {
        host.append(note(['🎯 3 mục tiêu của bài (theo handout): ', B('① Ghi đúng'), ' sản đồ · ', B('② Kết luận đúng'), ' một sản đồ · ', B('③ Ra quyết định'), ' quản lý sơ cấp khi sản đồ bất thường.'], 'b'));
        const groups = {}; CH.forEach((c, i) => (groups[c.part] = groups[c.part] || []).push([c, i]));
        host.append(h('div', { class: 'road' }, Object.keys(groups).map((p, k) => h('div', { class: 'stop pop', style: { 'animation-delay': (k * .12) + 's', '--ac': 'var(--' + ['pink', 'blue', 'mint', 'lav', 'yellow'][k] + ')' } },
          h('h3', {}, PARTS[p][1] + ' Phần ' + p), h('div', { class: 'cap', style: { textAlign: 'left' } }, PARTS[p][0]),
          h('div', { class: 'row' }, groups[p].map(([c, i]) => h('span', { class: 'pill c-' + c.c }, c.e + ' ' + (i + 1) + '. ' + c.t)))))));
        host.append(h('div', { class: 'cap' }, 'Mỗi chương: 🎯 mục tiêu → các màn học → 🧠 chốt chương. Lạc đường? Bấm 🗺️ Mục lục.'));
        ctx.done();
      } }
    ] });

  /* =====================================================================
     CHƯƠNG 2 — CƠ CHẾ: ĐƯỜNG BÁO ĐỘNG TỪ ĐÂU RA?
  ===================================================================== */
  CH.push({ e: '🌈', c: 'blue', part: 'A', t: 'Cơ chế đường báo động',
    goals: ['Biết đường báo động sinh ra từ đâu', 'Hiểu vì sao là 1 cm/giờ', 'Hiểu vì sao 2 đường cách nhau 4 giờ'],
    keys: [['Hệ số góc của đường báo động?', '1 → mở 1 cm/giờ = bách phân vị 10 (Philpott 1972)'],
      ['Đường hành động nằm ở đâu?', 'Song song, cách đường báo động 4 giờ về bên phải'],
      ['Bản 2002 khác bản 1993 chỗ nào?', 'Bỏ pha tiềm thời · bắt đầu khi CTC ≥ 4 cm · không tịnh tiến']],
    steps: [
      { t: 'Friedman 1954', say: 'Bấm từng pha, rồi thêm đường con rạ', run(host, ctx) {
        const c = curve();
        const bands = [['Tiềm thời', 0, 10, '#b69cf5'], ['Hoạt động', 10, 14, '#4fd1a1'], ['Giảm tốc', 14, 16, '#ff9f6b']].map(([n, a, b, col]) => {
          const r = S('rect', { x: c.X(a), y: c.Y(10), width: c.X(b) - c.X(a), height: c.Y(0) - c.Y(10), fill: col, class: 'bd' }, c.svg);
          S('text', { x: (c.X(a) + c.X(b)) / 2, y: c.Y(10) + 16, 'text-anchor': 'middle', style: 'font-weight:800;font-size:12px' }, c.svg).textContent = n; return r;
        });
        c.axes();
        const so = S('path', { d: smooth(c, FR.so), class: 'c1' }, c.svg), ra = S('path', { d: smooth(c, FR.ra), class: 'c2', visibility: 'hidden' }, c.svg);
        const tick = ctx.need(3);
        const info = [[B('🐌 Pha tiềm thời'), ': CTC < 3 cm, mở chậm.'], [B('🚀 Pha hoạt động'), ': mở nhanh tối đa.'], [B('🛬 Pha giảm tốc'), ': chậm lại ở cuối.']];
        const side = h('div', { class: 'ctl' },
          h('div', { class: 'cap' }, '3 pha mở CTC (đường đỏ = con so, trung vị)'),
          h('div', { class: 'row left' }, bands.map((b, i) => h('button', { class: 'chip', onclick() { bands.forEach(x => x.classList.remove('on')); b.classList.add('on'); ctx.say(h('div', {}, info[i])); tick(); } }, ['🐌 Tiềm thời', '🚀 Hoạt động', '🛬 Giảm tốc'][i]))),
          h('button', { class: 'chip c-blue', onclick() { ra.setAttribute('visibility', 'visible'); dash(ra, 1200); ctx.say(h('div', {}, 'Pha hoạt động: con so ~', B('1,2 cm/giờ'), ' · con rạ ~', B('1,5 cm/giờ'), '. Friedman: 2 nhóm khác nhau.')); tick(); } }, '＋ Thêm đường con rạ (xanh)'));
        host.append(lay(h('div', { class: 'chartbox' }, c.svg), [side, ctx.xbox()]));
        dash(so, 1400);
      } },

      { t: 'Hendricks 1969', say: 'Kéo thanh trượt: nhìn lại bằng một dân số lớn', run(host, ctx) {
        const c = curve(); c.axes();
        const p1 = S('path', { class: 'c1' }, c.svg), p2 = S('path', { class: 'c2' }, c.svg);
        const f = t => {
          t /= 100; const pts = fn => { let d = ''; for (let x = 0; x <= 16; x += .25) d += (d ? 'L' : 'M') + c.X(x) + ',' + c.Y(fn(x)); return d; };
          p1.setAttribute('d', pts(x => (1 - t) * fy(FR.so, x) + t * HR.so(x))); p2.setAttribute('d', pts(x => (1 - t) * fy(FR.ra, x) + t * HR.ra(x)));
          ctx.say(t < .5 ? h('div', {}, '📈 ', B('Friedman'), ': đường cong chữ S, con so ≠ con rạ, có pha giảm tốc.')
            : h('div', {}, '📏 ', B('Hendricks'), ': pha hoạt động ', B('cùng độ dốc'), ' (con so = con rạ, chỉ khác ở pha tiềm thời) và ', B('không có pha giảm tốc'), ' → đồ thị dạng ', B('y = ax + b'), '.'));
          if (t > .95) ctx.done();
        };
        const sl = slider({ min: 0, max: 100, value: 0, label: 'Friedman → Hendricks', fmt: v => v < 50 ? '1954' : '1969', on: f });
        host.append(lay(h('div', { class: 'chartbox' }, c.svg), [h('div', { class: 'ctl' }, sl, h('div', { class: 'cap' }, h('span', { class: 'pill r' }, 'đỏ = con so'), ' ', h('span', { class: 'pill b' }, 'xanh = con rạ'))), ctx.xbox()]));
        sl.init();
      } },

      { t: 'Philpott 1972: cuộc đua', say: '10 sản phụ cùng mở từ 3 → 10 cm. Bấm 🏁 Chạy!', run(host, ctx) {
        const sp = [1.5, .7, 2.1, 1.3, 1.1, 1.9, 1.4, 1.7, 1.2, 1.6];
        const fills = sp.map(() => h('i', { class: 'fill' }));
        const ghost = h('div', { class: 'pace' }, h('span', {}, '🏃 1 cm/giờ'));
        const arena = h('div', { class: 'arena' }, h('div', { class: 'lab' }, sp.map(s => h('span', {}, '🤰 ' + s.toFixed(1)))), h('div', { class: 'tr' }, fills.map(f => h('div', { class: 'track' }, f)), ghost));
        let raf = 0;
        const go = h('button', { class: 'btn go', onclick() {
          cancelAnimationFrame(raf); ctx.say(h('div', {}, 'Vạch cam = người mở đúng ', B('1 cm/giờ'), '. Ai tụt sau vạch cam sẽ hoá đỏ…')); const t0 = performance.now(), D = 6500;
          const stepf = now => {
            const k = Math.min(1, (now - t0) / D), T = k * 7;
            fills.forEach((f, i) => { const cm = 3 + sp[i] * T; f.style.width = Math.min(100, (cm - 3) / 7 * 100) + '%'; f.classList.toggle('behind', cm < 3 + T - .05); });
            ghost.style.left = (T / 7 * 100) + '%';
            if (k < 1) raf = requestAnimationFrame(stepf);
            else { ctx.say(h('div', {}, '🐢 Chỉ ', B('1/10'), ' chậm hơn 1 cm/giờ → 1 cm/giờ chính là ', B('bách phân vị thứ 10'), '. Mở < 1 cm/giờ liên quan mạnh với ', B('kết cục xấu'), ' — ở cả con so lẫn con rạ.')); ctx.done(); }
          };
          raf = requestAnimationFrame(stepf);
        } }, '🏁 Chạy!');
        host.append(lay(arena, [h('div', { class: 'row' }, go), ctx.xbox()]));
        ctx.say('Mỗi làn = 1 sản phụ, số = tốc độ mở CTC (cm/giờ).');
        return () => cancelAnimationFrame(raf);
      } },

      { t: 'Dựng đường báo động & hành động', say: 'Xem giảng từng bước — có thể bấm ◀ ▶ để tua', run(host, ctx) {
        const p = Partograph({ mode: 'orig', rows: nomark, bare: true });
        const fresh = () => p.gOver.replaceChildren();
        host.append(scene(ctx, {
          vis: box(p), p,
          reset() { p.clear(); ['alert', 'action', 'zones'].forEach(k => p.show(k, false)); },
          beats: [
            { t: ['Khung sản đồ bản gốc 1993: trục đứng = ', B('độ mở CTC (cm)'), ', trục ngang = ', B('giờ'), '.'], run() { p.rowBox('ctc'); } },
            { t: ['Góc tím: ', B('pha tiềm thời'), ' (CTC < 3 cm). Độ dài pha này ', B('bất định'), ' → để riêng.'], run() { fresh(); p.hline(3); p.note(1, 3, 'CTC 3 cm'); } },
            { t: ['Mốc xuất phát: ', B('CTC 3 cm tại giờ thứ 8'), '.'], run() { fresh(); p.ring(8, 3); p.note(8, 3, '(8 , 3)'); } },
            { t: ['Kẻ đường dốc ', B('1 cm/giờ'), ' (bách phân vị 10 — Philpott) → ', B('ĐƯỜNG BÁO ĐỘNG'), '.'], run() { fresh(); p.show('alert', true); p.arrow(11, 6, 12, 6, 'g'); p.arrow(12, 6, 12, 7, 'g'); p.note(12, 7, '+1 giờ → +1 cm', 'g'); } },
            { t: ['Dời sang phải ', B('4 giờ'), ', kẻ song song → ', B('ĐƯỜNG HÀNH ĐỘNG'), '.'], run() { fresh(); p.show('action', true); p.arrow(8, 3, 12, 3); p.note(9, 3, '+ 4 giờ', 'r'); } },
            { t: ['2 đường chia pha hoạt động thành 3 vùng: ', B('🟢 trái'), ' · ', B('🟡 giữa'), ' · ', B('🔴 phải đường hành động'), '.'], run() { fresh(); p.show('zones', true); } },
            { t: 'Thử nhanh:', ask: { q: 'Sản phụ mở CTC chỉ 0,7 cm/giờ. Đường CTC đi về đâu?', opts: ['Bên trái báo động', 'Bên phải báo động', 'Trùng đường báo động'], ans: 1, no: { 0: 'Bên trái = nhanh hơn 1 cm/giờ.', 2: 'Trùng = đúng 1 cm/giờ.' } } },
            { t: ['Chậm hơn 1 cm/giờ → lệch ', B('phải'), ' → nguy cơ ', B('chuyển dạ kéo dài'), ': phải tìm nguyên nhân.'], run() { fresh(); p.arrow(8, 3, 18, 10, 'r'); p.note(15, 7.2, '0,7 cm/giờ', 'r'); } }
          ]
        }));
      } },

      { t: 'Vì sao cách 4 giờ?', say: 'Kéo khoảng cách giữa 2 đường: thử quá gần, đúng 4 giờ, quá xa', run(host, ctx) {
        const p = Partograph({ rows: nomark });
        const seen = new Set(), out = h('div', { class: 'stack' });
        const sl = slider({ min: 1, max: 8, value: 2, label: 'Cách nhau', fmt: v => v + ' giờ', on(v) {
          p.setGap(v); const k = v < 4 ? 0 : v === 4 ? 1 : 2; seen.add(k);
          out.replaceChildren(k === 0 ? stamp('🍼 Quá sát', 'warn') : k === 1 ? stamp('✨ 4 giờ', 'ok') : stamp('🐢 Quá xa', 'no'));
          ctx.say(k === 0 ? h('div', {}, 'Ít thời gian điều chỉnh → dễ can thiệp ', B('quá tay, quá sớm'), '.') : k === 1 ? h('div', {}, 'Đủ ', B('4 giờ'), ' để tìm nguyên nhân & điều chỉnh khi chuyển dạ chậm.') : h('div', {}, 'Dễ can thiệp ', B('chậm trễ'), ', mất giá trị cảnh báo.'));
          if (seen.size === 3) ctx.done();
        } });
        host.append(lay(box(p), [h('div', { class: 'ctl' }, sl, out), ctx.xbox(),
          note(['🗂️ 4 giờ giữa 2 đường = ', B('vùng cho phép điều chỉnh'), ' khi chuyển dạ chậm. Bên phải đường hành động = ', B('không được trì hoãn thêm'), '. Pha hoạt động tối đa ~12 giờ (Nguyên lý, Hình 8).'], 'b'),
          note(['Slide: vùng 4 giờ ', B('không áp dụng'), ' khi đã có biến chứng cho mẹ/thai; giúp giảm can thiệp sớm.'], 'l'),
          h('div', { class: 'cap' }, 'WHO đặt khoảng cách này một cách chủ quan, dựa trên các nghiên cứu trước')]));
        sl.init();
      } },

      { t: 'Bản gốc 1993 vs rút gọn 2002', say: 'Bấm đổi qua lại 2 bản, so sánh khác biệt', run(host, ctx) {
        const area = h('div'), notes = h('div', { class: 'stack' });
        const info = {
          orig: [['🌙 Có pha tiềm thời', 'l'], ['🚦 Hoạt động từ CTC ≥ 3 cm', 'm'], ['➡️ Phải TỊNH TIẾN lên đường báo động', 'p'], ['✅ Vẽ khi đã chuyển dạ thật', 'b']],
          mod: [['✂️ Bỏ pha tiềm thời', 'l'], ['🚦 Hoạt động từ CTC ≥ 4 cm', 'm'], ['📍 Vẽ thẳng lên đường báo động', 'p'], ['🙅 Không cần tịnh tiến', 'b']]
        };
        const tick = ctx.need(2), sw = k => { area.replaceChildren(box(Partograph({ mode: k, rows: nomark }))); notes.replaceChildren(info[k].map(([t, c]) => note(t, c))); tick(); };
        host.append(lay(area, [seg([['orig', 'Bản gốc 1993'], ['mod', 'Rút gọn 2002']], sw), notes,
          note(['📚 Tổng quan WHO 2014: bản gốc và bản rút gọn cho ', B('kết cục như nhau'), '. WHO không chính thức ra bản "modified" nào.'], 'm'),
          note(['📌 WHO 2018: dùng bản nào cũng được, nhưng phải có ', B('2 đường cách nhau 4 giờ'), '. BM Phụ Sản: lý thuyết dùng bản gốc, thực hành chấp nhận bản rút gọn.'])]));
        sw('orig');
      } },

      { t: 'Vì sao có bản 2002?', say: 'Chọn đáp án đúng', gate: true, run(host, ctx) {
        Q(ctx, host, { q: 'WHO bỏ pha tiềm thời và chỉ vẽ từ CTC ≥ 4 cm vì…', opts: [
          'Đường báo động đổi thành 2 cm/giờ',
          'Ranh giới tiềm thời – hoạt động mơ hồ: dễ vẽ sớm & can thiệp khi chưa thật sự chuyển dạ',
          'Con so và con rạ cần 2 sản đồ khác nhau',
          'Đường hành động bị bỏ'], ans: 1,
        why: 'Độ dài pha tiềm thời bất định (khó xác định lúc bắt đầu chuyển dạ). Chỉ vẽ khi CTC ≥ 4 cm → tránh nhận định sai và can thiệp không cần thiết; hiệu quả vẫn như bản gốc.' });
      } },

      { t: 'Mở rộng: tiêu chuẩn chuyển dạ bất thường', say: 'Lật ít nhất 3 thẻ — phân biệt với quy tắc vẽ sản đồ', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🌙', f: 'Tiềm thời kéo dài', b: 'Friedman: con so > 20 giờ · con rạ > 14 giờ\nWHO: > 8 giờ với 2 cơn/10 phút', c: 'lav' },
          { e: '🐢', f: 'Hoạt động kéo dài', b: 'Friedman: con so mở < 1,2 cm/giờ\ncon rạ < 1,5 cm/giờ\nWHO: mở < 1 cm/giờ (Philpott)', c: 'blue' },
          { e: '⛔', f: 'Hoạt động ngưng tiến', b: 'CTC ≥ 4 cm & độ lọt không đổi ≥ 4 giờ\ndù cơn co ≥ 200 MVU/10 phút, ối đã vỡ', c: 'coral' },
          { e: '⏳', f: 'Giai đoạn 2 kéo dài', b: 'Con so > 2 giờ (3 giờ nếu giảm đau sản khoa)\nCon rạ > 1 giờ (2 giờ nếu giảm đau)', c: 'peach' },
          { e: '🧩', f: 'Giai đoạn 3 kéo dài', b: '> 30 phút', c: 'mint' },
          { e: '🆕', f: 'Quan điểm mới', b: 'Hoạt động tính từ CTC 6 cm, tối thiểu 0,5 cm/giờ\nNgưng tiến: ≥ 6 cm + ≥ 4 giờ co đủ\nhoặc ≥ 6 giờ co chưa đủ', c: 'yellow' }], 3);
        host.append(note(['📌 Nguồn: slide "Chuyển dạ bất thường & Partograph" (Williams 24e). Đây là ', B('tiêu chuẩn chẩn đoán'), ' — KHÔNG thay quy tắc vẽ sản đồ WHO của bài (1 cm/giờ, 2 đường cách 4 giờ).'], 'p'));
      } }
    ] });

  /* =====================================================================
     CHƯƠNG 3 — GIẢI PHẪU TỜ SẢN ĐỒ (Phần B: Ghi đúng)
  ===================================================================== */
  const hotspots = (p, ctx, spots, list) => {
    const tick = ctx.need(spots.length);
    spots.forEach(([x, y, name, t], i) => {
      const cy = y > 10 ? y : p.py(y), g = S('g', {}, p.gOver);
      const c = S('circle', { cx: p.px(x), cy, r: 11, class: 'hot' }, g); S('text', { x: p.px(x), y: cy + 4.5, 'text-anchor': 'middle', class: 'hott' }, g).textContent = i + 1;
      const chip = h('span', { class: 'pill w' }, (i + 1) + '. ' + name); list.append(chip);
      c.addEventListener('click', () => { if (!c.classList.contains('seen')) { c.classList.add('seen'); chip.className = 'pill g'; tick(); } ctx.say(h('div', {}, t)); });
    });
  };
  CH.push({ e: '🍓', c: 'peach', part: 'B', t: 'Giải phẫu tờ sản đồ',
    goals: ['Biết mỗi vùng trên tờ sản đồ ghi gì — từ tim thai tới nước tiểu', 'Dùng đúng ký hiệu ✕ ○ • C T X K 0 + ++ +++ và icon kiểu thế', 'Đọc được mẫu WHO và mẫu BV Từ Dũ · 1 lần khám = 1 cột dọc'],
    keys: [['Ô ối ghi "C" nghĩa là gì?', 'Ối CÒN (bản tiếng Việt). Bản tiếng Anh dùng chữ I'],
      ['Số ô cơn co được tô = ?', 'Số cơn trong 10 phút; kiểu tô = độ dài mỗi cơn'],
      ['Tim thai bất thường khi nào? Làm gì?', '< 120 hoặc > 160 lần/phút → nghe mỗi 15 phút; 3 lần bất thường → xử trí ngay, trừ khi gần sanh (slide)'],
      ['Ngôi 3/5 theo mẫu Từ Dũ gọi là gì?', '"Chặt" (−1). Cao −3 = 5/5 · Chúc −2 = 4/5 · Lọt cao 0 = 2/5 · Lọt vừa +1 = 1/5 · Lọt thấp +2 = 0/5']],
    steps: [
      { t: 'Tour tờ sản đồ', say: 'Chạm lần lượt các vòng tròn số — từ trên xuống dưới', run(host, ctx) {
        const p = Partograph({ rows: { fhr: true, mom: true } }); plotNow(p, CASE.full);
        const list = h('div', { class: 'row left' });
        hotspots(p, ctx, [
          [10, p.L.fhr, 'Tim thai', ['Hàng ', B('tim thai'), ' (100–180 lần/phút): chấm •, nối liền, ghi song hành với CTC.']],
          [10, p.L.liq, 'Ối', ['Hàng ', B('ối'), ': C còn · T trong · X phân su · K không thấy.']],
          [10, p.L.mould, 'Biến dạng', ['Hàng ', B('biến dạng đầu'), ': 0 · + · ++ · +++.']],
          [4, 10, 'CTC ✕', ['Dấu ', B('✕'), ' = độ mở cổ tử cung (cm), trục đỏ.']],
          [3, 1, 'Ngôi ○', ['Dấu ', B('○'), ' = ngôi 5/5 → 0/5 (trục xanh). Có thể vẽ ', B('icon kiểu thế'), ' ngay tại điểm ○.']],
          [5.4, 9.4, '2 đường', [B('Đường báo động & hành động'), ' = linh hồn của sản đồ.']],
          [8, p.L.cont, 'Cơn co', ['Hàng ', B('cơn co'), ': số ô tô = số cơn/10 phút, kiểu tô = độ dài.']],
          [8, p.L.oxy, 'Oxytocin', ['Hàng ', B('oxytocin'), ': nồng độ (IU/L) & tốc độ truyền.']],
          [8, p.L.drug, 'Thuốc/dịch', ['Hàng ', B('thuốc dùng khác & dịch truyền'), '.']],
          [8, p.L.pb, 'Mạch/HA', [B('Mạch'), ' (chấm •) và ', B('huyết áp'), ' (mũi tên ↕).']],
          [8, p.L.urine, 'Nhiệt/nước tiểu', [B('Nhiệt độ'), ' · ', B('nước tiểu'), ' (đạm, acetone, thể tích).']]], list);
        host.append(lay(box(p), [h('div', { class: 'ctl' }, h('div', { class: 'cap' }, 'Đã khám phá:'), list), ctx.xbox()]));
        ctx.say('Tờ sản đồ WHO đầy đủ (mẫu 1993/1998). Ca mẫu đã được vẽ sẵn.');
      } },

      { t: 'Đầu trang', say: 'Chạm từng dòng của phiếu để xem ghi gì', run(host, ctx) {
        const rows = [['🪪', 'Tên · tuổi · PARA', 'Họ tên ________ Tuổi ___ PARA ____', ['Thông tin ', B('tối giản'), ' để nhận diện sản phụ.']],
          ['🏥', 'Nhập viện', 'Nhập viện lúc __:__ · Số NV ______', ['Ghi ', B('thời điểm nhập viện'), ' và ', B('số nhập viện'), '.']],
          ['💧', 'Vỡ ối', 'Vỡ ối lúc __:__ · đã vỡ ___ giờ', ['Thời điểm & thời gian vỡ ối ', B('rất có ý nghĩa'), ' khi diễn giải sản đồ và ra quyết định.']]];
        const tick = ctx.need(3);
        const form = h('div', { class: 'frame stack' }, h('div', { class: 'big' }, '📋 SẢN ĐỒ'), rows.map(([e, t, line, x]) => {
          const b = h('button', { class: 'tile', onclick() { if (!b.dataset.s) { b.dataset.s = 1; b.style.background = 'var(--mint)'; tick(); } ctx.say(h('div', {}, x)); } }, h('span', { class: 'em' }, e), h('span', {}, h('b', {}, t), h('br'), h('small', { style: { color: 'var(--ink2)' } }, line)));
          return b;
        }));
        host.append(lay(form, [ctx.xbox(), note('Mẫu WHO còn ghi Gravida, Para, số hồ sơ; mẫu Từ Dũ thêm "Bắt đầu ghi BĐCD ngày… lúc…".', 'l')], 'even'));
        ctx.say('Phần đầu trang chỉ cần 3 nhóm thông tin.');
      } },

      { t: '✕ Mở cổ tử cung', say: 'Kéo thanh trượt để mở CTC — dấu ✕ chạy theo thước', run(host, ctx) {
        const a = art.cervix();
        const sl = slider({ min: 0, max: 10, value: 0, label: 'CTC', fmt: v => v + ' cm', on(v) {
          a.set(v);
          ctx.say(v >= 10 ? h('div', {}, '🎉 ', B('Mở trọn 10 cm'), ' — chỉ còn một viền mỏng.') : v >= 4 ? h('div', {}, '🚀 ', B('≥ 4 cm'), ': chắc chắn đã vào pha hoạt động (bản rút gọn bắt đầu vẽ).') : v >= 3 ? h('div', {}, 'Bản gốc: ', B('≥ 3 cm'), ' là pha hoạt động.') : h('div', {}, '🐌 Còn trong pha tiềm thời.'));
          if (v >= 10) ctx.done();
        } });
        host.append(lay(h('div', { class: 'frame' }, a.el), [h('div', { class: 'ctl' }, sl), ctx.xbox(), note(['Độ mở CTC ghi bằng dấu ', B('✕'), ' trên trục cm (0 → 10).'], 'p')]));
        sl.init();
      } },

      { t: '○ Ngôi thai 5/5 → 0/5', say: 'Kéo ngôi xuống — đếm số khoát ngón tay còn sờ được đầu trên khớp vệ', run(host, ctx) {
        const a = art.fifths();
        const desc = ['hoàn toàn không sờ thấy đầu', 'trán cảm nhận được, chẩm không sờ thấy', 'trán cảm nhận được, chẩm vừa sờ chạm', 'trán sờ dễ, chẩm cảm nhận được', 'trán cao, chẩm sờ dễ dàng', 'chẩm & trán hoàn toàn trên khớp vệ'];
        const td = ['Lọt thấp (+2)', 'Lọt vừa (+1)', 'Lọt cao (0)', 'Chặt (−1)', 'Chúc (−2)', 'Cao (−3)'];
        const sl = slider({ min: 0, max: 5, value: 5, label: 'Ngôi', fmt: v => v + '/5', on(v) {
          a.set(v);
          ctx.say(h('div', {}, B(v + '/5'), ' — ', desc[v], '.', h('div', { class: 'cap', style: { textAlign: 'left' } }, 'Mẫu BV Từ Dũ ghi: ', B(td[v]))));
          if (v === 0) ctx.done();
        } });
        host.append(lay(h('div', { class: 'frame' }, a.el), [h('div', { class: 'ctl' }, sl), ctx.xbox(),
          note(['✋ Cách khám (slide): đặt ', B('5 ngón tay khép'), ' trên xương vệ, đếm số khoát ngón cần để ôm phần đầu còn sờ được qua bụng.'], 'l'),
          note(['Ghi bằng dấu ', B('○'), ' trên trục xanh (5 → 0), cùng cột với ✕.'], 'b')]));
        sl.init();
      } },

      { t: '🧭 Kiểu thế & icon', say: 'Bấm từng kiểu thế để xoay đầu thai, rồi thử "Xoay trong"', run(host, ctx) {
        const a = art.pos(), seen = new Set();
        const info = k => k === 'CV' ? ['Chẩm vệ: chẩm hướng ra trước, sẵn sàng sổ.'] : k === 'CC' ? ['Chẩm cùng: chẩm hướng ra sau.']
          : /T$/.test(k) ? ['Kiểu thế ', B('trước'), ' — thuận lợi.'] : /N$/.test(k) ? ['Kiểu thế ', B('ngang'), ' — không thuận lợi.']
            : ['Kiểu thế ', B('sau'), ' — liên quan mạnh với chuyển dạ kéo dài (OP dài hơn ~1 giờ ở con so, ~2 giờ ở con rạ); thường sẽ xoay về kiểu thế trước.'];
        const grid = h('div', { class: 'posgrid' }, ['CCTT', 'CCTN', 'CCTS', 'CV', 'CCPT', 'CCPN', 'CCPS', 'CC'].map(k => {
          const ic = S('svg', { viewBox: '0 0 40 40' }); drawPos(ic, 20, 20, 16, k, true);
          return h('button', { class: 'chip', title: POS[k][1], onclick() { a.set(k); seen.add(k); ctx.say(h('div', {}, B(POS[k][1]), ' — ', info(k))); if (seen.size >= 4) ctx.done(); } }, ic, k);
        }));
        const rotB = h('button', { class: 'btn go', onclick() { a.set('CCTT'); ctx.say('Kiểu thế trước…'); ctx.later(() => { a.set('CV'); ctx.say(h('div', {}, 'Xoay trong ', B('45°'), ' về ', B('chẩm vệ'), ' (như Hình 13 của handout).')); }, 1000); } }, '🔄 Xoay trong: CCTT → chẩm vệ');
        host.append(lay(h('div', { class: 'frame' }, a.el), [h('div', { class: 'ctl' }, grid, h('div', { class: 'row' }, rotB)), ctx.xbox(),
          note(['Icon theo handout: vùng hồng = ', B('thóp sau'), ' (chỉ về phía chẩm). Trên = khớp vệ, dưới = xương cùng, ', B('PHẢI hình = TRÁI mẹ'), '. Vẽ icon ngay tại điểm ○.'], 'l')]));
        a.set('CCTT');
        const ic = S('svg', { viewBox: '0 0 40 40', width: 44, height: 44 }); drawPos(ic, 20, 20, 17, 'CCTS', true);
        Q(ctx, host, { q: [ic, ' Icon này là kiểu thế gì?'], opts: ['Chẩm chậu phải trước', 'Chẩm chậu trái sau', 'Chẩm chậu phải sau', 'Chẩm chậu trái ngang'], ans: 1,
          why: 'Thóp sau chỉ xuống dưới (= sau) và sang PHẢI hình (= TRÁI mẹ) → chẩm chậu trái sau.', wrong: { 2: 'Nhớ: phải hình = TRÁI mẹ.', 0: 'Hướng xuống dưới là SAU.' } });
      } },

      { t: '♥ Tim thai', say: 'Chỉnh nhịp tim, bấm "Nghe & chấm" — mỗi lần = 30 phút (chấm ít nhất 4 lần)', run(host, ctx) {
        const a = art.fhr(); let v = 140;
        const heart = h('span', { class: 'heart' }, '💗');
        const sl = slider({ min: 90, max: 190, value: 140, step: 2, label: 'Tim thai', fmt: x => x + ' l/ph', on(x) { v = x; heart.style.setProperty('--b', (30 / x) + 's'); } });
        const tick = ctx.need(4);
        const btn = h('button', { class: 'btn go', onclick() {
          a.add(v); tick();
          ctx.say(h('div', {}, v > 160 || v < 120 ? ['⚠️ ', B(v + ' lần/phút: bất thường'), ' → nghe lại mỗi ', B('15 phút'), '. 3 lần bất thường → xử trí ngay, trừ khi gần sanh.'] : ['✅ ', B(v + ' lần/phút'), ' trong khoảng 120–160 → nghe mỗi 30 phút.']));
        } }, '🩺 Nghe & chấm');
        host.append(lay(h('div', { class: 'frame' }, a.el), [h('div', { class: 'ctl' }, h('div', { class: 'row' }, heart), sl, h('div', { class: 'row' }, btn)), ctx.xbox(),
          note(['Handout: nhịp tim thai ghi ', B('song hành'), ' với CTC, ối, biến dạng (Hình 6).'], 'b'),
          note(['Slide: ghi mỗi 30 phút bằng ', B('chấm •'), ', nghe ', B('sau đỉnh cơn co'), ' khi sản phụ nằm nghiêng. Ối xanh sậm hoặc không có nước ối → nghe thường xuyên hơn.'], 'l'),
          note(['Mẫu Từ Dũ ghi thêm ', B('TTCB · DĐNT · nhịp giảm (0/I/II/III)'), ' — đọc kỹ ở bài CTG.'], 'p')]));
        sl.init();
      } },

      { t: 'Ối: C · T · X · K', say: 'Lật 4 thẻ, rồi trả lời câu hỏi bên dưới', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🫧', f: 'C', b: 'ối CÒN (chưa vỡ)\nTiếng Anh: I', c: 'blue' }, { e: '💧', f: 'T', b: 'vỡ, nước ối TRONG / trắng đục\n(không phân su)\nTiếng Anh: C', c: 'mint' },
          { e: '🟤', f: 'X', b: 'vỡ, nước ối lẫn phân su\nTiếng Anh: M', c: 'yellow' }, { e: '❓', f: 'K', b: 'vỡ, KHÔNG thấy nước ối\nTiếng Anh: A', c: 'lav' }], 99);
        host.append(note(['⚠️ Bẫy: bản tiếng Việt ', B('C = ối còn'), '. Bản tiếng Anh C = clear (ối vỡ, trong).'], 'p'),
          note(['Một số mẫu khác còn dùng D (ối dẹt), P (ối phồng), M (ối có máu) — bài BM dùng bộ ', B('C · T · X · K'), '.'], 'l'));
        Q(ctx, host, { q: 'Ối đã vỡ, nước ối có lẫn phân su. Ghi ký hiệu nào?', opts: ['C', 'T', 'X', 'K'], ans: 2, why: 'X = vỡ + có phân su (M trong tiếng Anh). Khi đó cần nghe tim thai thường xuyên hơn.', wrong: { 0: 'C là ối CÒN nha.', 1: 'T là nước ối trong, không phân su.', 3: 'K là không thấy nước ối.' } });
      } },

      { t: 'Biến dạng đầu: 0 · + · ++ · +++', say: 'Chọn từng mức để xem 2 xương đỉnh chồng lên nhau', run(host, ctx) {
        const a = art.skull(), seen = new Set();
        const lv = [['0', 'Các xương sọ tách rời, thấy rõ đường khớp.'], ['+', 'Các xương sọ chạm vào nhau.'], ['++', 'Các xương sọ chồng lên nhau.'], ['+++', 'Các xương sọ chồng lên nhau RẤT nhiều.']];
        const sg = seg(lv.map(([k], i) => [i, k]), (_, i) => {
          a.set(i); seen.add(i);
          ctx.say(h('div', {}, h('span', { class: 'big' }, lv[i][0]), ' — ', lv[i][1], i >= 2 ? h('div', { class: 'cap', style: { textAlign: 'left' } }, '→ đầu đang bị ép khi cố vượt qua trở ngại') : null));
          if (seen.size === 4) ctx.done();
        });
        host.append(lay(h('div', { class: 'frame' }, a.el), [h('div', { class: 'ctl' }, h('div', { class: 'cap' }, 'Mức biến dạng (nhìn từ đỉnh đầu thai)'), sg), ctx.xbox(),
          note(['🚩 Slide: chồng xương ', B('tăng dần'), ' trong khi độ lọt ', B('còn cao'), ' → bất xứng đầu chậu.'], 'p')]));
        sg.pick(0);
      } },

      { t: 'Cơn co: đếm sóng → tô ô', say: 'Chọn số cơn và độ dài — xem băng ghi 10 phút & ô tô thay đổi', run(host, ctx) {
        const a = art.strip(); let n = 3, d = 1;
        const kind = ['dot', 'hatch', 'solid'], lens = ['< 20 giây', '20–40 giây', '> 40 giây'];
        const cells = [0, 1, 2, 3, 4].map(() => h('div', { class: 'cg' }));
        const sum = h('div', { class: 'big' }), seen = new Set();
        const paint = () => {
          a.set(n, d); cells.forEach((c, i) => c.className = 'cg ' + kind[d] + (i < n ? ' f' : ''));
          sum.textContent = `${n} cơn / 10 phút`; seen.add(n + '-' + d); if (seen.size >= 3) ctx.done();
          ctx.say(h('div', {}, 'Tô ', B(n + ' ô'), ' (từ dưới lên) bằng kiểu ', B(['chấm', 'sọc', 'đặc'][d]), ' vì mỗi cơn ', B(lens[d]), '.'));
        };
        host.append(lay(h('div', { class: 'frame' }, a.el), [
          h('div', { class: 'ctl' }, h('div', { class: 'cap' }, 'Số cơn trong 10 phút'), seg([1, 2, 3, 4, 5].map(k => [k, k + ' cơn']), k => { n = k; paint(); }, 2),
            h('div', { class: 'cap' }, 'Độ dài mỗi cơn → kiểu tô'), seg([[0, '· chấm <20s'], [1, '▨ sọc 20–40s'], [2, '■ đặc >40s']], k => { d = k; paint(); }, 1)),
          h('div', { class: 'row' }, h('div', { class: 'cgrid' }, cells), sum), ctx.xbox(),
          note(['Tần số bình thường (slide): tiềm thời 1–3 · hoạt động 3–5 · giai đoạn 2 khoảng 5 cơn/10 phút. ', B('Cơn co cường tính (tachysystole): > 5 cơn/10 phút'), '.'], 'b'),
          note(['Cơn co không đủ là nguyên nhân thường gặp nhất của chuyển dạ giai đoạn 1 kéo dài. Trên mẫu WHO gốc mỗi ô ngang = 30 phút.'], 'l'),
          h('div', { class: 'cap' }, 'Quy ước kiểu tô theo WHO — đối chiếu bản của thầy cô')]));
        paint();
        return () => a.stop();
      } },

      { t: 'Oxytocin: ghi nồng độ, tốc độ, thời điểm', say: 'Đổi cách truyền, kéo tốc độ giọt, rồi chạm giờ BẮT ĐẦU và giờ NGƯNG', run(host, ctx) {
        const a = art.drip(); let mode = 0, rate = 20, s = null, e = null;
        const sl = slider({ min: 4, max: 60, value: 20, label: 'Tốc độ', fmt: v => v + ' giọt/p', on(v) { rate = v; a.set(mode, rate); explain(); } });
        const explain = () => ctx.say(h('div', {}, 'Nồng độ pha trong chai ghi bằng ', B('IU/L'), '. ', mode ? ['Bơm tiêm điện → ghi ', B('mIU/phút'), '.'] : ['Dây truyền thường → ghi số ', B('giọt/phút bằng số La Mã'), ': ', rate, ' → ', B(roman(rate)), ' (ví dụ định dạng, không phải liều).']));
        const info = h('div', { class: 'cap' }, 'Chạm 1 ô giờ để đặt ▶ bắt đầu');
        const bs = [...Array(12)].map((_, i) => h('button', { 'aria-label': 'Giờ ' + i, onclick() {
          if (s === null || e !== null) { s = i; e = null; } else if (i >= s) e = i; else s = i;
          bs.forEach((b, j) => b.className = s === j ? 's' : e === j ? 'e' : (e !== null && j > s && j < e) ? 'a' : '');
          info.textContent = e === null ? `▶ bắt đầu giờ ${s} — giờ ngưng?` : `▶ giờ ${s} … ⏹ giờ ${e}: phải ghi ĐÚNG 2 mốc này trên sản đồ`;
          if (e !== null) ctx.done();
        } }, i));
        host.append(lay(h('div', { class: 'frame' }, a.el), [
          h('div', { class: 'ctl' }, seg([[0, '💧 Dây truyền'], [1, '💉 Bơm tiêm điện']], k => { mode = k; sl.style.display = k ? 'none' : ''; a.set(mode, rate); explain(); }), sl),
          ctx.xbox(), h('div', { class: 'ctl' }, h('div', { class: 'cap' }, '⏱️ Hàng oxytocin theo giờ'), h('div', { class: 'hr' }, bs), info)]));
        sl.init();
      } },

      { t: '🩺 Phần dưới: thuốc, sinh hiệu, nước tiểu', say: 'Chạm 4 vòng tròn ở phần dưới tờ sản đồ', run(host, ctx) {
        const p = Partograph({ rows: { liquor: false, mom: true } }); plotNow(p, CASE.full);
        const list = h('div', { class: 'row left' });
        hotspots(p, ctx, [
          [7, p.L.drug, 'Thuốc & dịch', ['Ghi ', B('thuốc dùng khác & dịch truyền'), ' đúng thời điểm.']],
          [7, p.L.pb, 'Mạch • / HA ↕', ['Slide: ', B('mạch mỗi 30 phút'), ' (chấm •) · ', B('HA mỗi 4 giờ'), ' hoặc gần hơn (mũi tên ↕).']],
          [7, p.L.temp, 'Nhiệt độ', ['Slide: ', B('nhiệt độ mỗi 2 giờ'), ' hoặc gần hơn.']],
          [7, p.L.urine, 'Nước tiểu', ['Nước tiểu: ', B('đạm niệu · acetone niệu · thể tích'), ' (mẫu WHO 1998).']]], list);
        host.append(lay(box(p), [h('div', { class: 'ctl' }, h('div', { class: 'cap' }, 'Đã khám phá:'), list), ctx.xbox(),
          note(['Handout: phần dưới ghi ', B('sinh hiệu, thuốc dùng khác, kết quả xét nghiệm'), ' (nếu có) — song hành với thời gian ở phần trung tâm.'], 'b')]));
        ctx.say('Phần dưới = tình trạng MẸ. Phần trên (tim thai, ối, biến dạng) = tình trạng THAI.');
      } },

      { t: '1 lần khám = 1 cột dọc', say: 'Chạm vào 1 cột trên sản đồ hoặc bấm "Lần 1…5"', run(host, ctx) {
        const p = Partograph({ rows: { fhr: true } }), C = CASE.full; plotNow(p, C);
        let bandEl = null; const tick = ctx.need(3);
        const show = i => { if (bandEl) bandEl.remove(); bandEl = p.col(C.X[i][0]);
          ctx.say(h('div', {}, B(`Lần khám ${i + 1} (giờ ${C.X[i][0]})`), h('br'), `♥ ${C.F[i]} · ✕ CTC ${C.X[i][1]} cm · ○ ngôi ${C.O[i]}/5 · ối ${C.L[i]} · biến dạng ${C.M[i]} · ${C.C[i][0]} cơn/10′`)); tick(); };
        p.onGrid(({ x }) => { if (x >= 0 && x < C.X.length) show(x); });
        host.append(lay(box(p), [h('div', { class: 'ctl' }, h('div', { class: 'row left' }, C.X.map((_, i) => h('button', { class: 'chip c-yellow', onclick: () => show(i) }, 'Lần ' + (i + 1))))),
          ctx.xbox(), note(['Mọi dữ kiện của 1 lần khám ghi ', B('cùng hoành độ'), ' với điểm ✕ mới — đọc theo cột dọc. Độ mở CTC luôn đi chung với độ lọt.'], 'm')]));
        ctx.say('Mỗi cột dọc = trọn bộ dữ kiện của 1 lần khám.');
      } },

      { t: '📄 Mẫu thực tế: WHO vs BV Từ Dũ', say: 'Đổi qua lại 2 mẫu — dòng tô vàng là chỗ cần để ý', run(host, ctx) {
        const area = h('div', { class: 'stack' }), side = h('div', { class: 'stack' }), tick = ctx.need(2), seen = new Set();
        const tr = (a, b, cls) => h('tr', { class: cls || '' }, h('td', {}, a), h('td', {}, b));
        const who = () => {
          area.replaceChildren(box(Partograph({ mode: 'orig', rows: { fhr: true, mom: true } }), { legend: false }));
          side.replaceChildren(h('table', { class: 'formtbl' }, tr('Tim thai', '100–180, chấm •'), tr('Ối · biến dạng', 'C T X K · 0 + ++ +++'),
            tr('CTC ✕ · ngôi ○', 'có pha tiềm thời (bản gốc) · ngôi 5/5 → 0/5', 'hl'), tr('Giờ', '0 → 24'), tr('Cơn co /10 phút', 'tô ô: chấm · sọc · đặc', 'hl'),
            tr('Oxytocin', 'IU/L · giọt/phút'), tr('Thuốc & dịch', '—'), tr('Mạch • · HA ↕', '60–180'), tr('Nhiệt · nước tiểu', 'đạm · acetone · thể tích')),
          note('Mẫu WHO 1993/1998 — dùng trong bài giảng BM Phụ Sản.', 'b'));
        };
        const td = () => {
          const p = Partograph({ rows: nomark }); plotNow(p, { X: [[0, 4], [1, 6], [1.25, 10]], O: [4, 3, 0], Pos: ['CCTT', 'CCTN', 'CV'] });
          area.replaceChildren(box(p), h('div', { class: 'cap' }, 'Phỏng theo 1 bản điền thật: 18h CTC 4 cm (trên đường báo động) → 19h 6 cm → 19h15 mở trọn; ngôi 4/5 → 3/5 → 0/5; kiểu thế TT → TN → CV.'));
          side.replaceChildren(h('table', { class: 'formtbl' }, tr('Áp dụng', 'chỉ giai đoạn hoạt động · 12 cột giờ', 'hl'), tr('Sinh hiệu', 'M · nhiệt độ · HA'),
            tr('Tim thai', 'TTCB · DĐNT · nhịp giảm (0/I/II/III)', 'hl'), tr('Cơn gò', 'tần số /10 phút · cường độ (mmHg)', 'hl'),
            tr('Độ lọt (O)', 'Cao −3 = 5/5 · Chúc −2 = 4/5 · Chặt −1 = 3/5 · Lọt cao 0 = 2/5 · Lọt vừa +1 = 1/5 · Lọt thấp +2 = 0/5', 'hl'),
            tr('Hàng dưới', 'Kiểu thế · Chồng xương (+) · Bất đối xứng (+) · Bướu HT (+/++) · Nước ối – màu', 'hl'), tr('Cuối', 'Thuốc – xử trí · người khám ký tên')),
          note('Mẫu "Biểu đồ chuyển dạ" BV Từ Dũ (giai đoạn hoạt động).', 'p'));
        };
        host.append(seg([['w', '🌍 WHO (bản gốc)'], ['t', '🏥 BV Từ Dũ']], k => { (k === 'w' ? who : td)(); if (!seen.has(k)) { seen.add(k); tick(); } }), lay(area, side));
        who(); seen.add('w'); tick();
      } }
    ] });
})();
