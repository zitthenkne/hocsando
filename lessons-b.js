/* lessons-b.js — PHẦN B (ch.4 Vẽ sản đồ) + PHẦN C (ch.5 Đọc sản đồ, ch.6 Bên trái báo động) */
(function () {
  const nomark = { liquor: false, cont: false, oxy: false };
  const B = t => h('b', {}, t);
  const sub = n => String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[d]);
  const one = (x, y, f, l, m, c) => ({ X: [[x, y]], O: [f], L: [l], M: [m], C: [c] });

  /* =====================================================================
     CHƯƠNG 4 — VẼ SẢN ĐỒ
  ===================================================================== */
  CH.push({ e: '🍑', c: 'yellow', part: 'B', t: 'Vẽ sản đồ',
    goals: ['Biết khi nào được bắt đầu vẽ', 'Tính đúng toạ độ mỗi lần khám', 'Tịnh tiến đúng lên đường báo động (bản gốc)'],
    keys: [['Xₙ = ?', '( xₙ₋₁ + a , yₙ ) — a = số giờ kể từ lần khám trước, yₙ = CTC mới'],
      ['Tịnh tiến: giữ gì, đổi gì?', 'Giữ TUNG ĐỘ, trượt ngang lên đường báo động. Làm 1 lần, khi CTC ≥ 3 cm (bản gốc)'],
      ['Khi nào KHÔNG vẽ sản đồ?', 'Khi đã có chỉ định mổ sanh ngay từ đầu'],
      ['Nếu thuận lợi, CTC 5 cm lúc 18h sẽ mở trọn chậm nhất lúc mấy giờ?', '23h — bám đường báo động 1 cm/giờ (5 → 10 cm mất 5 giờ)']],
    steps: [
      { t: 'Khi nào bắt đầu vẽ? (bản gốc)', say: 'Bật/tắt từng điều kiện — xem khi nào được vẽ', run(host, ctx) {
        const s = { a: 0, b: 0, c: 0, m: 0 }, seen = new Set(), out = h('div', { class: 'stack' });
        const defs = [['a', '💪', 'Co đều ≥ 2 cơn / 10 phút'], ['b', '🌸', 'Cơn co đã gây xóa mở CTC'], ['c', '💧', 'Đầu ối đã thành lập'], ['m', '🔪', 'Đã có chỉ định MỔ SANH ngay từ đầu']];
        const upd = () => {
          const k = s.m ? 'no' : (s.a && s.b && s.c) ? 'ok' : 'wait'; seen.add(k);
          out.replaceChildren(k === 'ok' ? stamp('✏️ VẼ ĐƯỢC!', 'ok') : k === 'no' ? stamp('🚫 KHÔNG vẽ', 'no') : stamp('⏳ Chưa vẽ', 'warn'));
          ctx.say(h('div', {}, k === 'ok' ? ['Đủ 3 dấu hiệu → ', B('chuyển dạ thật sự'), ' → bắt đầu sản đồ ở hoành độ 0 (pha tiềm thời: đánh giá lại mỗi 4 giờ — slide).'] : k === 'no' ? ['Sản đồ để ', B('phòng chuyển dạ kéo dài'), '. Đã có chỉ định mổ sanh từ đầu thì lập sản đồ là vô nghĩa.'] : ['Chưa đủ dấu hiệu chuyển dạ thật → vẽ sớm là ', B('sai'), '. CTC có thể mở mà KHÔNG phải chuyển dạ (bất thường CTC, sanh nhiều lần).']));
          if (seen.has('ok') && seen.has('no')) ctx.done();
        };
        const card = h('div', { class: 'frame stack' }, h('div', { class: 'big' }, '🤰 Sản phụ vào phòng sanh'),
          defs.map(([k, e, t]) => h('button', { class: 'tile', onclick() { s[k] ^= 1; this.style.background = s[k] ? (k === 'm' ? 'var(--coral)' : 'var(--mint)') : ''; this.querySelector('.ck').textContent = s[k] ? '☑' : '☐'; upd(); } }, h('span', { class: 'ck', style: { fontSize: '22px' } }, '☐'), h('span', { class: 'em' }, e), t)));
        host.append(lay(card, [out, ctx.xbox(), note(['Điều kiện chung: sản phụ có ', B('chỉ định sanh ngả âm đạo'), '.'], 'l')], 'even'));
        upd();
      } },

      { t: 'Bản rút gọn: vẽ từ CTC ≥ 4 cm', say: 'Kéo CTC lúc nhập viện — điểm đầu tiên rơi vào đâu?', run(host, ctx) {
        const p = Partograph({ rows: nomark });
        const out = h('div', { class: 'stack' }), seen = new Set();
        const sl = slider({ min: 0, max: 9, value: 2, label: 'CTC lúc nhập viện', fmt: v => v + ' cm', on(v) {
          p.clear(); out.replaceChildren();
          if (v < 4) { out.append(stamp('⏳ < 4 cm: chưa vẽ', 'warn')); ctx.say('Bản rút gọn không có pha tiềm thời → chưa vẽ.'); seen.add('a'); }
          else {
            p.addX(v - 4, v); p.note(v - 4, v, `X(${v - 4} , ${v})`, 'g'); out.append(stamp(`✏️ X(${v - 4} , ${v})`, 'ok'));
            ctx.say(h('div', {}, 'Điểm đầu tiên nằm ', B('NGAY TRÊN đường báo động'), ', tung độ = CTC. Hoành độ ', v - 4, ' ', B('không'), ' nói lên đã chuyển dạ bao lâu.'));
            seen.add(v > 4 ? 'c' : 'b');
          }
          if (seen.size >= 3) ctx.done();
        } });
        host.append(lay(box(p), [h('div', { class: 'ctl' }, sl, out), ctx.xbox(),
          note(['Slide: khi nhập viện đã ở pha hoạt động, điều kiện cơn co giảm còn ', B('≥ 1 cơn/10 phút, mỗi cơn ≥ 20 giây'), ' (giảm chẩn đoán sai).'], 'l')]));
        sl.init();
      } },

      { t: 'Toạ độ mỗi lần khám', say: 'Chọn số giờ và CTC, bấm "Ghi" — làm 3 lần', run(host, ctx) {
        const p = Partograph({ rows: nomark });
        let prev = { x: 0, y: 4 }, a = 1, y = 5, n = 1; p.addX(0, 4, { anim: false });
        const f = h('div', { class: 'formula' }), tick = ctx.need(3);
        const upd = () => f.replaceChildren(`X${sub(n + 1)} = ( `, h('i', {}, prev.x), ' + ', h('b', {}, a), ' , ', y, ` ) = ( ${prev.x + a} , ${y} )`);
        const s1 = slider({ min: 1, max: 4, value: 1, label: 'a = cách lần trước', fmt: v => v + ' giờ', on(v) { a = v; upd(); } });
        const s2 = slider({ min: 4, max: 10, value: 5, label: 'y = CTC mới', fmt: v => v + ' cm', on(v) { y = v; upd(); } });
        const go = h('button', { class: 'btn go', onclick() {
          const x = prev.x + a; if (x > p.X1) { ctx.oops('Hết khung giấy rồi 😅'); return; }
          p.gOver.replaceChildren(); p.addX(x, y); p.arrow(prev.x, .7, x, .7, 'b'); p.note((prev.x + x) / 2 - .5, .7, `+${a} giờ`, 'b');
          p.vline(prev.x); p.vline(x);
          ctx.say(h('div', {}, 'Hoành độ mới = ', B(prev.x), ' (lần trước) + ', B(a), ' giờ = ', B(x), '. Tung độ = CTC = ', B(y), ' cm.'));
          prev = { x, y }; n++; upd(); tick();
        } }, '✏️ Ghi lần khám');
        host.append(lay(box(p), [f, h('div', { class: 'ctl' }, s1, s2, h('div', { class: 'row' }, go)), ctx.xbox(),
          note(['Giờ thực tế (vd 14h, 15h…) ghi ngay ', B('dưới hàng giờ'), ' của sản đồ.'], 'l')]));
        s1.init(); ctx.say('Lần 1 đã ghi sẵn tại X₁(0 , 4).');
      } },

      { t: 'Tịnh tiến là gì?', say: 'Xem giảng từng bước — bấm ◀ ▶ để tua', run(host, ctx) {
        const p = Partograph({ mode: 'orig' }), fresh = () => p.gOver.replaceChildren();
        const at = x => one(x, 4, 5, 'T', '0', [2, 2]);
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: ['Nhập viện 5:20 · CTC 4 cm · ngôi 5/5 · ối vỡ trước nhập viện · 2 cơn/10′ (50 giây). Ghi tất cả ở ', B('hoành độ 0'), '.'], run() { p.exam(at(0), 0); p.col(0); } },
            { t: ['CTC 4 cm ≥ 3 cm → đã vào ', B('pha hoạt động'), ' → phải TỊNH TIẾN.'], run() { fresh(); p.ring(0, 4); p.note(0, 4, '4 cm ≥ 3 cm', 'r'); } },
            { t: ['Quy tắc: giữ nguyên ', B('TUNG ĐỘ'), ' (4 cm) — chỉ đổi hoành độ.'], run() { fresh(); p.hline(4); } },
            { t: ['Trượt ngang ', B('CẢ CỘT'), ' dữ kiện tới khi ✕ chạm đường báo động.'], ms: 4200, run(b) {
              fresh(); p.hline(4);
              if (b.fast) { p.clear(); p.exam(at(9), 0); return; }
              p.slide(9, 1400); b.later(() => { p.clear(); p.fast = true; p.exam(at(9), 0); p.fast = false; p.hline(4); p.ring(9, 4, 'g'); }, 1500);
            } },
            { t: ['Kết quả ', B('X′(9 , 4)'), '. Hoành độ 9 chỉ là MỐC VẼ — ', B('không phải'), ' 9 giờ đã chuyển dạ.'], run() { fresh(); p.note(9, 4, 'X′(9 , 4)', 'g'); p.vline(9); } },
            { t: ['Lần khám sau tính từ mốc X′: 2 giờ sau CTC 6 cm → hoành độ ', B('9 + 2 = 11'), '.'], run() {
              fresh(); p.exam({ X: [[9, 4], [11, 6]], O: [5, 4], L: ['T', 'T'], M: ['0', '0'], C: [[2, 2], [3, 2]] }, 1);
              p.arrow(9, .7, 11, .7, 'b'); p.note(9.5, .7, '+2 giờ', 'b');
            } },
            { t: ['⚠️ Bẫy: vài ghi chú ôn tập viết "tịnh tiến khi ≥ 4 cm". Bài BM (bản gốc): tịnh tiến ', B('MỘT lần, khi CTC ≥ 3 cm'), '. Mốc 4 cm là của bản rút gọn (bắt đầu vẽ).'] }
          ]
        }));
      } },

      { t: 'Tự tay tịnh tiến', say: 'Lúc 0:30 CTC 5 cm. KÉO dấu ✕ sang ngang tới đúng chỗ (hoặc chạm ô)', run(host, ctx) {
        const p = Partograph({ mode: 'orig', rows: nomark }); p.svg.style.touchAction = 'none';
        p.addX(0, 5, { anim: false });
        const trail = S('line', { class: 'hl', x1: p.px(0), y1: p.py(5), x2: p.px(0), y2: p.py(5) }, p.gOver);
        let ok = false, bad = 0;
        const judge = x => {
          if (ok || x === 0) return;
          if (x === 10) { ok = true; p.ring(10, 5, 'g'); p.note(10, 5, "X′(10 , 5) ✔", 'g'); ctx.ok('Chuẩn! Nằm ngay trên đường báo động.'); host.querySelector('.side').prepend(stamp("X′(10 , 5)", 'ok')); ctx.done(); return; }
          bad++; ctx.oops(x < 10 ? `(${x} , 5) còn nằm bên TRÁI đường báo động → sai!` : `(${x} , 5) lố sang phải rồi!`);
          if (bad >= 2) ctx.say(h('div', {}, '💡 Đường báo động ở tung độ 5 cm có hoành độ = 8 + (5 − 3) = ', B('10'), '.'));
        };
        const d = p.dragX(0, 5, { move(x) { trail.setAttribute('x2', p.px(x)); ctx.say(h('div', {}, `Đang ở (${x} , 5) — `, p.zoneOf(x, 5) === 'alert' ? B('đúng trên đường báo động!') : p.zoneOf(x, 5) === 'left' ? 'bên trái đường báo động' : 'đã lố sang phải')); }, drop: judge });
        p.onGrid(({ x, y }) => { if (y !== 5) { ctx.oops('Tung độ phải giữ nguyên 5 cm!'); return; } d.moveTo(x); trail.setAttribute('x2', p.px(x)); judge(x); });
        host.append(lay(box(p), [ctx.xbox(), note(['Hình 10 (handout): tịnh tiến ', B('SAI'), ' thành X′(8 , 5) — đúng phải là X′(10 , 5).'], 'p')]));
        ctx.say('Dấu ✕ hồng nhảy nhảy là dấu kéo được. Tung độ đã bị khoá ở 5 cm.');
      } },

      { t: 'Tịnh tiến muộn (CTC đạt 3 cm sau)', say: 'Xem giảng — có câu hỏi chặn giữa bài', run(host, ctx) {
        const p = Partograph({ mode: 'orig', rows: nomark }), fresh = () => p.gOver.replaceChildren();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: ['Nhập viện: CTC 2 cm, ngôi 5/5, ối còn → ghi ', B('X(0 , 2)'), '.'], run() { p.addX(0, 2); p.addO(0, 5); } },
            { t: ['CTC ', B('< 3 cm'), ' → CHƯA tịnh tiến, cứ ghi bình thường trong vùng tiềm thời.'], run() { fresh(); p.note(0, 2, '2 cm < 3 cm'); } },
            { t: ['3 giờ sau: CTC ', B('3 cm'), ' → ghi X(3 , 3).'], run() { fresh(); p.addX(3, 3); p.addO(3, 5); p.arrow(0, .5, 3, .5, 'b'); p.note(.8, .5, '+3 giờ', 'b'); } },
            { t: 'Câu hỏi:', ask: { q: 'Bây giờ phải làm gì?', opts: ['Chờ tới 4 cm mới tịnh tiến', 'Tịnh tiến X(3,3) lên đường báo động', 'Vẽ lại sản đồ từ đầu'], ans: 1, no: { 0: 'Bản gốc: ngưỡng hoạt động là 3 cm.', 2: 'Không cần vẽ lại.' } } },
            { t: ['Giữ tung độ 3 → trượt ngang tới đường báo động: ', B('X′(8 , 3)'), '.'], run(b) {
              fresh(); p.arrow(3, 3, 8, 3, 'g');
              b.later(() => { p.addX(8, 3, { join: false }); p.note(8, 3, 'X′(8 , 3)', 'g'); }, 700);
            } },
            { t: ['Tịnh tiến chỉ làm ', B('MỘT lần'), '. Từ giờ, các lần khám sau lấy mốc X′.'], run() { p.ring(8, 3, 'g'); } }
          ]
        }));
      } },

      { t: 'Vẽ cùng tui! (thực hành)', say: 'Đọc phiếu khám, rồi CHẠM vào đúng ô của dấu ✕ (CTC)', gate: true, run(host, ctx) {
        const p = Partograph({ rows: { oxy: false } });
        const E = [
          { x: 1, y: 5, txt: ['Nhập viện', 'CTC 5 cm · ngôi 4/5 · ối còn (C) · biến dạng 0 · 3 cơn/10′ (40 giây)'], hint: 'Bản rút gọn: điểm đầu tiên nằm NGAY TRÊN đường báo động, tung độ = 5.' },
          { x: 3, y: 8, txt: ['Sau 2 giờ', 'CTC 8 cm · ngôi 3/5 · ối vỡ, trong (T) · biến dạng + · 4 cơn/10′ (45 giây)'], hint: 'Hoành độ = 1 (lần trước) + 2 giờ = 3.' },
          { x: 4, y: 10, txt: ['Sau 1 giờ', 'CTC 10 cm · ngôi 1/5 · ối T · biến dạng + · 4 cơn/10′ (45 giây)'], hint: 'Hoành độ = 3 (lần trước) + 1 giờ = 4.' }];
        const C = { X: E.map(e => [e.x, e.y]), O: [4, 3, 1], L: ['C', 'T', 'T'], M: ['0', '+', '+'], C: [[3, 1], [4, 2], [4, 2]] };
        const card = h('div', { class: 'frame stack' }); let k = 0, bad = 0;
        const show = () => { card.replaceChildren(h('div', { class: 'row left' }, E.map((_, i) => h('span', { class: 'pill ' + (i < k ? 'g' : i === k ? '' : 'w') }, 'Lần ' + (i + 1)))), h('div', { class: 'big', style: { textAlign: 'left' } }, '📝 ' + E[k].txt[0]), h('div', {}, E[k].txt[1])); bad = 0; };
        const hintB = h('button', { class: 'chip c-lav', onclick() { if (k < E.length) { p.col(E[k].x); ctx.say(h('div', {}, '💡 ', E[k].hint)); } } }, '💡 Gợi ý');
        host.append(lay(box(p), [card, h('div', { class: 'row left' }, hintB), ctx.xbox()]));
        show(); ctx.say('Chỉ cần chạm đúng dấu ✕ — ○, ối, biến dạng, cơn co sẽ tự lên cùng cột.');
        p.onGrid(({ x, y }) => {
          if (k >= E.length) return; const e = E[k];
          if (x === e.x && y === e.y) {
            p.gOver.replaceChildren(); p.exam(C, k);
            if (k) { p.arrow(E[k - 1].x, .6, e.x, .6, 'b'); p.note(E[k - 1].x, .6, `+${e.x - E[k - 1].x} giờ`, 'b'); }
            ctx.ok('Chuẩn! Cả cột dữ kiện đã lên.'); k++;
            if (k < E.length) ctx.later(show, 700);
            else { card.replaceChildren(stamp('🟢 Bên trái đường báo động', 'ok')); ctx.say(h('div', {}, 'CTC mở ', B('nhanh hơn 1 cm/giờ'), ' + ngôi xuống đều + cơn co tốt → ', B('dự báo thuận lợi'), '.')); ctx.done(); }
          } else { bad++; ctx.oops(y !== e.y ? `CTC ${e.y} cm → tung độ ${e.y} nha.` : 'Sai hoành độ rồi.'); if (bad >= 2) ctx.say(h('div', {}, '💡 ', e.hint)); }
        });
      } },

      { t: 'Bài tập: Bà X (có tịnh tiến)', say: 'Làm theo từng bước ở khung bên phải: chạm sản đồ hoặc chọn đáp án', gate: true, run(host, ctx) {
        const p = Partograph({ mode: 'orig', rows: { fhr: true, mom: true, oxy: false }, times: [[0, '14h'], [4, '18h'], [10, '18h'], [12, '20h'], [14, '22h'], [15, '23h']] });
        const BX = { X: [[0, 2], [4, 5], [10, 5]], J: [1, 1, 0], O: [5, 3, 3], L: ['C', 'T', 'T'], M: ['0', '0', '0'], C: [[2, 1], [3, 2], [3, 2]], F: [130, 140, 140],
          P: [78, 80, 80], BP: [[110, 70], [105, 70], [105, 70]], T: ['36,6', '37', '37'], U: [['−', '−', '100'], null, null] };
        const tasks = [
          { ask: '14h nhập viện. Chạm vị trí ✕ đầu tiên.', short: '14h: X(0 , 2) — pha tiềm thời', tap: [0, 2], hint: 'Bắt đầu ở hoành độ 0; CTC 2 cm.',
            info: 'CTC 2 cm · đầu 5/5 · ối còn · 2 cơn/10′ (20 giây) · tim thai 130 · M 78 · HA 110/70 · T 36,6°C · nước tiểu 100 ml, đạm (−), acetone (−)', then: () => p.exam(BX, 0) },
          { ask: '18h (4 giờ sau): CTC 5 cm. Chạm ✕ của lần khám này (CHƯA tịnh tiến).', short: '18h: X(4 , 5)', tap: [4, 5], hint: 'Hoành độ = 0 + 4 giờ = 4.',
            info: 'Tim thai 140 · ối vỡ, trắng đục (T) · không uốn khuôn · đầu 3/5 · 3 cơn/10′ (50 giây) · HA 105/70 · M 80 · T 37°C', then: () => p.exam(BX, 1) },
          { ask: 'CTC 5 cm (bản gốc) → làm gì tiếp?', short: 'Tịnh tiến vì CTC ≥ 3 cm', opts: ['Giữ nguyên, khám tiếp', 'Tịnh tiến lên đường báo động', 'Chờ tới 4 cm'], ans: 1, no: { 2: 'Bản gốc: ngưỡng là 3 cm.' } },
          { ask: 'Chạm điểm X′ sau tịnh tiến.', short: 'X′(10 , 5)', tap: [10, 5], hint: 'Giữ tung độ 5 → đường báo động ở 5 cm có hoành độ 10.',
            then: () => { p.clear(); p.fast = true; p.exam(BX, 0); p.exam(BX, 2); p.fast = false; p.arrow(4, 5, 10, 5, 'g'); } },
          { ask: 'Nếu thuận lợi (≥ 1 cm/giờ), CTC mở trọn chậm nhất lúc mấy giờ?', short: 'Mở trọn chậm nhất 23h', opts: ['20h', '23h', '2h sáng hôm sau'], ans: 1,
            why: 'Đi theo đường báo động: 5 → 10 cm mất 5 giờ → 18h + 5 = 23h (hoành độ 15).', then: () => p.ring(15, 10, 'g') },
          { ask: '22h: khám CTC 7 cm. Chạm ✕.', short: '22h: X(14 , 7)', tap: [14, 7], hint: '22h = 18h + 4 giờ → hoành độ 10 + 4 = 14.', then: () => p.addX(14, 7) },
          { ask: 'Điểm 22h nằm ở đâu?', short: '22h: giữa 2 đường (chuyển phải)', opts: ['Bên trái báo động', 'Giữa báo động & hành động', 'Bên phải hành động'], ans: 1,
            why: 'Ở hoành độ 14: đường báo động = 9 cm, đường hành động = 5 cm → 7 cm nằm giữa → chuyển phải.', then: () => p.flash('m') },
          { ask: 'Nếu đang ở trạm y tế / TTYT: làm gì?', short: 'TTYT: chuyển tuyến', opts: ['Theo dõi như thường', 'Chuyển tuyến (trừ khi CTC gần trọn)', 'Tăng co oxytocin tại chỗ'], ans: 1,
            why: 'Slide: TTYT → chuyển tuyến trừ khi CTC gần trọn. Handout: tăng co chỉ ở tuyến huyện trở lên.', no: { 2: 'Tăng co chỉ làm ở tuyến huyện trở lên.' } },
          { ask: 'Nếu đang ở bệnh viện: bước đầu tiên?', short: 'BV: soi 3P tìm nguyên nhân', opts: ['Mổ sanh ngay', 'Đánh giá 3P tìm nguyên nhân — ối đã vỡ nên xem lại cơn co', 'Cho về'], ans: 1,
            why: 'Ối đã vỡ → không còn phá ối. Co chưa đủ → tăng co; co tốt + ối vỡ mà vẫn chậm → nghĩ trở ngại cơ học.' }];
        host.append(note('Đề (slide "Chuyển dạ bất thường & Partograph"): Bà X. nhập viện lúc 14 giờ vì chuyển dạ. Vẽ trên sản đồ bản gốc.', 'l'), lay(box(p), [drill(ctx, p, tasks), ctx.xbox()]));
      } },

      { t: 'Bài tập: Bà A (tim thai mỗi 30 phút)', say: 'Làm theo từng bước — có cả phần ghi tim thai, mạch, cơn co', gate: true, run(host, ctx) {
        const p = Partograph({ mode: 'orig', rows: { fhr: true, mom: true, oxy: false }, times: [[0, '5h'], [4, '9h'], [10, '9h'], [11, '10h'], [12, '11h'], [13, '12h'], [14, '13h']] });
        const A0 = { X: [[0, 2]], O: [4] };
        const A9 = { X: [[10, 5]], J: [0], O: [3], L: ['T'], M: ['0'], C: [[3, 1]], F: [120], P: [80], BP: [[120, 70]], T: ['36,8'], U: [['−', '−', '200']] };
        const HALF = { X: [[10.5, null], [11, null], [11.5, null], [12, null], [12.5, null], [13, null], [13.5, null]],
          F: [120, 136, 140, 130, 136, 140, 130], P: [80, 80, 88, 88, 84, 88, 88], C: [null, [3, 1], null, [3, 1], null, [4, 1], null],
          T: [null, null, null, '37', null, null, null], O: [null, null, null, null, 2, null, null] };
        const A13 = { X: [[14, 10]], O: [0], L: ['T'], M: ['0'], C: [[4, 2]], F: [140], P: [90], BP: [[100, 70]], T: ['37'], U: [['−', '−', '150']] };
        const tasks = [
          { ask: '5h nhập viện. Chạm ✕ đầu tiên.', short: '5h: X(0 , 2)', tap: [0, 2], hint: 'Hoành độ 0, CTC 2 cm.',
            info: 'Bà A., PARA 2012 · ối vỡ tại nhà lúc 4h · đầu 4/5 · CTC 2 cm', then: () => p.exam(A0, 0) },
          { ask: '9h: CTC 5 cm. Chạm ✕ (CHƯA tịnh tiến).', short: '9h: X(4 , 5)', tap: [4, 5], hint: '5h → 9h = 4 giờ.',
            info: 'Đầu 3/5 · CTC 5 cm · 3 cơn/10′ (20–40 giây) · tim thai 120 · ối vỡ, trắng đục · không uốn khuôn · HA 120/70 · T 36,8°C · M 80 · nước tiểu 200 ml (−)', then: () => p.addX(4, 5) },
          { ask: 'Tịnh tiến: chạm X′.', short: "X′(10 , 5)", tap: [10, 5], hint: 'Giữ tung độ 5 cm.',
            then: () => { p.clear(); p.fast = true; p.exam(A0, 0); p.exam(A9, 0); p.fast = false; p.arrow(4, 5, 10, 5, 'g'); } },
          { ask: '9h: hiện tại cần làm gì?', short: '9h: theo dõi tiếp', opts: ['Theo dõi tiếp', 'Tăng co ngay', 'Mổ sanh'], ans: 0,
            why: 'X′ nằm ngay trên đường báo động; ối đã vỡ, co 3 cơn/10′, tim thai 120 → chưa có gì bất thường, theo dõi tiếp.' },
          { ask: 'Bạn mong đợi gì lúc 13h?', short: '13h: CTC ≥ 9 cm', opts: ['CTC ≥ 9 cm (tối thiểu bám đường báo động)', 'CTC khoảng 6 cm', 'Chưa đoán được'], ans: 0,
            why: 'Tối thiểu 1 cm/giờ: 5 + 4 = 9 cm lúc 13h (hoành độ 14).', then: () => p.ring(14, 9, 'g') },
          { ask: 'Ghi nhận các lần nghe tim thai & đo mạch mỗi 30 phút, cơn co mỗi giờ.', short: '9g30 → 12g30: đã ghi', act: '▶ Ghi nhận 9g30 → 12g30',
            info: 'TT 120 → 136 → 140 → 130 → 136 → 140 → 130 · mạch 80 → 88 · cơn co 3/10′ (30–40 giây) rồi 4/10′ · 11g30 đầu 2/5 · T 37°C lúc 11g',
            then: () => HALF.X.forEach((_, i) => ctx.later(() => p.exam(HALF, i), i * 260)) },
          { ask: '13g: đầu 0/5, CTC mở trọn. Chạm ✕.', short: '13h: X(14 , 10)', tap: [14, 10], hint: '13h = 9h + 4 giờ → hoành độ 14.',
            info: 'TT 140 · 4 cơn/10′ (45 giây) · M 90 · T 37°C · ối trắng đục · không uốn khuôn · HA 100/70 · nước tiểu 150 ml (−)', then: () => p.exam(A13, 0) },
          { ask: '13g: xử trí?', short: '13h: sang giai đoạn 2', opts: ['Mổ sanh', 'Chuyển sang giai đoạn 2, theo dõi sanh ngả âm đạo', 'Tăng co oxytocin'], ans: 1,
            why: 'Sản đồ bên trái báo động, ngôi xuống đều 3/5 → 0/5, tim thai 120–140, co 4 cơn/10′ → chuyển dạ thuận lợi.' }];
        host.append(note('Đề (slide "Chuyển dạ bất thường & Partograph"): Bà A., PARA 2012, nhập viện lúc 5 giờ sáng. Vẽ trên sản đồ bản gốc.', 'l'), lay(box(p), [drill(ctx, p, tasks), ctx.xbox()]));
      } }
    ] });

  /* =====================================================================
     CHƯƠNG 5 — ĐỌC SẢN ĐỒ (Phần C)
  ===================================================================== */
  CH.push({ e: '🍋', c: 'mint', part: 'C', t: 'Đọc sản đồ',
    goals: ['Hiểu 2 động lực làm mở cổ tử cung', 'Xếp đường CTC vào đúng 1 trong 3 vùng', 'Đọc đủ 6 dữ kiện rồi mới lý giải bằng 3P'],
    keys: [['Động lực CHÍNH làm mở CTC?', 'Cơn co tử cung. Động lực thứ hai: ngôi thai nong CTC'],
      ['6 dữ kiện phải đọc?', 'CTC · ngôi (& kiểu thế) · cơn co · ối · biến dạng đầu · tim thai'],
      ['3P là gì?', 'Power (cơn co) · Passenger (thai) · Passage (khung chậu)']],
    steps: [
      { t: '2 động lực mở cổ tử cung', say: 'Bấm "Cơn co" 4 lần — xem thai đi xuống và CTC mở', run(host, ctx) {
        const a = art.uterus(); let k = 0;
        const prog = h('div', { class: 'big' }, 'CTC đóng');
        const btn = h('button', { class: 'btn go', onclick() {
          if (k >= 4) { k = 0; a.set(0); prog.textContent = 'CTC đóng'; btn.textContent = '💪 Cơn co!'; ctx.say(''); return; }
          k++; a.pulse(); a.set(k); burst(btn, ['💪']);
          prog.textContent = k >= 4 ? '🌸 Mở trọn!' : `CTC mở dần… ${k}/4`;
          ctx.say(h('div', {}, k === 1 ? ['① ', B('Cơn co'), ' ép thân tử cung → đẩy thai xuống. Đây là ', B('động lực CHÍNH'), ' làm xóa mở CTC.'] : k === 2 ? ['② ', B('Ngôi thai'), ' tì vào CTC và nong nó ra = ', B('động lực thứ hai'), '.'] : k === 3 ? ['Muốn nong được CTC, ngôi phải ', B('lọt rồi xuống'), '.'] : ['→ Đọc sản đồ phải nhìn ', B('CẢ đường CTC lẫn đường ngôi'), '.']));
          if (k >= 4) { btn.textContent = '⟲ Làm lại'; ctx.done(); }
        } }, '💪 Cơn co!');
        host.append(lay(h('div', { class: 'frame' }, a.el), [h('div', { class: 'ctl' }, h('div', { class: 'row' }, btn), prog), ctx.xbox()]));
      } },

      { t: '3 vùng: kéo tốc độ mở CTC', say: 'Kéo tốc độ — xem đường CTC rơi vào vùng nào (thử đủ 3 vùng)', run(host, ctx) {
        const p = Partograph({ rows: nomark });
        const path = S('path', { fill: 'none', 'stroke-width': 6, 'stroke-linecap': 'round' }, p.gOver), out = h('div', { class: 'stack' }), seen = new Set();
        const sl = slider({ min: 2, max: 20, value: 15, label: 'Tốc độ', fmt: v => (v / 10).toFixed(1) + ' cm/giờ', on(v) {
          const s = v / 10, xe = Math.min(6 / s, p.X1), ye = 4 + s * xe, z = p.zoneOf(xe, ye);
          path.setAttribute('d', `M${p.px(0)},${p.py(4)} L${p.px(xe)},${p.py(ye)}`);
          const k = (z === 'left' || z === 'alert') ? 'l' : z === 'mid' ? 'm' : 'r'; seen.add(k);
          path.setAttribute('stroke', { l: '#34c08e', m: '#ffb703', r: '#ec4c72' }[k]);
          out.replaceChildren(k === 'l' ? stamp('🟢 Bên trái', 'ok') : k === 'm' ? stamp('🟡 Giữa 2 đường', 'warn') : stamp('🔴 Chạm hành động', 'no'));
          ctx.say(h('div', {}, k === 'l' ? ['Mở ', B('≥ 1 cm/giờ'), ' → nhanh hơn tốc độ tối thiểu.'] : k === 'm' ? ['Chậm hơn tối thiểu → ', B('ra khỏi giới hạn bình thường'), ', nguy cơ chuyển dạ kéo dài → ', B('tìm nguyên nhân'), '.'] : ['Hết thời hạn điều chỉnh → ', B('đánh giá lại & hành động quyết đoán'), '.']));
          if (seen.size === 3) ctx.done();
        } });
        host.append(lay(box(p), [h('div', { class: 'ctl' }, sl, out), ctx.xbox()]));
        sl.init();
      } },

      { t: 'Quy trình đọc 6 bước', say: 'Xem giảng: đọc một sản đồ theo đúng thứ tự', run(host, ctx) {
        const p = Partograph({ rows: { oxy: false, fhr: true } }), fresh = () => p.gOver.replaceChildren();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); plotNow(p, CASE.full); },
          beats: [
            { t: ['① ', B('Đường CTC'), ' nằm vùng nào? → hẳn bên trái báo động.'], run() { fresh(); p.rowBox('ctc'); p.flash('l'); } },
            { t: ['② ', B('Ngôi'), ' có xuống không? → 5/5 → 0/5, đều đặn; kiểu thế trước rồi xoay về chẩm vệ.'], run() { fresh(); p.ring(0, 5, 'b'); p.ring(4, 0, 'b'); p.arrow(.4, 4.6, 3.6, .4, 'b'); } },
            { t: ['③ ', B('Cơn co'), ' đủ chưa? → 3 → 5 cơn/10′, dài dần (không quá 5 cơn).'], run() { fresh(); p.rowBox('cont'); } },
            { t: ['④ ', B('Ối'), ': còn hay vỡ, màu gì? → C rồi T (vỡ, trong).'], run() { fresh(); p.rowBox('liq'); } },
            { t: ['⑤ ', B('Biến dạng đầu'), '? → 0 → +, nhẹ.'], run() { fresh(); p.rowBox('mould'); } },
            { t: ['⑥ ', B('Tim thai'), ' ổn không? → 138–146, trong khoảng 120–160.'], run() { fresh(); p.rowBox('fhr'); } },
            { t: ['→ Ghép 6 dữ kiện + ', B('3P'), ' + tiền sử mới lý giải được. Sản đồ chỉ ', B('cảnh báo'), ' — BẠN chẩn đoán.'], run() { fresh(); } }
          ]
        }));
      } },

      { t: '3P: bộ ba cần soi', say: 'Lật 4 thẻ — luôn soi 3P + tiền sử TRƯỚC khi kết luận', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🔥', f: 'Power · cơn co', b: 'Cơn co yếu, thưa (GĐ 1–2)?\nMẹ rặn yếu (GĐ 2)?\nĐã dùng oxytocin chưa?', c: 'peach' },
          { e: '👶', f: 'Passenger · thai', b: 'Thai to (slide: > 3500 g)?\nNgôi bất thường: mặt, trán, đầu sa tay\nKiểu thế sau/ngang, đầu ngửa, lọt lệch?', c: 'pink' },
          { e: '🚪', f: 'Passage · đường sanh', b: 'Khung chậu hẹp (eo trên / giữa / dưới) hay dị dạng?\nU đường sinh dục, vùng chậu cản trở?', c: 'lav' },
          { e: '📜', f: 'Tiền sử & can thiệp', b: 'Cân con lần trước? Kết cục lần sanh trước?\nPhẫu thuật CTC · cột sống, chi dưới · GDM · THA\nĐã dùng oxytocin / prostaglandin? Đã phá ối?', c: 'mint' }]);
        host.append(note('📌 Lưu đồ BM Phụ Sản: kiểm tra tiền sử → đánh giá 3P → nhận dạng sản đồ → lý giải.', 'b'),
          note(['Slide: giai đoạn 1 phụ thuộc ', B('cơn co, độ chín muồi CTC, trọng lực thai'), '; giai đoạn 2 phụ thuộc ', B('mức tương xứng đầu – khung chậu'), '.'], 'l'));
      } }
    ] });


  /* =====================================================================
     CHƯƠNG 6 — BÊN TRÁI ĐƯỜNG BÁO ĐỘNG
  ===================================================================== */
  const ghost = (p, X) => S('polyline', { points: X.map(([x, y]) => p.px(x) + ',' + p.py(y)).join(' '), class: 'ghostline' }, p.gOver);
  CH.push({ e: '🌿', c: 'blue', part: 'C', t: 'Bên trái báo động',
    goals: ['Nhận ra 3 dạng "bên trái" hợp lệ', 'Đọc dạng điển hình — tiên lượng thuận lợi', 'Cảnh giác 2 dạng bên trái nguy hiểm'],
    keys: [['CTC bên trái báo động = bình thường?', 'CHƯA CHẮC. Chỉ dự báo thuận lợi — phải xem thêm ngôi & cơn co'],
      ['CTC đẹp nhưng ngôi đứng yên, biến dạng tăng?', 'Hội chứng vượt trở ngại ("đánh lừa thị giác")'],
      ['Đường quá dốc + co dồn dập?', 'Sanh quá nhanh → coi chừng tổn thương đường sanh']],
    steps: [
      { t: '3 dạng "bên trái"', say: 'Bấm lần lượt 3 dạng', run(host, ctx) {
        const F = { a: [[0, 4], [1, 6], [2, 8], [3, 10]], b: [[0, 4], [1, 5], [2, 6], [3, 8], [4, 10]], c: [[0, 4], [1, 5], [2, 6], [3, 7], [4, 8], [5, 9], [6, 10]] };
        const T = { a: 'Xuất phát trên đường báo động, rồi nằm HẲN bên trái.', b: 'Trùng đường báo động một đoạn, rồi rời sang trái.', c: 'Trùng HOÀN TOÀN đường báo động.' };
        const area = h('div'), tick = ctx.need(3);
        const sw = k => { const p = Partograph({ rows: nomark }); area.replaceChildren(box(p)); F[k].forEach((pt, i) => ctx.later(() => p.addX(pt[0], pt[1]), 150 + i * 320)); ctx.say(T[k]); tick(); };
        host.append(lay(area, [seg([['a', 'Hẳn bên trái'], ['b', 'Trùng rồi rời'], ['c', 'Trùng hoàn toàn']], sw), ctx.xbox(),
          note(['✔ Cả 3 đều ', B('không xâm phạm'), ' vùng bên phải → tốc độ mở ', B('≥ 1 cm/giờ'), '.'], 'm')]));
        sw('a');
      } },

      { t: 'Dạng điển hình', say: 'Xem giảng từng lần khám', run(host, ctx) {
        const p = Partograph({ rows: { oxy: false } }), C = CASE.full, fresh = () => p.gOver.replaceChildren();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: 'Lần 1 (giờ 0): CTC 4 cm, ngôi 5/5, ối còn, 3 cơn/10′.', run() { p.exam(C, 0); } },
            { t: ['Lần 2 (giờ 1): CTC 6 cm — ', B('nhanh hơn'), ' đường báo động; ngôi 4/5; ối vỡ, trong (T).'], run() { p.exam(C, 1); } },
            { t: ['Lần 3–4: CTC 7 → 9 cm, ngôi 3/5 → 1/5, cơn co mạnh dần; kiểu thế ', B('trước'), ' (CCTT) rồi ', B('xoay trong về chẩm vệ'), '.'], run(b) { p.exam(C, 2); b.later(() => p.exam(C, 3), 700); } },
            { t: 'Lần 5: mở trọn 10 cm, ngôi 0/5.', run() { p.exam(C, 4); } },
            { t: ['✅ CTC bên trái + ngôi xuống đều + co tốt → ', B('DỰ BÁO thuận lợi'), ', kết thúc bằng sanh ngả âm đạo.'], run() { fresh(); p.rowBox('ctc', 'g'); } },
            { t: ['⚠️ Dự báo ≠ kết luận: muốn ', B('kết luận bình thường'), ' phải nhìn cả diễn biến đầu thai & cơn co.'], run() { fresh(); p.rowBox('cont'); } }
          ]
        }));
      } },

      { t: 'Nguy hiểm: "đánh lừa thị giác"', say: 'Xem giảng — có câu hỏi chặn giữa bài', run(host, ctx) {
        const p = Partograph({ rows: { oxy: false } }), C = CASE.dec, fresh = () => p.gOver.replaceChildren();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: ['Chỉ nhìn đường CTC: nằm hẳn bên trái — ', B('đẹp xuất sắc'), ' 😍'], run(b) { C.X.forEach((pt, i) => b.later(() => p.addX(pt[0], pt[1]), i * 350)); } },
            { t: 'Dừng lại chút:', ask: { q: 'Kết luận chuyển dạ bình thường được chưa?', opts: ['Được rồi, CTC quá đẹp', 'Chưa — phải soi ngôi, cơn co, biến dạng'], ans: 1, no: { 0: 'Bên trái chỉ là DỰ BÁO thôi!' } } },
            { t: ['Ngôi: 5/5 → 3/5 — gần như ', B('đứng yên'), '.'], run(b) { C.O.forEach((f, i) => b.later(() => p.addO(C.X[i][0], f), i * 300)); } },
            { t: ['Biến dạng 0 → ', B('+++'), ' · cơn co 5/10′ ', B('dồn dập'), ' (tachysystole) · kiểu thế sau, lọt lệch.'], run() { C.X.forEach(([x], i) => { p.setLiquor(x, C.L[i]); p.setMould(x, C.M[i]); p.setCont(x, C.C[i][0], C.C[i][1]); }); p.rowBox('mould', 'r'); } },
            { t: ['Co đủ mạnh để ', B('MỞ CTC'), ' nhưng không đủ đưa thai ', B('VƯỢT trở ngại cơ học'), ' → hội chứng vượt trở ngại.'], run() { fresh(); p.note(4, 3, '🚧 trở ngại cơ học', 'r'); } },
            { t: ['✂️ Cần làm (lưu đồ bên trái): ', B('mổ sanh vì chuyển dạ bị tắc nghẽn cơ học'), '. "Bên trái" nhưng là ', B('cạm bẫy chết người'), '.'] }
          ]
        }));
      } },

      { t: 'Dốc đứng: sanh quá nhanh', say: 'Xem giảng so sánh với dốc vừa phải', run(host, ctx) {
        const p = Partograph({ rows: { oxy: false } }), C = CASE.fast;
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: ['Đường xám: độ dốc ', B('vừa phải'), ' (ca điển hình) để so sánh.'], run() { ghost(p, CASE.typ.X); } },
            { t: ['Ca này: chỉ 1 giờ mà CTC mở thêm ', B('4 cm'), '!'], run(b) { p.exam(C, 0); b.later(() => p.exam(C, 1), 600); } },
            { t: 'Giờ 2: mở trọn, ngôi 4/5 → 0/5 — xuống vèo.', run() { p.exam(C, 2); } },
            { t: ['Nhìn hàng cơn co: ', B('quá nhiều, quá mạnh'), ' (tachysystole).'], run() { p.rowBox('cont', 'r'); } },
            { t: ['⚠️ Cảnh giác cuộc sanh quá nhanh → ', B('tổn thương đường sanh'), '.'], run() { p.note(2, 10, '⚡ quá dốc', 'r'); } },
            { t: ['🛠️ Cần làm (lưu đồ bên trái): ', B('xử lí tachysystole'), ' (cơn co cường tính = > 5 cơn/10 phút), lưu ý biến chứng.'] },
            { t: ['📝 File ôn (ca 3.2, thai 33 tuần): sanh quá nhanh còn có nguy cơ ', B('đờ tử cung → băng huyết sau sanh'), '. Nhớ cả 2 nhóm biến chứng.'] }
          ]
        }));
      } },

      { t: 'Chọn sản đồ thuận lợi', say: 'So 3 sản đồ rồi chọn', gate: true, run(host, ctx) {
        const cs = [[CASE.typ, 'Ngôi 5/5 → 0/5 đều'], [CASE.dec, 'Ngôi 5/5 → 3/5'], [CASE.fast, 'Ngôi 4/5 → 0/5 trong 2 giờ']];
        host.append(h('div', { class: 'mini3' }, cs.map(([c, t], i) => { const p = Partograph({ rows: nomark, cw: 30 }); plotNow(p, c); return h('div', { class: 'stack' }, h('b', { class: 'big' }, 'ABC'[i]), box(p, { legend: false }), h('div', { class: 'cap' }, t)); })));
        Q(ctx, host, { q: 'Sản đồ nào có tiên lượng THUẬN LỢI?', opts: ['A', 'B', 'C'], ans: 0,
          why: 'Chỉ A: CTC bên trái + ngôi xuống đều. B = trở ngại cơ học bị che bởi đường CTC đẹp. C = quá dốc → nguy cơ tổn thương đường sinh.',
          wrong: { 1: 'B: CTC đẹp nhưng ngôi xuống chậm — coi chừng trở ngại cơ học!', 2: 'C: quá dốc → sanh quá nhanh, không hẳn thuận lợi.' } });
      } }
    ] });
})();
