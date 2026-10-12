/* lessons-c.js — PHẦN D (ch.7 Bên phải báo động, ch.8 Chạm đường hành động) + PHẦN E (ch.9 Ôn thi) */
(function () {
  const nomark = { liquor: false, cont: false, oxy: false };
  const B = t => h('b', {}, t);
  /* chú thích tạm trong cảnh: tmp(e) ghi nhớ, clr() xoá hết */
  const temp = () => { const a = []; const f = e => (a.push(e), e); f.clr = () => a.splice(0).forEach(e => e && e.remove()); f.reset = () => { a.length = 0; }; return f; };

  /* =====================================================================
     CHƯƠNG 7 — BÊN PHẢI ĐƯỜNG BÁO ĐỘNG
  ===================================================================== */
  const WEAK = { X: [[0, 4], [2, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10]], O: [5, 5, 4, 3, 2, 1, 0], L: ['T', 'T', 'T', 'T', 'T', 'T', 'T'], M: ['0', '0', '0', '0', '0', '0', '0'], C: [[2, 1], [2, 1], [2, 1], [4, 2], [4, 2], [4, 2], [4, 2]] };
  const BAG = { X: [[0, 4], [2, 5], [4, 6], [6, 7], [7, 8], [8, 9], [9, 10]], O: [5, 5, 5, 5, 4, 2, 0], L: ['C', 'C', 'C', 'T', 'T', 'T', 'T'], M: ['0', '0', '0', '0', '0', '0', '0'], C: [[3, 1], [3, 1], [3, 1], [3, 1], [4, 2], [4, 2], [4, 2]] };
  const OK = { X: [[0, 4], [2, 5], [4, 6], [5, 7], [6, 8], [7, 9]], O: [5, 5, 5, 4, 3, 2], L: ['C', 'C', 'T', 'T', 'T', 'T'], M: ['0', '0', '0', '0', '+', '+'], C: [[3, 1], [3, 1], [3, 1], [4, 2], [4, 2], [4, 2]] };
  const BAD = { X: [[0, 4], [2, 5], [4, 6], [6, 6.4], [8, 6.9]], O: [5, 5, 5, 5, 5], L: ['C', 'C', 'T', 'T', 'T'], M: ['0', '0', '0', '+', '++'], C: [[3, 1], [3, 1], [3, 1], [4, 2], [5, 2]] };
  const run = (p, b, c, from, to, gap) => { for (let i = from; i <= to; i++) b.later(() => p.exam(c, i), (i - from) * (gap || 550)); };
  // ca file ôn (chị Uyên): Bà C — chuyển phải, phá ối rồi tăng co, thành công
  const BC = { X: [[0, 4], [2, 5], [4, 6], [5, 7], [6, 8]], O: [4, 3, 3, 2, 1], Pos: ['CCTT', null, null, null, 'CCTT'], L: ['C', 'C', 'T', 'T', 'T'], M: ['0', '0', '0', '0', '0'], C: [[2, 1], [2, 1], [2, 1], [4, 2], [4, 2]] };
  // ca file ôn: Bà S / Bà L — vượt đường hành động, CCPS, chồng xương tăng, ối xanh
  const BS = { X: [[0, 4], [2, 5], [4, 6], [6, 7], [8, 8], [10, 9], [11, 10]], O: [4, 3, 3, 3, 2, 2, 1], Pos: [null, null, 'CCPS', null, 'CCPS', null, 'CCPS'],
    L: ['C', 'T', 'T', 'K', 'K', 'X', 'X'], M: ['0', '0', '+', '++', '++', '+++', '+++'], C: [[3, 1], [3, 1], [4, 2], [4, 2], [5, 2], [5, 2], [5, 2]] };

  CH.push({ e: '💜', c: 'lav', part: 'D', t: 'Bên phải báo động',
    goals: ['Truy ra nguyên nhân khi sản đồ chuyển phải', 'Nhớ thứ tự: phá ối TRƯỚC – tăng co SAU', 'Đánh giá lại sau mỗi can thiệp'],
    keys: [['Ối VỠ + co yếu + không biến dạng?', 'Cơn co không đủ → chỉnh cơn co (oxytocin, tuyến huyện trở lên)'],
      ['Ối CÒN + sản đồ chuyển phải?', 'Phá ối trước (nếu lợi ích > nguy cơ); chưa đủ mới tăng co'],
      ['Can thiệp rồi mà vẫn chậm?', 'Tìm nguyên nhân thực thể bị bỏ sót — thường là trở ngại cơ học']],
    steps: [
      { t: '3 nghi phạm', say: 'Lật 3 thẻ — 3 nguyên nhân hay gặp khi sản đồ lệch phải', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🔥', f: 'Cơn co không đủ', b: 'CTC & ngôi chậm\nco thưa yếu · ối ĐÃ vỡ\nđầu không biến dạng', c: 'peach' },
          { e: '💧', f: 'Đầu ối cản trở', b: 'ối CÒN · đầu không biến dạng\nco có thể tốt hoặc chưa', c: 'blue' },
          { e: '🧱', f: 'Trở ngại cơ học', b: 'co RẤT tốt · ối đã vỡ\nmà ngôi vẫn không xuống', c: 'coral' }]);
        host.append(note(['⚠️ Lệch phải ', B('KHÔNG đồng nghĩa'), ' bất xứng đầu chậu. Luôn xem tiền sử, 3P và các can thiệp đã làm.'], 'p'));
      } },

      { t: 'Đầu ối: trợ thủ hay "kỳ đà"?', say: 'Đổi vị trí đầu thai — xem đầu ối giúp hay cản', run(host, ctx) {
        const a = art.uterus({ bag: true }), tick = ctx.need(2);
        const sw = (_, i) => { a.setBag(i); tick();
          ctx.say(h('div', {}, i ? ['🚧 Đầu đã áp CTC → ', B('chính đầu thai'), ' nong hiệu quả hơn. Đầu ối giờ có thể làm ', B('chậm'), ' mở CTC → cân nhắc phá ối.'] : ['💧 Đầu còn cao, chưa áp CTC → ', B('đầu ối'), ' là phương tiện nong CTC.'])); };
        host.append(lay(h('div', { class: 'frame' }, a.el), [seg([[0, '⬆️ Đầu còn cao'], [1, '⬇️ Đầu đã xuống']], sw), ctx.xbox()]));
        sw(0, 0);
      } },

      { t: 'Thám tử: ai là thủ phạm?', say: 'Bật/tắt 3 manh mối — xem nghi phạm nào sáng đèn (thử đủ 3)', run(host, ctx) {
        const st = { o: 0, c: 0, m: 0 }, seen = new Set();
        const sus = [['🔥', 'Cơn co yếu'], ['💧', 'Đầu ối'], ['🧱', 'Trở ngại cơ học']].map(([e, t]) => h('div', { class: 'sus' }, h('div', { class: 'em' }, e), h('b', {}, t)));
        const rule = () => {
          if (st.m) return [[2], ['Biến dạng tăng → nghi ', B('trở ngại cơ học'), ': đánh giá lại MỌI yếu tố (3P).']];
          if (st.o) return st.c ? [[1], ['Co đã tốt mà ối còn → ', B('đầu ối'), ' là vật cản: phá ối (nếu lợi > nguy cơ).']] : [[0, 1], ['Cơn co hay đầu ối? → ', B('Phá ối trước'), ' (đầu áp CTC sẽ kích thích co); vẫn chậm mới tăng co.']];
          return st.c ? [[2], ['Co tốt + ối vỡ mà vẫn chậm → nghi ', B('trở ngại cơ học'), '.']] : [[0], ['Ối vỡ + co yếu + không biến dạng → ', B('cơn co không đủ'), ': chỉnh bằng oxytocin (tuyến huyện trở lên).']];
        };
        const upd = () => { const [on, t] = rule(); sus.forEach((s, i) => s.classList.toggle('on', on.includes(i))); on.forEach(i => seen.add(i)); ctx.say(h('div', {}, '👉 ', t)); if (seen.size === 3) ctx.done(); };
        const tg = (label, k, a, b) => h('div', { class: 'tog' }, h('b', {}, label), seg([[0, a], [1, b]], v => { st[k] = v; upd(); }));
        host.append(note('Bối cảnh: sản đồ đang nằm giữa đường báo động và đường hành động.', 'l'),
          lay([h('div', { class: 'suspects' }, sus), ctx.xbox()], h('div', { class: 'ctl' }, h('div', { class: 'cap' }, 'Manh mối'), tg('💧 Ối', 'o', 'Đã vỡ', 'Còn'), tg('💪 Cơn co', 'c', 'Chưa đủ', 'Rất tốt'), tg('🤕 Đầu thai', 'm', 'Không biến dạng', 'Biến dạng tăng'))));
        upd();
      } },

      { t: 'Xử trí: sắp đúng thứ tự', say: 'Chạm 4 bước theo đúng thứ tự xử trí', run(host, ctx) {
        const T = ['🔎 Xem tiền sử & soi 3P', '💧 Phá ối (nếu lợi ích > nguy cơ)', '💉 Tăng co oxytocin (nếu điều kiện cho phép)', '📈 Đánh giá lại: CTC & ngôi'];
        let nxt = 0;
        const tiles = [2, 0, 3, 1].map(i => { const t = h('button', { class: 'tile ostep', onclick() {
          if (t.disabled) return;
          if (i === nxt) {
            t.disabled = true; t.prepend(h('span', { class: 'n' }, nxt + 1)); t.style.background = 'var(--mint)'; nxt++; ctx.ok();
            if (nxt === 4) { host.append(stamp('Phá ối TRƯỚC — tăng co SAU', 'ok')); ctx.say(h('div', {}, 'Trên nguyên tắc: ', B('không được tăng co'), ' khi chưa thử điều chỉnh cơn co bằng phá ối. Tăng co thực hiện ở ', B('tuyến huyện trở lên'), '.')); ctx.done(); }
          } else { t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake'); ctx.oops(i === 2 && nxt === 1 ? 'Chưa được tăng co khi chưa thử phá ối!' : 'Chưa tới lượt bước này.'); }
        } }, T[i]); return t; });
        host.append(note(['Ca: sản đồ ', B('lệch phải'), ' · ối ', B('CÒN'), ' · 3 cơn/10′ · đầu không biến dạng.'], 'l'), h('div', { class: 'order' }, tiles), ctx.xbox());
      } },

      { t: 'Ca 1: cơn co không đủ', say: 'Xem giảng — trả lời 2 câu hỏi để đi tiếp', run(host, ctx) {
        const p = Partograph(), T = temp();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); T.reset(); },
          beats: [
            { t: 'Lần 1–3: CTC 4 → 5 → 6 cm trong 4 giờ.', run(b) { run(p, b, WEAK, 0, 2); } },
            { t: ['Đường CTC rời đường báo động sang ', B('phải'), ' → chậm hơn 1 cm/giờ.'], run() { p.band(0, 4, 'r', 'chuyển phải'); } },
            { t: ['Manh mối: ', B('2 cơn/10′'), ' · ối ', B('ĐÃ vỡ'), ' (T) · đầu ', B('không biến dạng'), ' · ngôi xuống chậm.'], run() { T(p.rowBox('cont', 'r')); T(p.rowBox('liq')); T(p.rowBox('mould')); } },
            { t: 'Câu hỏi 1:', ask: { q: 'Nguyên nhân chuyển phải?', opts: ['Cơn co không đủ', 'Đầu ối', 'Trở ngại cơ học'], ans: 0, no: { 1: 'Ối đã vỡ rồi mà!', 2: 'Chưa biến dạng, co còn yếu — chưa nghĩ cơ học.' } } },
            { t: 'Câu hỏi 2:', ask: { q: 'Xử trí?', opts: ['Phá ối', 'Chỉnh cơn co bằng oxytocin', 'Mổ sanh ngay'], ans: 1, no: { 0: 'Ối vỡ rồi, còn gì để phá!', 2: 'Chưa có bằng chứng trở ngại cơ học.' } } },
            { t: ['💉 Bắt đầu oxytocin lúc giờ 4 — ghi ', B('đúng thời điểm'), ' trên hàng oxytocin.'], run() { T.clr(); p.setOxy(4, '▶', ''); p.oxySpan(4, 8); p.flag(4, '💉 oxytocin'); } },
            { t: ['Sau chỉnh co: CTC ', B('song song đường báo động'), ', ngôi lọt & xuống → can thiệp ', B('THÀNH CÔNG'), '.'], ms: 4500, run(b) { run(p, b, WEAK, 3, 6); b.later(() => p.band(4, 8, 'b', 'sau oxytocin'), 2300); } }
          ]
        }));
      } },

      { t: 'Ca 2: đầu ối cản trở', say: 'Xem giảng — trả lời câu hỏi để đi tiếp', run(host, ctx) {
        const p = Partograph(), T = temp();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); T.reset(); },
          beats: [
            { t: 'Lần 1–3: CTC 4 → 6 cm trong 4 giờ — lệch phải.', run(b) { run(p, b, BAG, 0, 2); b.later(() => p.band(0, 4, 'r', 'chuyển phải'), 1200); } },
            { t: ['Manh mối: ', B('3 cơn/10′'), ' · ối ', B('CÒN'), ' (C) · đầu ', B('không biến dạng'), '.'], run() { T(p.rowBox('liq', 'r')); T(p.rowBox('cont')); } },
            { t: 'Câu hỏi 1:', ask: { q: 'Hành động ĐẦU TIÊN?', opts: ['Tăng co oxytocin ngay', 'Phá ối (nếu lợi ích > nguy cơ)', 'Mổ sanh'], ans: 1, no: { 0: 'Nguyên tắc: chưa thử phá ối thì chưa tăng co!', 2: 'Chưa có bằng chứng trở ngại cơ học.' } } },
            { t: ['💧 Phá ối lúc giờ 4 — khi đầu đã xuống, đầu ối có thể là ', B('vật cản'), '.'], run() { T.clr(); p.flag(4.5, '💧 phá ối'); } },
            { t: ['Giờ 6: CTC 7 cm, ngôi vẫn 5/5, không biến dạng → ', B('vẫn chậm'), '.'], run() { p.exam(BAG, 3); } },
            { t: 'Câu hỏi 2:', ask: { q: 'Giờ làm gì?', opts: ['Tăng co oxytocin', 'Phá ối thêm lần nữa', 'Chờ thêm 4 giờ'], ans: 0, no: { 1: 'Ối đã phá rồi.', 2: 'Chờ nữa là chạm đường hành động!' } } },
            { t: ['💉 Oxytocin → CTC ', B('song song báo động'), ', ngôi xuống 0/5 → thành công.'], ms: 4500, run(b) { p.setOxy(6, '▶', ''); p.oxySpan(6, 9); run(p, b, BAG, 4, 6); b.later(() => p.band(6, 9, 'b', 'sau oxytocin'), 1800); } }
          ]
        }));
      } },

      { t: 'Đánh giá lại: thành công hay thất bại?', say: 'Xem giảng 2 kịch bản sau can thiệp', run(host, ctx) {
        const p = Partograph();
        const base = (b, c) => { const f = p.fast; p.fast = true; for (let i = 0; i < 3; i++) p.exam(c, i); p.setOxy(4, '▶', ''); p.fast = f; };
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: ['Đã can thiệp lúc giờ 4 (phá ối + oxytocin). Giờ phải ', B('ĐÁNH GIÁ LẠI'), ' bằng cả CTC lẫn ngôi.'], run(b) { base(b, OK); p.flag(4, '⚙️ can thiệp'); } },
            { t: ['✅ Kịch bản 1: CTC mở lại ', B('≥ 1 cm/giờ'), ' (song song báo động); ngôi ', B('lọt – xuống – xoay'), '.'], run(b) { p.oxySpan(4, 7); run(p, b, OK, 3, 5); b.later(() => p.band(4, 7, 'b', '✅ thành công'), 1200); } },
            { t: ['❌ Kịch bản 2: CTC vẫn chậm, ngôi vẫn ', B('đi ngang'), ' dù co tốt + ối vỡ; biến dạng tăng.'], run(b) { p.clear(); base(b, BAD); p.flag(4, '⚙️ can thiệp'); p.oxySpan(4, 8); run(p, b, BAD, 3, 4, 700); b.later(() => p.band(4, 8, 'r', '❌ thất bại'), 1300); } },
            { t: ['→ Thất bại = có ', B('nguyên nhân thực thể bị bỏ sót'), '. Hay gặp nhất: trở ngại cơ học (bất xứng đầu chậu, kiểu thế không thuận lợi…).'] },
            { t: 'Kiểm tra:', ask: { q: 'Chuyển phải + co RẤT tốt + ối vỡ + ngôi không xuống gợi ý gì?', opts: ['Cơn co không đủ', 'Đầu ối', 'Trở ngại cơ học'], ans: 2, no: { 0: 'Co đã rất tốt rồi.', 1: 'Ối đã vỡ.' } } },
            { t: ['Đúng! Phải đi tìm ', B('trở ngại cơ học'), ' ngay — trước khi sản đồ chạm đường hành động.'] }
          ]
        }));
      } },

      { t: 'Ca OSCE: Bà C — phá ối rồi tăng co', say: 'Ca trong file ôn (ca 2.1 / 2.3) — trả lời các câu chặn giữa bài', run(host, ctx) {
        const p = Partograph();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); },
          beats: [
            { t: 'Bà C., 26 tuổi, con so, thai 39 tuần, nguy cơ thấp, ước 3000 g, khung chậu bình thường, kiểu thế CCTT.', run() { p.exam(BC, 0); } },
            { t: ['Giờ 2: CTC 5 cm, ngôi 3/5, ối ', B('còn'), ', 2 cơn/10′ (20–40 giây) → ', B('lệch phải'), '.'], run() { p.exam(BC, 1); p.band(0, 2, 'r', 'chuyển phải'); } },
            { t: 'Câu 1a:', ask: { q: 'Quyết định PHÁ ỐI lúc này?', opts: ['Hợp lý', 'Không hợp lý'], ans: 0, no: { 1: 'Ối còn + chuyển phải → phá ối là hành động ưu tiên.' } } },
            { t: ['💧 Phá ối: nước ối trắng đục. Giờ 4: CTC 6 cm, ngôi ', B('vẫn 3/5'), ', co vẫn 2 cơn/10′ → vẫn chậm.'], run() { p.flag(2.5, '💧 phá ối'); p.exam(BC, 2); } },
            { t: 'Câu 1b:', ask: { q: 'Quyết định TĂNG CO lúc này?', opts: ['Hợp lý — đã thử phá ối mà co vẫn thưa', 'Không hợp lý — phải chờ thêm'], ans: 0, no: { 1: 'Đã phá ối mà co vẫn thưa, CTC vẫn chậm → tới lượt tăng co.' } } },
            { t: ['💉 Tăng co: 4 cơn/10′, > 40 giây. CTC mở ', B('1 cm/giờ'), ' (song song báo động), ngôi 3/5 → 1/5.'], run(b) { p.setOxy(4, '▶', ''); p.oxySpan(4, 6); run(p, b, BC, 3, 4); } },
            { t: 'Câu 2:', ask: { q: 'Đánh giá hiệu quả của phá ối + tăng co?', opts: ['Mang lại hiệu quả mong muốn', 'Không mang lại hiệu quả', 'Gây thêm bất thường không mong muốn'], ans: 0 } },
            { t: ['📝 Đáp án file ôn: phá ối ', B('hợp lý'), ' · tăng co ', B('hợp lý'), ' · ', B('có hiệu quả'), '. (Phần đọc CTG của ca này thuộc bài CTG.)'] }
          ]
        }));
      } },

      { t: 'Thử sức: hành động đầu tiên', say: 'Đọc sản đồ rồi chọn', gate: true, run(host, ctx) {
        const p = Partograph({ rows: { oxy: false } }); plotNow(p, CASE.bag);
        host.append(box(p));
        Q(ctx, host, { q: 'Lệch phải · ối CÒN · 3 cơn/10 phút · ngôi không biến dạng. Hành động ĐẦU TIÊN?', opts: ['Tăng co oxytocin ngay', 'Phá ối (nếu lợi ích > nguy cơ)', 'Mổ sanh', 'Nằm chờ thêm 4 giờ'], ans: 1,
          why: 'Ối còn → thử phá ối trước. Chưa được tăng co khi chưa thử điều chỉnh bằng phá ối.',
          wrong: { 0: 'Chưa được tăng co khi chưa thử phá ối!', 2: 'Chưa có bằng chứng trở ngại cơ học.', 3: 'Chờ nữa là chạm đường hành động rồi!' } });
      } }
    ] });

  /* =====================================================================
     CHƯƠNG 8 — CHẠM / CẮT ĐƯỜNG HÀNH ĐỘNG
  ===================================================================== */
  CH.push({ e: '🔥', c: 'coral', part: 'D', t: 'Chạm đường hành động',
    goals: ['Hiểu "chạm đường hành động" nghĩa là gì', 'Soi lại đủ 6 yếu tố của chuyển dạ', 'Nhận ra dấu hiệu bất xứng đầu chậu — không trì hoãn'],
    keys: [['Chạm hành động = chấm dứt chuyển dạ?', 'Không — nhưng buộc đánh giá lại NGAY và quyết định dứt khoát'],
      ['6 yếu tố phải soi lại?', 'Khung chậu · cân thai · kiểu thế · biến dạng đầu · cơn co · cổ tử cung'],
      ['Dấu hiệu gợi ý bất xứng đầu chậu?', 'Bướu huyết thanh · chồng xương · sờ thấy cả 2 thóp'],
      ['Dấu hiệu dọa vỡ tử cung?', 'Vòng Bandl · dấu Frommel — trên nền hội chứng vượt trở ngại (co cường tính, CTC phù nề, thai trình ngưng)']],
    steps: [
      { t: 'Chạm hành động!', say: 'Xem giảng ca này — có câu hỏi chặn giữa bài', run(host, ctx) {
        const p = Partograph(), C = CASE.stuck, T = temp();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); T.reset(); },
          beats: [
            { t: ['Lần 1–3: lệch phải; ối ', B('vỡ'), ' (T); co 4–5 cơn/10′ — ', B('rất tốt'), '.'], run(b) { run(p, b, C, 0, 2); } },
            { t: ['Nhưng ngôi ', B('đứng yên 5/5'), ', biến dạng + → ++.'], run() { T(p.rowBox('mould', 'r')); T(p.ring(4, 5, 'b')); } },
            { t: ['Giờ 6: CTC ', B('chạm đường hành động'), '.'], run() { T.clr(); p.exam(C, 3); p.flag(6, '⚠️ chạm hành động'); } },
            { t: 'Câu hỏi:', ask: { q: 'Co tốt + ối vỡ + ngôi không xuống + biến dạng tăng → nghĩ gì?', opts: ['Cơn co yếu → tăng co thêm', 'Trở ngại cơ học', 'Đầu ối cản trở'], ans: 1, no: { 0: 'Co đã RẤT tốt — tăng co lúc này là nguy hiểm!', 2: 'Ối đã vỡ.' } } },
            { t: ['Chậm quyết định → giờ 8 ', B('cắt qua'), ' đường hành động, biến dạng +++.'], run() { p.exam(C, 4); } },
            { t: ['→ Hội chứng vượt trở ngại, ', B('dọa vỡ tử cung'), '. KHÔNG được trì hoãn đánh giá!'], run() { p.note(6.5, 7.6, '💥 dọa vỡ tử cung', 'r'); } }
          ]
        }));
      } },

      { t: 'Soi lại 6 yếu tố', say: 'Chạm hành động = đánh giá lại TẤT CẢ. Lật đủ 6 thẻ', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🦴', f: 'Khung chậu', b: 'Khám lâm sàng: có hẹp không?', c: 'lav' }, { e: '⚖️', f: 'Cân thai', b: 'Ước lượng: thai to không?', c: 'peach' },
          { e: '🧭', f: 'Kiểu thế', b: 'Có thuận lợi không?\n(kiểu thế sau, lọt lệch?)', c: 'blue' }, { e: '🤕', f: 'Biến dạng đầu', b: 'Chồng xương tới độ mấy?', c: 'pink' },
          { e: '💪', f: 'Cơn co', b: 'Đủ chưa? Hay dồn dập quá?', c: 'yellow' }, { e: '🌸', f: 'Cổ tử cung', b: 'Mở chậm? Tình trạng CTC?', c: 'mint' }]);
        host.append(note(['📌 Sản đồ chạm/cắt đường hành động = những nỗ lực điều chỉnh ', B('đã thất bại'), ' — nguyên nhân thường là trở ngại cơ học.'], 'p'));
      } },

      { t: 'Lâm sàng: vượt trở ngại → dọa vỡ → vỡ tử cung', say: 'Lật 3 thẻ theo thứ tự nặng dần', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🚧', f: '1. Hội chứng vượt trở ngại', b: 'Cơn co tăng rất nhiều (cường tính)\nCTC phù nề · thai trình ngưng tiến\nUốn khuôn (chồng xương) · bướu huyết thanh', c: 'yellow' },
          { e: '⚠️', f: '2. Dọa vỡ tử cung', b: 'Vòng Bandl\nDấu Frommel\nĐoạn dưới kéo dài, căng', c: 'peach' },
          { e: '💥', f: '3. Vỡ tử cung', b: 'Đột ngột mất tim thai · mất cơn gò\nRa huyết âm đạo đỏ tươi · tiểu máu\nSốc', c: 'coral' }]);
        host.append(note(['🔎 Tìm nguyên nhân bất xứng đầu chậu — ', B('mẹ'), ': khung chậu hẹp, đường sanh hẹp? · ', B('con'), ': thai to, dị tật đầu, đầu cúi không tốt? Rồi xét các yếu tố khác trong 3P (cơn co, sức rặn).'], 'b'),
          note('Nguồn: file giải đề OSCE "chuyển dạ – CTG – sản đồ".', 'l'));
      } },

      { t: 'Dấu hiệu gợi ý bất xứng đầu chậu', say: '🎯 Thi hay ra! Lật 3 thẻ rồi chọn đáp án', gate: true, run(host, ctx) {
        tapCards(host, ctx, [
          { e: '🎈', f: 'Bướu huyết thanh', b: 'Sưng phù da đầu ở phần ngôi do bị ép lâu', c: 'pink' },
          { e: '🤕', f: 'Chồng xương', b: 'Xương sọ chồng lên nhau (++ / +++)', c: 'lav' },
          { e: '🧭', f: 'Sờ thấy cả 2 thóp', b: 'Thóp trước + thóp sau cùng sờ được → đầu chưa cúi tốt', c: 'blue' }], 99);
        Q(ctx, host, { q: 'Dấu hiệu nào gợi ý bất xứng đầu chậu (chuyển dạ tắc nghẽn)?', opts: ['Bướu huyết thanh', 'Chồng xương sọ', 'Sờ thấy cả thóp trước và thóp sau', 'Cả 3 dấu hiệu trên'], ans: 3,
          why: 'Cả 3 đều cho thấy đầu bị ép / không vượt được trở ngại. Câu này lặp lại nhiều lần trong ngân hàng đề cuối kỳ.', wrong: { 0: 'Đúng nhưng chưa đủ!', 1: 'Đúng nhưng chưa đủ!', 2: 'Đúng nhưng chưa đủ!' } });
      } },

      { t: 'Trì hoãn là nguy hiểm', say: 'Kéo thanh "trì hoãn" từ trái sang phải', run(host, ctx) {
        const S4 = [['⏰', 'Vừa chạm hành động → đánh giá NGAY'], ['🤕', 'Biến dạng tăng, ngôi vẫn không lọt'], ['🚧', 'Hội chứng vượt trở ngại: co cường tính, CTC phù nề, bướu huyết thanh'], ['💥', 'Dọa vỡ tử cung: vòng Bandl, dấu Frommel']];
        const tiles = S4.map(([e, t]) => h('div', { class: 'tile' }, h('span', { class: 'em' }, e), t));
        const sl = slider({ min: 0, max: 3, value: 0, label: 'Trì hoãn', fmt: v => ['0', '+', '++', '+++'][v], on(v) {
          tiles.forEach((t, i) => { t.style.opacity = i <= v ? 1 : .3; t.style.background = i <= v && i >= 2 ? 'var(--coral)' : ''; });
          ctx.say(h('div', {}, v >= 2 ? ['☠️ Có trở ngại cơ học mà cứ tăng co → rủi ro ', B('vỡ tử cung'), '. Quyết định quản lý theo bối cảnh (thường là mổ sanh vì tắc nghẽn cơ học).'] : ['Chậm trễ ra quyết định là lý do sản đồ ', B('vượt khỏi'), ' đường hành động.']));
          if (v === 3) ctx.done();
        } });
        host.append(lay(h('div', { class: 'stack' }, tiles), [h('div', { class: 'ctl' }, sl), ctx.xbox()]));
        sl.init();
      } },

      { t: 'Xử trí theo vùng & theo tuyến', say: 'Chọn từng tình huống để xem hướng xử trí', run(host, ctx) {
        const D = {
          n: ['🟢 Chuyển dạ bình thường', ['Không dùng oxytocin hay can thiệp nào.', 'Không tia ối trong pha tiềm thời; tia ối (nếu cần) trong pha hoạt động.']],
          l: ['🌙 Tiềm thời kéo dài', ['Đánh giá lại toàn bộ vấn đề sản khoa.', 'Bất thường thai (suy thai) hay biến chứng cần chấm dứt thai kỳ → mổ lấy thai.', 'Có chuyển dạ thực sự (cơn co, CTC thuận lợi) → bấm ối + oxytocin.', 'Chưa chuyển dạ thực sự → không can thiệp.']],
          m: ['🟡 Giữa 2 đường', ['Trạm / TTYT: chuyển tuyến, trừ khi CTC gần trọn (có thể bấm ối, theo dõi thêm thời gian ngắn).', 'Bệnh viện: bấm ối, theo dõi tiếp như thường quy.', 'Tăng co chỉ làm ở tuyến huyện trở lên (handout).']],
          a: ['🔴 Chạm / vượt đường hành động', ['Phải theo dõi tại bệnh viện; đánh giá lại toàn bộ vấn đề sản khoa.', 'Tăng co nếu cơn co chưa đủ.', 'Mổ lấy thai khi chuyển dạ tắc nghẽn hoặc suy thai.', 'Khám lại mỗi 2–3 giờ: CTC mở < 1 cm giữa 2 lần khám → mổ lấy thai.']]
        };
        const tree = h('div', { class: 'tree' }), tick = ctx.need(4), seen = new Set();
        const show = k => {
          const [t, items] = D[k];
          tree.replaceChildren(h('div', { class: 'node', style: { background: 'var(--yellow)' } }, t), h('div', { class: 'kids' }, items.map((s, i) => h('div', { class: 'node pop', style: { 'animation-delay': (i * .1) + 's' } }, '→ ', s))));
          if (!seen.has(k)) { seen.add(k); tick(); }
        };
        host.append(seg([['n', '🟢 Bình thường'], ['l', '🌙 Tiềm thời kéo dài'], ['m', '🟡 Giữa 2 đường'], ['a', '🔴 Chạm hành động']], show), tree,
          note(['Nguồn: slide "Chuyển dạ bất thường & Partograph" (theo WHO). Với ca cụ thể, luôn ', B('lý giải nguyên nhân'), ' theo handout trước khi chọn can thiệp (vd ối đã vỡ thì không còn bấm ối).'], 'l'));
        show('n');
      } },

      { t: 'Ca OSCE: Bà S — giai đoạn II', say: 'Ca trong file ôn (ca 4.2) — trả lời 3 câu chặn giữa bài', run(host, ctx) {
        const p = Partograph(), T = temp();
        host.append(scene(ctx, {
          vis: box(p), p, reset() { p.clear(); T.reset(); },
          beats: [
            { t: 'Bà S., 30 tuổi, con so, 40 tuần, nguy cơ thấp, đã gây tê ngoài màng cứng, khung chậu bình thường trên lâm sàng.', run(b) { run(p, b, BS, 0, 2); } },
            { t: ['CTC mở chậm dần, đường CTC ', B('chạm rồi vượt'), ' đường hành động trước khi mở trọn; ngôi CCPS gần như đứng yên.'], ms: 4800, run(b) { run(p, b, BS, 3, 6, 500); b.later(() => p.band(8, 11, 'r', 'vượt hành động'), 1900); } },
            { t: ['Hiện tại: CTC ', B('trọn'), ' · ngôi đã lọt, ', B('CCPS, bất đối xứng, +1'), ' · chồng xương ', B('+++'), ' · ối ', B('xanh'), ' (X) · co ', B('6 cơn/10′'), '.'], run() { T(p.rowBox('mould', 'r')); T(p.rowBox('liq', 'r')); T(p.rowBox('cont', 'r')); } },
            { t: 'Câu 1:', ask: { q: 'Kết luận về chuyển dạ của bà S?', opts: ['Chuyển dạ kéo dài', 'Chuyển dạ ngưng tiến triển', 'Chuyển dạ bất xứng đầu chậu', 'Chuyển dạ có dấu hiệu dọa vỡ tử cung'], ans: 3, no: { 0: 'Nặng hơn thế — nhìn cơn co và chồng xương.', 2: 'BXĐC là nguyên nhân; hiện đã có dấu hiệu nặng hơn.' } } },
            { t: 'Câu 2:', ask: { q: 'Bạn sẽ hành động sao?', opts: ['Chờ đầu xuống thêm', 'Cho rặn sanh ngay', 'Giúp sanh ngay', 'Mổ sanh ngay'], ans: 3, no: { 2: 'Lọt bất đối xứng, chồng xương +++ → không giúp sanh.', 0: 'Không được trì hoãn!' } } },
            { t: 'Câu 3:', ask: { q: 'Gây tê ngoài màng cứng có liên quan biểu hiện trên sản đồ?', opts: ['Không liên quan', 'Có — làm CTC mở chậm', 'Có — làm ngôi ngưng xoay ở CCPS', 'Có — làm yếu cơn co'], ans: 0, no: { 3: 'Cơn co đang 6 cơn/10′ — đâu có yếu!' } } },
            { t: ['📝 Đáp án file ôn: giai đoạn II có ', B('dấu hiệu vượt trở ngại'), ' → ', B('dọa vỡ tử cung'), ' do bất xứng đầu chậu (kèm suy thai) → ', B('mổ sanh ngay'), '. Gây tê không liên quan.'], run() { T.clr(); } }
          ]
        }));
      } },

      { t: 'Chạm hành động nghĩa là gì?', say: 'Chọn ý đúng nhất', gate: true, run(host, ctx) {
        Q(ctx, host, { q: 'Sản đồ chạm / cắt đường hành động nghĩa là…', opts: [
          'Phải chấm dứt chuyển dạ ngay lập tức', 'Hết thời hạn chỉnh: đánh giá lại mọi yếu tố & quyết định dứt khoát (không đồng nghĩa chấm dứt chuyển dạ)', 'Cứ tăng liều oxytocin', 'Chờ thêm 4 giờ rồi tính'], ans: 1,
        why: 'Chạm hành động = những nỗ lực điều chỉnh đã thất bại, thường do trở ngại cơ học. Đánh giá ngay, không trì hoãn; quyết định tuỳ bối cảnh.', wrong: { 2: 'Có trở ngại cơ học mà tăng co là nguy hiểm.', 3: 'Không được trì hoãn đánh giá!' } });
      } }
    ] });

  /* =====================================================================
     CHƯƠNG 9 — ÔN THI OSCE (Phần E)
  ===================================================================== */
  const add = (c, x) => Object.assign({}, c, x);
  const cut = (c, n) => { const o = {}; for (const k in c) o[k] = c[k].slice(0, n); return o; };

  /* ---------- TRẠM OSCE: bệnh sử + sản đồ + câu liên hoàn, giải thích TỪNG đáp án ---------- */
  const STATIONS = [
    { title: 'Bắt đầu vẽ & tịnh tiến', src: 'Handout Hình 9–12', cfg: { mode: 'orig', rows: { oxy: false } }, c: { X: [[0, 4]], O: [5], L: ['T'], M: ['0'], C: [[2, 2]] },
      who: 'Sản phụ 27 tuổi, PARA 0000, thai 39 tuần, nhập viện lúc 5:20 vì chuyển dạ.',
      story: ['Ối vỡ trước nhập viện, nước ối trắng đục.', 'Khám lúc nhập phòng sanh: CTC 4 cm, ngôi chỏm 5/5, đầu không biến dạng; 2 cơn/10 phút, mỗi cơn 50 giây; không dùng oxytocin.'],
      now: 'Bạn dùng sản đồ BẢN GỐC (có pha tiềm thời). Lần khám đầu đã ghi ở hoành độ 0.',
      qs: [
        { q: 'Sau khi ghi xong hoành độ 0, bước tiếp theo là gì?', o: ['Không làm gì, khám lại sau 4 giờ', 'Tịnh tiến TOÀN BỘ dữ kiện lên đường báo động vì CTC ≥ 3 cm', 'Chỉ tịnh tiến dấu ✕, các dữ kiện khác giữ nguyên'], a: 1,
          e: ['Sai: CTC 4 cm đã ở pha hoạt động.', 'Đúng: tịnh tiến 1 lần, cho mọi trường hợp, khi CTC ≥ 3 cm — kéo theo toàn bộ thông tin cùng cột.', 'Sai: phải tịnh tiến toàn bộ các thông tin.'] },
        { q: 'Toạ độ điểm X′ sau tịnh tiến?', o: ['X′(8 , 4)', 'X′(9 , 4)', 'X′(9 , 5)', 'X′(10 , 4)'], a: 1,
          e: ['Sai: (8 , 4) nằm bên TRÁI đường báo động.', 'Đúng: giữ tung độ 4; đường báo động đi qua (8 , 3) với hệ số góc 1 → ở 4 cm có hoành độ 9.', 'Sai: không được đổi tung độ.', 'Sai: (10 , 4) nằm bên PHẢI đường báo động.'] },
        { q: 'Một ca khác: lúc 0:30 CTC 5 cm, ghi X(0 , 5) rồi tịnh tiến thành X′(8 , 5). Nhận xét?', o: ['Tịnh tiến đúng', 'Sai — X′ đúng là (10 , 5)', 'Sai — X′ đúng là (9 , 5)'], a: 1,
          e: ['Sai: (8 , 5) nằm bên trái đường báo động (Hình 10 — tịnh tiến SAI).', 'Đúng: ở tung độ 5, đường báo động có hoành độ 8 + (5 − 3) = 10.', 'Sai: (9 , 5) vẫn bên trái đường báo động.'] },
        { q: 'Nếu dùng bản RÚT GỌN và sản phụ nhập viện với CTC 6 cm, điểm ghi đầu tiên?', o: ['X(0 , 6)', 'X(2 , 6) — ngay trên đường báo động', 'Chờ CTC 8 cm mới vẽ'], a: 1,
          e: ['Sai: bản rút gọn ghi điểm đầu NGAY TRÊN đường báo động.', 'Đúng (Hình 12): tung độ = CTC hiện tại; hoành độ 2 không nói lên đã chuyển dạ bao lâu.', 'Sai: bản rút gọn bắt đầu từ CTC ≥ 4 cm.'] }],
      key: 'Bản gốc: ghi ở hoành độ 0 → CTC ≥ 3 cm thì tịnh tiến 1 lần, giữ tung độ, kéo cả cột. Bản rút gọn: điểm đầu nằm ngay trên đường báo động.' },

    { title: 'Bà X.: tịnh tiến & tính giờ', src: 'Slide Chuyển dạ bất thường & Partograph', cfg: { mode: 'orig', rows: { oxy: false, fhr: true }, times: [[0, '14h'], [4, '18h']] },
      c: { X: [[0, 2], [4, 5]], O: [5, 3], L: ['C', 'T'], M: ['0', '0'], C: [[2, 1], [3, 2]], F: [130, 140] },
      who: 'Bà X., nhập viện lúc 14 giờ vì chuyển dạ.',
      story: ['14h: CTC 2 cm, đầu 5/5, ối còn, 2 cơn/10′ (20 giây), tim thai 130, HA 110/70, mạch 78, nhiệt độ 36,6°C, nước tiểu 100 ml (đạm −, acetone −).', '18h: CTC 5 cm, đầu 3/5, ối vỡ trắng đục, không uốn khuôn, 3 cơn/10′ (50 giây), tim thai 140, HA 105/70, mạch 80, nhiệt độ 37°C.'],
      now: 'Sản đồ bản gốc đã ghi 2 lần khám, CHƯA tịnh tiến.',
      qs: [
        { q: 'Điểm 18h sau tịnh tiến?', o: ['X′(8 , 5)', 'X′(10 , 5)', 'Giữ X(4 , 5) — không cần tịnh tiến'], a: 1,
          e: ['Sai: (8 , 5) bên trái đường báo động.', 'Đúng: CTC 5 cm ≥ 3 cm → tịnh tiến; đường báo động ở 5 cm có hoành độ 10.', 'Sai: đã vào pha hoạt động thì phải tịnh tiến.'] },
        { q: 'Nếu thuận lợi, CTC mở trọn CHẬM NHẤT lúc mấy giờ?', o: ['20h', '23h', '2h sáng hôm sau'], a: 1,
          e: ['Sai: bám tối thiểu 1 cm/giờ thì 20h mới 7 cm.', 'Đúng: theo đường báo động, 5 → 10 cm cần 5 giờ → 18h + 5 = 23h.', 'Sai: chậm hơn tốc độ tối thiểu.'] },
        { q: '22h khám: CTC 7 cm. Điểm này nằm ở đâu?', o: ['Bên trái đường báo động', 'Giữa đường báo động và hành động', 'Chạm đường hành động'], a: 1,
          e: ['Sai: 22h ứng hoành độ 14 → đường báo động = 9 cm > 7 cm.', 'Đúng: hoành độ 14 → báo động 9 cm, hành động 5 cm → 7 cm nằm giữa → chuyển phải.', 'Sai: đường hành động ở hoành độ 14 chỉ mới 5 cm.'] },
        { q: 'Lúc 22h, nếu đang ở trung tâm y tế?', o: ['Theo dõi tiếp như thường quy', 'Chuyển tuyến (trừ khi CTC gần trọn)', 'Tự tăng co oxytocin tại chỗ', 'Mổ sanh tại chỗ'], a: 1,
          e: ['Sai: chuyển dạ đã ra khỏi giới hạn bình thường.', 'Đúng (slide): TTYT → chuyển tuyến, trừ khi CTC gần trọn.', 'Sai: tăng co thực hiện ở tuyến huyện trở lên (lưu đồ bên phải).', 'Sai: chưa có chỉ định, TTYT không đủ điều kiện.'] },
        { q: 'Nếu đang ở bệnh viện, bước đầu tiên?', o: ['Bấm ối', 'Đánh giá 3P tìm nguyên nhân — ối đã vỡ nên xem lại cơn co, tăng co nếu co chưa đủ', 'Mổ sanh ngay'], a: 1,
          e: ['Sai: ối đã vỡ từ 18h — không còn gì để bấm.', 'Đúng: luôn lý giải nguyên nhân trước (handout); hướng "bấm ối" của slide chỉ áp dụng khi ối còn.', 'Sai: chưa có bằng chứng tắc nghẽn hay suy thai.'] }],
      key: 'Giờ dự kiến mở trọn = đi theo đường báo động 1 cm/giờ. Ra khỏi giới hạn: TTYT chuyển tuyến; bệnh viện lý giải nguyên nhân rồi mới can thiệp.' },

    { title: 'Bên trái báo động: dạng điển hình', src: 'Handout Hình 13', cfg: { rows: { oxy: false, fhr: true } }, c: CASE.full,
      who: 'Sản phụ 28 tuổi, PARA 0000, thai 39 tuần, thai kỳ nguy cơ thấp, ước lượng thai 3000 g, khung chậu bình thường trên lâm sàng.',
      story: ['Nhập phòng sanh: CTC 4 cm, ngôi 5/5, ối còn, 3 cơn/10′ → bắt đầu sản đồ (bản rút gọn).'],
      now: 'Giờ thứ 4: CTC mở trọn, ngôi 0/5, kiểu thế chẩm vệ, ối vỡ trong (T), biến dạng +, 5 cơn/10′ mỗi cơn > 40 giây, tim thai 140 lần/phút.',
      qs: [
        { q: 'Đường biểu diễn CTC nằm ở đâu?', o: ['Bên trái đường báo động', 'Giữa báo động và hành động', 'Chạm đường hành động'], a: 0,
          e: ['Đúng: mọi lần khám đều nằm bên trái / trên đường báo động → mở nhanh hơn 1 cm/giờ.', 'Sai: chưa lần nào vượt sang phải đường báo động.', 'Sai: còn cách xa đường hành động.'] },
        { q: 'Kết luận phù hợp nhất?', o: ['Chuyển dạ bình thường, chỉ cần dựa vào đường CTC bên trái', 'Dự báo thuận lợi; kết hợp ngôi xuống đều + cơn co tốt + tim thai ổn → diễn tiến thuận lợi', 'Bất xứng đầu chậu', 'Chuyển dạ quá nhanh, nguy cơ tổn thương đường sanh'], a: 1,
          e: ['Sai: CTC bên trái chỉ DỰ BÁO thuận lợi, chưa đủ để kết luận — phải nhìn đầu thai và cơn co.', 'Đúng: đủ 3 mặt — CTC, ngôi 5/5 → 0/5, co 3 → 5 cơn/10′; kiểu thế trước rồi xoay về chẩm vệ (Hình 13).', 'Sai: ngôi xuống đều, biến dạng chỉ +.', 'Sai: độ dốc vừa phải, không có tachysystole.'] },
        { q: 'Xử trí tiếp theo?', o: ['Tăng co để rút ngắn chuyển dạ', 'Theo dõi, chuẩn bị đỡ sanh ngả âm đạo', 'Mổ sanh'], a: 1,
          e: ['Sai: chuyển dạ bình thường không dùng oxytocin hay can thiệp nào (slide).', 'Đúng: dạng điển hình thường kết thúc bằng cuộc sanh ngả âm đạo.', 'Sai: không có chỉ định.'] }],
      key: 'Bên trái báo động + ngôi xuống đều + co tốt = dạng điển hình → theo dõi sanh ngả âm đạo.' },

    { title: 'Bên trái nhưng ngôi đi ngang', src: 'Handout Hình 14 + lưu đồ bên trái', cfg: { rows: { oxy: false, fhr: true } },
      c: add(CASE.dec, { Pos: [null, 'CCPS', null, 'CCPS', 'CCPS'], F: [140, 144, 150, 152, 156] }),
      who: 'Sản phụ 30 tuổi, PARA 0000, thai 40 tuần, ước lượng thai 3500 g.',
      story: ['Nhập phòng sanh: CTC 4 cm, ngôi 5/5, ối còn → vẽ bản rút gọn. Ối vỡ tự nhiên ở lần khám thứ 2.'],
      now: 'Giờ thứ 4: CTC 10 cm nhưng ngôi còn 3/5, kiểu thế chẩm chậu phải sau, lọt không đối xứng, chồng xương +++, 5–6 cơn/10′ mỗi cơn > 40 giây.',
      qs: [
        { q: 'Đường biểu diễn CTC nằm ở đâu?', o: ['Bên trái đường báo động', 'Bên phải đường báo động', 'Chạm đường hành động'], a: 0,
          e: ['Đúng: toàn bộ đường CTC nằm hẳn bên trái — mở rất nhanh.', 'Sai: không lần nào vượt sang phải.', 'Sai.'] },
        { q: 'Vấn đề thật sự của cuộc chuyển dạ?', o: ['Thuận lợi vì CTC mở nhanh', 'Cơn co không đủ', 'Trở ngại cơ học: co đủ mạnh để mở CTC nhưng không đưa thai vượt qua được (hội chứng vượt trở ngại)', 'Đầu ối cản trở'], a: 2,
          e: ['Sai: "đánh lừa thị giác" — đường CTC đẹp che khuất đầu thai không tiến triển.', 'Sai: cơn co đang dồn dập (tachysystole).', 'Đúng (Hình 14): ngôi đi ngang 5/5 → 3/5, biến dạng +++, kiểu thế sau, lọt lệch, co dồn dập.', 'Sai: ối đã vỡ.'] },
        { q: 'Cần làm gì?', o: ['Tiếp tục theo dõi vì sản đồ bên trái', 'Tăng co để đầu xuống', 'Mổ sanh vì chuyển dạ bị tắc nghẽn cơ học'], a: 2,
          e: ['Sai: bên trái ≠ bình thường — đây là cạm bẫy chết người.', 'Sai: co đã dồn dập; tăng co khi có trở ngại cơ học → dọa vỡ tử cung.', 'Đúng (lưu đồ bên trái, SĐ3): mổ sanh vì chuyển dạ bị tắc nghẽn cơ học.'] }],
      key: 'CTC bên trái nhưng ngôi đi ngang + biến dạng +++ + co dồn dập = hội chứng vượt trở ngại "đánh lừa thị giác" → mổ sanh.' },

    { title: 'Sản đồ dốc đứng', src: 'Handout Hình 15 + lưu đồ bên trái + file ôn 3.2', cfg: { rows: { oxy: false, fhr: true } }, c: add(CASE.fast, { F: [148, 150, 146] }),
      who: 'Sản phụ 33 tuổi, PARA 2002, thai 39 tuần.',
      story: ['Nhập phòng sanh: CTC 4 cm, ngôi 4/5, ối đã vỡ, nước trong.'],
      now: 'Giờ thứ 2: CTC trọn, ngôi 0/5, đầu không biến dạng; CTG ghi 5–6 cơn/10′.',
      qs: [
        { q: 'Nhận dạng sản đồ?', o: ['Dạng điển hình bên trái', 'Bên trái với độ dốc rất lớn — chuyển dạ quá nhanh', 'Chuyển phải'], a: 1,
          e: ['Sai: dạng điển hình có độ dốc vừa phải.', 'Đúng (Hình 15): CTC và ngôi đều có độ dốc cao.', 'Sai: không vượt sang phải.'] },
        { q: 'Nguyên nhân thường gặp của dạng này?', o: ['Cơn co quá nhiều, quá mạnh (tachysystole)', 'Đầu ối cản trở', 'Bất xứng đầu chậu'], a: 0,
          e: ['Đúng: "hãy lưu ý nhìn cơn co" — tachysystole (> 5 cơn/10 phút).', 'Sai: đầu ối làm CHẬM chuyển dạ.', 'Sai: BXĐC làm ngôi không xuống.'] },
        { q: 'Theo lưu đồ, cần làm gì?', o: ['Không cần làm gì', 'Xử lí tachysystole, lưu ý biến chứng', 'Mổ sanh ngay'], a: 1,
          e: ['Sai: bên trái ≠ bình thường.', 'Đúng (lưu đồ bên trái, SĐ2).', 'Sai: không có chỉ định mổ.'] },
        { q: 'Biến chứng phải cảnh giác?', o: ['Tổn thương đường sanh; đờ tử cung → băng huyết sau sanh', 'Dò bàng quang – âm đạo', 'Nhiễm trùng ối do chuyển dạ kéo dài'], a: 0,
          e: ['Đúng: handout nhấn mạnh tổn thương đường sanh; file ôn (ca 3.2) chọn đờ tử cung → băng huyết sau sanh.', 'Sai: đó là biến chứng của chuyển dạ kéo dài / tắc nghẽn.', 'Sai: đây là chuyển dạ quá NHANH.'] }],
      key: 'Dốc đứng = sanh quá nhanh do tachysystole → xử lí cơn co, cảnh giác tổn thương đường sanh và đờ tử cung.' },

    { title: 'Chuyển phải: ối vỡ, co thưa', src: 'Handout Hình 16', cfg: { rows: { fhr: true } }, c: add(cut(WEAK, 3), { F: [140, 138, 140] }),
      who: 'Sản phụ 25 tuổi, PARA 0000, thai 40 tuần, ước lượng thai 3000 g, khung chậu bình thường.',
      story: ['Nhập phòng sanh: CTC 4 cm, ngôi 5/5, ối đã vỡ (nước trong) → vẽ bản rút gọn.'],
      now: 'Giờ thứ 4: CTC 6 cm, ngôi 4/5, 2 cơn/10′ (20–40 giây), đầu không biến dạng, tim thai 140.',
      qs: [
        { q: 'Sản đồ đang ở vùng nào?', o: ['Bên trái báo động', 'Giữa 2 đường (chuyển phải)', 'Bên phải đường hành động'], a: 1,
          e: ['Sai: ở giờ 4, đường báo động đã ở 8 cm.', 'Đúng: giờ 4 — báo động 8 cm, hành động 4 cm → 6 cm nằm giữa.', 'Sai: chưa tới đường hành động.'] },
        { q: 'Nguyên nhân nghĩ nhiều nhất?', o: ['Cơn co không đủ', 'Đầu ối cản trở', 'Trở ngại cơ học', 'Chắc chắn bất xứng đầu chậu'], a: 0,
          e: ['Đúng: đủ 4 điều kiện cùng lúc — CTC & ngôi chậm, co không đủ, ối đã vỡ, không biến dạng.', 'Sai: ối đã vỡ thì không còn đầu ối.', 'Sai: trở ngại cơ học khi co RẤT tốt mà ngôi không xuống.', 'Sai: chuyển phải không đồng nghĩa bất xứng đầu chậu.'] },
        { q: 'Xử trí?', o: ['Phá ối', 'Tăng co oxytocin (tuyến huyện trở lên), ghi đúng thời điểm bắt đầu', 'Mổ sanh', 'Theo dõi thêm 4 giờ rồi tính'], a: 1,
          e: ['Sai: ối đã vỡ.', 'Đúng: chỉnh cơn co; nếu ở TTYT thì chuyển tuyến.', 'Sai: chưa có chỉ định.', 'Sai: chờ thêm sẽ chạm đường hành động.'] },
        { q: 'Can thiệp được xem là thành công khi?', o: ['CTC trở lại song song đường báo động (≥ 1 cm/giờ) và ngôi lọt – xuống – xoay', 'Cơn co tăng lên 6 cơn/10 phút', 'Chỉ cần CTC mở thêm'], a: 0,
          e: ['Đúng (handout).', 'Sai: > 5 cơn/10′ là cường tính — không mong muốn.', 'Sai: phải đánh giá cả đầu thai.'] }],
      key: 'Ối vỡ + co không đủ + không biến dạng → cơn co không đủ → tăng co; thành công khi CTC song song báo động và ngôi xuống.' },

    { title: 'Chuyển phải: ối còn', src: 'Handout Hình 17', cfg: { rows: { fhr: true } }, c: add(cut(BAG, 3), { F: [142, 140, 144] }),
      who: 'Sản phụ 29 tuổi, PARA 0000, thai 39 tuần, ước lượng thai 3100 g, khung chậu bình thường.',
      story: ['Nhập phòng sanh: CTC 4 cm, ngôi 5/5, ối còn → vẽ bản rút gọn.'],
      now: 'Giờ thứ 4: CTC 6 cm, ngôi vẫn 5/5, ối CÒN, 3 cơn/10′ (20–40 giây), đầu không biến dạng.',
      qs: [
        { q: 'Nguyên nhân chuyển phải?', o: ['Đầu ối cản trở hoặc cơn co chưa đủ', 'Trở ngại cơ học', 'Chuyển dạ bình thường'], a: 0,
          e: ['Đúng: chậm + ối CÒN + không biến dạng; cơn co có thể tốt hoặc chưa.', 'Sai: không có biến dạng, ối còn.', 'Sai: đã lệch phải.'] },
        { q: 'Hành động ĐẦU TIÊN?', o: ['Tăng co ngay', 'Phá ối (nếu lợi ích > nguy cơ)', 'Mổ sanh', 'Chờ thêm'], a: 1,
          e: ['Sai: nguyên tắc — không tăng co khi chưa thử điều chỉnh bằng phá ối.', 'Đúng: phá ối để đầu áp vào CTC, kích thích cơn co.', 'Sai: chưa có chỉ định.', 'Sai: sẽ chạm đường hành động.'] },
        { q: '2 giờ sau phá ối: CTC vẫn chậm, ngôi vẫn 5/5, không biến dạng, co vẫn 3 cơn. Làm gì?', o: ['Tăng co oxytocin', 'Mổ sanh vì thất bại', 'Phá ối lại'], a: 0,
          e: ['Đúng (Hình 17): phá ối mà co vẫn chưa đủ → tăng co; không biến dạng nên chưa nghĩ cơ học.', 'Sai: chưa thử tăng co.', 'Sai: ối đã phá.'] }],
      key: 'Ối còn + chuyển phải → phá ối TRƯỚC; vẫn chậm, không biến dạng → tăng co.' },

    { title: 'Bà C.: phá ối rồi tăng co', src: 'File ôn (chị Uyên) ca 2.1 / 2.3', cfg: { rows: {} }, c: BC, extra: p => { p.flag(2.5, '💧 phá ối'); p.setOxy(4, '▶', ''); p.oxySpan(4, 6); },
      who: 'Bà C., 26 tuổi, PARA 0000, thai 39 tuần, nguy cơ thấp, ước 3000 g, khung chậu bình thường, ngôi chỏm lưng trái, kiểu thế CCTT.',
      story: ['Sản đồ chuyển phải lúc CTC 5 cm, ngôi 3/5, ối còn, co 2 cơn/10′ (20–40 giây) → phá ối, nước ối trắng đục.', '2 giờ sau: CTC 6 cm, ngôi vẫn 3/5, co vẫn 2 cơn/10′ → tăng co.'],
      now: 'Hiện tại: 4 cơn/10′ mỗi cơn > 40 giây (đáp ứng oxytocin), CTC 8 cm (1 cm/giờ), ngôi 1/5, không chồng xương.',
      qs: [
        { q: 'Nhận định quyết định PHÁ ỐI và TĂNG CO?', o: ['Phá ối hợp lý · tăng co hợp lý', 'Phá ối không hợp lý · tăng co hợp lý', 'Phá ối hợp lý · tăng co không hợp lý', 'Cả hai không hợp lý'], a: 0,
          e: ['Đúng (đáp án file ôn): ối còn + chuyển phải → phá ối; phá ối mà co vẫn thưa, không biến dạng → tăng co.', 'Sai: phá ối là hành động ưu tiên khi ối còn.', 'Sai: sau phá ối co vẫn chưa đủ → tăng co là đúng trình tự.', 'Sai: cả hai đúng chỉ định, đúng thời điểm.'] },
        { q: 'Hiệu quả của 2 can thiệp?', o: ['Mang lại hiệu quả mong muốn', 'Không mang lại hiệu quả mong muốn', 'Gây thêm bất thường không mong muốn'], a: 0,
          e: ['Đúng (đáp án file ôn): CTC song song đường báo động (1 cm/giờ), ngôi 3/5 → 1/5.', 'Sai: sản đồ đã trở lại song song báo động.', 'Sai: 4 cơn/10′ — chưa cường tính.'] },
        { q: 'Vì sao KHÔNG tăng co ngay khi mới chuyển phải?', o: ['Vì oxytocin chống chỉ định ở con so', 'Vì nguyên tắc: chưa thử điều chỉnh bằng phá ối thì chưa tăng co', 'Vì phải chờ chạm đường hành động'], a: 1,
          e: ['Sai: không có chống chỉ định đó.', 'Đúng (handout).', 'Sai: chờ tới đường hành động là trễ.'] }],
      key: 'Đúng trình tự: phá ối → đánh giá lại → tăng co → đánh giá lại bằng cả CTC lẫn ngôi.' },

    { title: 'Chạm đường hành động', src: 'Handout Hình 19', cfg: { rows: {} }, c: add(CASE.stuck, { Pos: [null, null, 'CCPS', 'CCPS', null] }), extra: p => p.flag(6, '⚠️ chạm'),
      who: 'Sản phụ 31 tuổi, PARA 0000, thai 40 tuần, ước lượng thai 3600 g.',
      story: ['Sản đồ chuyển phải; ối vỡ tự nhiên; co 4–5 cơn/10′, mỗi cơn > 40 giây; không dùng oxytocin.'],
      now: 'Giờ 6: CTC 6 cm, chạm đường hành động; ngôi 5/5 không lọt; biến dạng ++; kiểu thế bất lợi. Giờ 8: cắt qua đường hành động, biến dạng +++.',
      qs: [
        { q: 'Sản đồ chạm đường hành động có ý nghĩa gì?', o: ['Phải chấm dứt chuyển dạ ngay lập tức', 'Nỗ lực theo dõi & điều chỉnh đã thất bại — phải lý giải ngay và quyết định dứt khoát', 'Bình thường, theo dõi thêm 4 giờ'], a: 1,
          e: ['Sai: không đồng nghĩa chấm dứt chuyển dạ — nhưng buộc quyết định dứt khoát.', 'Đúng (handout).', 'Sai: không được phép trì hoãn.'] },
        { q: 'Co tốt + ối vỡ + ngôi không lọt + biến dạng tăng + kiểu thế bất lợi → nghĩ gì?', o: ['Cơn co không đủ', 'Đầu ối cản trở', 'Trở ngại cơ học'], a: 2,
          e: ['Sai: co đã tốt.', 'Sai: ối đã vỡ.', 'Đúng: chuyển phải + co rất tốt + ối vỡ + ngôi không xuống → đi tìm trở ngại cơ học.'] },
        { q: 'Việc cần làm NGAY?', o: ['Tăng liều oxytocin', 'Đánh giá lại khung chậu, cân thai, kiểu thế, biến dạng, cơn co, CTC → quyết định quản lý', 'Khám lại sau 2–3 giờ'], a: 1,
          e: ['Sai: có trở ngại cơ học mà tăng co → nguy cơ vỡ tử cung.', 'Đúng (handout).', 'Sai: trì hoãn chính là lý do sản đồ cắt qua đường hành động.'] },
        { q: 'Hậu quả của việc chậm quyết định trong ca này?', o: ['Hội chứng vượt trở ngại, dọa vỡ tử cung', 'Sanh quá nhanh', 'Không có hậu quả'], a: 0,
          e: ['Đúng (Hình 19).', 'Sai: ngược lại, chuyển dạ bị tắc.', 'Sai.'] }],
      key: 'Chạm hành động: lý giải ngay 6 yếu tố, nghĩ trở ngại cơ học, quyết định dứt khoát — không trì hoãn, không tăng co mù quáng.' },

    { title: 'Đề OSCE cũ: chuyển dạ tắc nghẽn', src: 'Giải đề OSCE (6210)', cfg: { rows: {} }, c: add(CASE.stuck, { M: ['0', '+', '++', '+++', '+++'] }),
      who: 'Sản phụ chuyển dạ, sản đồ đã chạm đường hành động.',
      story: ['Từ 21h đến 22h ngôi thai không xuống.'],
      now: 'Hiện tại: 5 cơn/10 phút (cường tính), chồng xương sọ +++.',
      qs: [
        { q: 'Diễn tiến chuyển dạ?', o: ['Chuyển dạ bình thường', 'Chuyển dạ tắc nghẽn', 'Chuyển dạ quá nhanh'], a: 1,
          e: ['Sai: đã chạm đường hành động.', 'Đúng (đáp án giải đề): ngôi không xuống + co cường tính + chồng xương +++.', 'Sai: ngôi đứng yên.'] },
        { q: 'Nguyên nhân & xử trí?', o: ['Cơn co yếu → tăng co', 'Nghĩ bất xứng đầu chậu → mổ lấy thai', 'Đầu ối → phá ối', 'Chờ thêm 2 giờ'], a: 1,
          e: ['Sai: co đang cường tính.', 'Đúng (đáp án giải đề).', 'Sai: không phải vấn đề đầu ối.', 'Sai: trì hoãn → dọa vỡ tử cung.'] },
        { q: 'Dấu hiệu nào cho thấy đã tới mức DỌA VỠ tử cung?', o: ['Vòng Bandl, dấu Frommel', 'Bướu huyết thanh nhỏ', 'Tim thai 140 lần/phút'], a: 0,
          e: ['Đúng (giải đề). Vỡ tử cung: mất tim thai đột ngột, mất cơn gò, ra huyết đỏ tươi, tiểu máu, sốc.', 'Sai: bướu huyết thanh gợi ý đầu bị ép, chưa phải dọa vỡ.', 'Sai: tim thai bình thường.'] }],
      key: 'Ngôi không xuống + co cường tính + chồng xương +++ = tắc nghẽn → mổ lấy thai trước khi dọa vỡ (Bandl, Frommel).' },

    { title: 'Đề OSCE cũ: ngôi không xuống', src: 'Giải đề OSCE (6310)', cfg: { rows: {} }, c: add(CASE.dec, { Pos: [null, null, 'CCTN', 'CCTN', 'CCTN'] }),
      who: 'Thai ước 3,4 kg; khung chậu chưa từng được thử thách, bình thường trên lâm sàng.',
      story: ['Cơn co tốt.'],
      now: 'CTC mở tốt; ngôi xuống < 1 cm/giờ, chồng xương sọ nhiều; kiểu thế chẩm chậu trái ngang (CCTN).',
      qs: [
        { q: 'Nhận định?', o: ['Chuyển dạ diễn tiến bình thường', 'Chuyển dạ diễn tiến chậm, nghĩ bất xứng đầu chậu', 'Cơn co không đủ'], a: 1,
          e: ['Sai: ngôi không xuống, chồng xương nhiều.', 'Đúng (đáp án giải đề): CTC mở tốt, co tốt mà ngôi xuống kém + chồng xương.', 'Sai: cơn co tốt.'] },
        { q: 'Nguyên nhân bất xứng nghĩ nhiều nhất?', o: ['Thai quá to', 'Khung chậu hẹp', 'Kiểu thế không thuận lợi (ngang)'], a: 2,
          e: ['Sai: 3,4 kg không quá to.', 'Sai: khung chậu bình thường trên lâm sàng.', 'Đúng (đáp án giải đề).'] },
        { q: 'Xử trí?', o: ['Chờ thai tự bình chỉnh', 'Mổ lấy thai', 'Tăng co'], a: 1,
          e: ['Sai: không biết chắc có bất xứng hay không nên không thể chờ (đáp án giải đề).', 'Đúng.', 'Sai: co đã tốt.'] }],
      key: 'Co tốt mà ngôi không xuống + chồng xương → bất xứng (ở đây do kiểu thế ngang) → mổ lấy thai.' },

    { title: 'Bà L.: vượt đường hành động', src: 'File ôn (chị Uyên) ca 4.1', cfg: { rows: {} }, c: BS, extra: p => p.band(8, 11, 'r', 'vượt hành động'),
      who: 'Bà L., 29 tuổi, PARA 0000, thai 40 tuần, nguy cơ thấp, ước 3400 g, bề cao tử cung 35 cm, tim thai 140, khung chậu bình thường; gây tê ngoài màng cứng khi vào pha hoạt động.',
      story: ['Bà L. được phá ối và theo dõi chuyển dạ.'],
      now: 'Hiện tại: sản đồ vượt đường hành động; ngôi CCPS gần như không xuống; cơn co tăng dần tới 6 cơn/10′; ối T → K → X.',
      qs: [
        { q: 'Nhận định tình trạng chuyển dạ hiện tại?', o: ['Gợi ý chuyển dạ kéo dài', 'Gợi ý bất xứng đầu chậu', 'Có biểu hiện hội chứng vượt trở ngại', 'Bị ảnh hưởng bởi gây tê ngoài màng cứng'], a: 2,
          e: ['Sai: đã nặng hơn "kéo dài".', 'Sai: bất xứng là nguyên nhân; hiện đã có biểu hiện nặng hơn.', 'Đúng (đáp án file ôn): co cường tính + ngôi không xuống + vượt hành động.', 'Sai: gây tê không giải thích được co cường tính và ngôi đứng yên.'] },
        { q: 'Hướng xử trí?', o: ['Mổ sanh cấp cứu ngay', 'Giúp sanh dụng cụ ngay', 'Cho rặn sanh ngay', 'Theo dõi tiếp, chưa can thiệp'], a: 0,
          e: ['Đúng (đáp án file ôn).', 'Sai: ngôi chưa xuống, chưa đủ điều kiện.', 'Sai: CTC chưa trọn.', 'Sai: không được trì hoãn.'] }],
      key: 'Vượt hành động + co cường tính + ngôi đứng yên = hội chứng vượt trở ngại → mổ sanh cấp cứu.' },

    { title: 'Bà S.: giai đoạn II, CCPS', src: 'File ôn (chị Uyên) ca 4.2', cfg: { rows: {} }, c: BS,
      who: 'Bà S., 30 tuổi, PARA 0000, thai 40 tuần, nguy cơ thấp, đã gây tê ngoài màng cứng, sinh hiệu ổn, khung chậu bình thường trên lâm sàng.',
      story: ['Sản đồ (bên) ghi lại chuyển dạ đến thời điểm hiện tại.'],
      now: 'CTC mở trọn · ngôi đã lọt, CCPS, bất đối xứng, vị trí +1, chồng xương +++ · ối vỡ hoàn toàn, nước ối xanh.',
      qs: [
        { q: 'Kết luận về chuyển dạ của bà S.?', o: ['Chuyển dạ kéo dài', 'Chuyển dạ ngưng tiến triển', 'Chuyển dạ bất xứng đầu chậu', 'Chuyển dạ có dấu hiệu dọa vỡ tử cung'], a: 3,
          e: ['Sai: nặng hơn thế.', 'Sai: chưa nói hết mức độ nguy hiểm.', 'Sai: bất xứng là nguyên nhân; câu hỏi hỏi tình trạng hiện tại.', 'Đúng (đáp án file ôn).'] },
        { q: 'Hành động?', o: ['Chờ đầu xuống thêm', 'Cho rặn sanh ngay', 'Giúp sanh ngay', 'Mổ sanh ngay'], a: 3,
          e: ['Sai: không được trì hoãn.', 'Sai: có trở ngại cơ học.', 'Sai: lọt bất đối xứng, chồng xương +++ → không giúp sanh.', 'Đúng (đáp án file ôn).'] },
        { q: 'Kết luận thích hợp nhất?', o: ['Giai đoạn II, diễn biến thuận lợi', 'Giai đoạn II, có dấu hiệu kéo dài', 'Giai đoạn II, có bất xứng đầu chậu', 'Giai đoạn II, có dấu hiệu vượt trở ngại'], a: 3,
          e: ['Sai.', 'Sai: chưa nói hết.', 'Sai: đây là nguyên nhân.', 'Đúng (đáp án file ôn).'] },
        { q: 'Gây tê ngoài màng cứng có liên quan đến biểu hiện trên sản đồ?', o: ['Không liên quan', 'Có — làm CTC mở chậm', 'Có — làm ngôi ngưng xoay ở CCPS', 'Có — làm yếu cơn co'], a: 0,
          e: ['Đúng (đáp án file ôn).', 'Sai.', 'Sai.', 'Sai: cơn co đang cường tính.'] }],
      key: 'Giai đoạn II mà CCPS, lọt lệch, chồng xương +++, co cường tính, ối xanh = vượt trở ngại → dọa vỡ tử cung → mổ sanh ngay.' },

    { title: 'Bà D.: giai đoạn II bình thường', src: 'File ôn (chị Uyên) ca 3.1', cfg: { rows: {} },
      c: { X: [[0, 4], [1, 6], [2, 8], [3, 10], [4, 10]], O: [4, 3, 2, 1, 0], Pos: [null, null, null, null, 'CCTN'], L: ['C', 'T', 'T', 'T', 'T'], M: ['0', '0', '0', '0', '0'], C: [[3, 1], [4, 2], [4, 2], [4, 2], [4, 2]] },
      who: 'Bà D., 32 tuổi, PARA 1001, thai kỳ bình thường, nguy cơ thấp; gây tê ngoài màng cứng khi vào pha hoạt động.',
      story: ['Sản đồ cho thấy diễn biến đến khi CTC trọn; hiện đang ở giai đoạn II.'],
      now: 'CTC mở trọn được 1 giờ · ngôi +3, CCTN, đối xứng, không chồng xương, không bướu huyết thanh · co mạnh, 4 cơn/10′.',
      qs: [
        { q: 'Nhận định tình trạng chuyển dạ?', o: ['Hoàn toàn bình thường', 'Có biểu hiện gợi ý bất xứng đầu chậu', 'Bị ảnh hưởng bởi gây tê ngoài màng cứng'], a: 0,
          e: ['Đúng (đáp án file ôn).', 'Sai: không chồng xương, không bướu huyết thanh, ngôi xuống đều.', 'Sai: chuyển dạ vẫn tiến triển tốt.'] },
        { q: 'Xử trí?', o: ['Mổ sanh cấp cứu', 'Giúp sanh dụng cụ ngay', 'Cho sản phụ rặn sanh ngay, không chờ thêm', 'Theo dõi tiếp, không can thiệp'], a: 2,
          e: ['Sai: không có chỉ định.', 'Sai: chưa cần dụng cụ.', 'Đúng (đáp án file ôn).', 'Sai: ngôi +3, đã đủ điều kiện rặn.'] }],
      key: 'Ngôi xuống tốt, không chồng xương, co tốt → giai đoạn II bình thường → cho rặn sanh.' }
  ];

  /* ---------- ÔN NHANH: câu kiến thức ngắn ---------- */
  const QS = [
    { q: 'Bản gốc: nhập viện CTC 4 cm. Điểm ghi sau tịnh tiến?', o: ['X(0,4) — giữ nguyên chỗ', 'X′(9,4) — trên đường báo động', 'X′(8,4) — bên trái đường báo động', 'X′(4,9) — đổi chỗ hai trục'], a: 1, w: 'Giữ tung độ 4 cm, trượt ngang tới đường báo động → hoành độ 9.' },
    { q: 'Bản rút gọn: nhập viện CTC 6 cm. Điểm ghi đầu tiên?', o: ['X(0,6)', 'X(2,6) — ngay trên đường báo động', 'Chờ tới 8 cm mới vẽ', 'Vẽ lại từ pha tiềm thời'], a: 1, w: 'Bản rút gọn vẽ từ ≥ 4 cm; điểm đầu nằm ngay trên đường báo động, tung độ = CTC.' },
    { q: 'Ối đã vỡ, nước ối lẫn phân su. Ký hiệu?', o: ['C', 'T', 'X', 'K'], a: 2, w: 'C = ối còn · T = vỡ, trong · X = vỡ, phân su · K = vỡ, không thấy nước ối.' },
    { q: 'Sản đồ lệch phải đường báo động có ý nghĩa gì?', o: ['Nguy cơ chuyển dạ kéo dài: CTC mở chậm hơn 1 cm/giờ', 'Chắc chắn bất xứng đầu chậu', 'Chuyển dạ diễn tiến nhanh', 'Phải mổ sanh ngay'], a: 0, w: 'Lệch phải = chậm hơn tốc độ tối thiểu → ra khỏi giới hạn bình thường, phải tìm nguyên nhân (không đồng nghĩa bất xứng).' },
    { q: 'Dấu hiệu nào gợi ý bất xứng đầu chậu?', o: ['Bướu huyết thanh', 'Chồng xương sọ', 'Sờ thấy cả thóp trước và thóp sau', 'Cả 3 dấu hiệu trên'], a: 3, w: 'Cả 3 dấu hiệu đều gợi ý đầu bị ép / không vượt được trở ngại.' },
    { q: 'Sản đồ chạm đường hành động nghĩa là gì?', o: ['Phải chấm dứt chuyển dạ ngay', 'Phải đánh giá lại mọi yếu tố và ra quyết định dứt khoát', 'Chờ thêm 4 giờ', 'Tăng liều oxytocin'], a: 1, w: 'Không đồng nghĩa chấm dứt chuyển dạ, nhưng buộc quyết định dứt khoát, không trì hoãn.' },
    { q: 'Việc nào sản đồ KHÔNG làm được?', o: ['Thể hiện diễn tiến chuyển dạ', 'Cảnh báo chuyển dạ ra khỏi giới hạn', 'Chẩn đoán bất xứng đầu chậu', 'Giúp nhân viên y tế giao tiếp'], a: 2, w: 'Sản đồ không có chức năng chẩn đoán; người dùng lý giải để chẩn đoán.' },
    { q: 'Sản đồ chuyển phải từ 3h, ối còn, ngôi xuống chậm; đến 5h mới phá ối. Nhận xét?', o: ['Đúng lúc', 'Trễ — nên phá ối ngay khi chuyển phải (lúc 3h)', 'Quá sớm, không cần thiết'], a: 1, w: 'Giải đề OSCE: ối còn + chuyển phải → phá ối là hành động ưu tiên; để tới 5h là trễ.' },
    { q: 'Mẫu BV Từ Dũ ghi độ lọt "Chặt (−1)". Tương ứng ngôi mấy phần năm?', o: ['5/5', '4/5', '3/5', '2/5'], a: 2, w: 'Cao −3 = 5/5 · Chúc −2 = 4/5 · Chặt −1 = 3/5 · Lọt cao 0 = 2/5 · Lọt vừa +1 = 1/5 · Lọt thấp +2 = 0/5.' },
    { q: () => [icon('CCPN'), ' Icon kiểu thế này là gì?'], o: ['Chẩm chậu trái ngang', 'Chẩm chậu phải ngang', 'Chẩm vệ', 'Chẩm cùng'], a: 1, w: 'Thóp sau chỉ sang TRÁI hình = PHẢI mẹ, nằm ngang → chẩm chậu phải ngang.' },
    { q: 'Tim thai đo được 172 lần/phút. Nghe lại sau bao lâu?', o: ['30 phút', '15 phút', '4 giờ'], a: 1, w: 'Slide: ngoài 120–160 → nghe mỗi 15 phút; 3 lần bất thường → xử trí ngay, trừ khi gần sanh.' },
    { q: 'Cơn co cường tính (tachysystole) là?', o: ['≥ 3 cơn/10 phút', '> 5 cơn/10 phút', 'Mỗi cơn > 40 giây'], a: 1, w: '> 5 cơn/10 phút (tức ≥ 6). Gặp trong dạng sản đồ dốc đứng và hội chứng vượt trở ngại.' }
  ];
  function icon(k) { const s = S('svg', { viewBox: '0 0 40 40', width: 44, height: 44 }); drawPos(s, 20, 20, 17, k, true); return s; }
  const nQ = STATIONS.reduce((a, s) => a + s.qs.length, 0);

  CH.push({ e: '⭐', c: 'yellow', part: 'E', t: 'Ôn thi OSCE',
    goals: ['Ôn 13 bẫy hay sai', `Làm ${STATIONS.length} trạm OSCE (${nQ} câu) — có giải thích từng đáp án`, `Ôn nhanh ${QS.length} câu kiến thức · xem "sổ hố tử thần"`],
    steps: [
      { t: 'Phao cứu sinh: 13 bẫy', say: 'Lật ít nhất 5 thẻ — đọc kỹ những chỗ hay sai', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '❗', f: 'Chữ C', b: 'C = ối CÒN (bản VN).\nT trong · X phân su · K không thấy', c: 'coral' },
          { e: '📐', f: 'Tịnh tiến', b: 'Giữ tung độ, trượt ngang lên đường báo động:\n(0,4)→(9,4) · (0,5)→(10,5)', c: 'pink' },
          { e: '🔢', f: 'Gốc vs rút gọn', b: 'Gốc: chuyển dạ thật, tịnh tiến ở ≥ 3 cm\nRút gọn: từ ≥ 4 cm, ngay trên báo động', c: 'blue' },
          { e: '⏱️', f: 'Mỗi lần khám', b: 'Xₙ = (xₙ₋₁ + a , yₙ)\nMọi dữ kiện cùng hoành độ', c: 'mint' },
          { e: '🟢', f: 'Bên trái ≠ bình thường', b: 'Chỉ dự báo thuận lợi.\nCoi chừng "đánh lừa thị giác" & dốc đứng', c: 'mint' },
          { e: '🟡', f: 'Bên phải ≠ BXĐC', b: 'Soi 3P, tiền sử, can thiệp trước:\nco · đầu ối · cơ học', c: 'yellow' },
          { e: '💧', f: 'Phá ối trước', b: 'Không tăng co khi chưa thử phá ối\n(nếu lợi ích > nguy cơ)', c: 'blue' },
          { e: '🔴', f: 'Chạm hành động', b: 'Đánh giá lại MỌI yếu tố ngay.\nKhông trì hoãn', c: 'coral' },
          { e: '🩺', f: 'Sản đồ ≠ chẩn đoán', b: 'Chỉ cảnh báo.\nNgười dùng lý giải & chẩn đoán', c: 'lav' },
          { e: '🚫', f: 'Không vẽ khi…', b: 'đã có chỉ định mổ sanh ngay từ đầu', c: 'peach' },
          { e: '🔀', f: 'Tịnh tiến 3 hay 4 cm?', b: 'Bài BM (bản gốc): ≥ 3 cm, 1 lần.\nGhi chú nào viết 4 cm là nhầm với mốc bắt đầu của bản rút gọn', c: 'pink' },
          { e: '⚡', f: 'Cơn co cường tính', b: '> 5 cơn/10 phút (≥ 6)\nDốc đứng · vượt trở ngại', c: 'yellow' },
          { e: '🏷️', f: 'Ký hiệu ối lạ', b: 'D (dẹt), P (phồng), M (máu) là của mẫu khác.\nBài BM: C · T · X · K', c: 'lav' }], 5);
      } },

      { t: 'Khung trả lời 1 trạm sản đồ', say: 'Lật 4 thẻ — dùng khung này cho mọi trạm OSCE', run(host, ctx) {
        tapCards(host, ctx, [
          { e: '1️⃣', f: 'Đọc bệnh cảnh', b: 'Tuổi, PARA, tuổi thai, nguy cơ, ước cân thai, khung chậu, lần sanh trước\nĐã làm gì: phá ối? oxytocin? gây tê?', c: 'pink' },
          { e: '2️⃣', f: 'Nhận dạng sản đồ', b: 'Bản gốc hay rút gọn? Tịnh tiến đúng chưa?\nĐường CTC: trái · giữa · chạm hành động? Độ dốc?', c: 'blue' },
          { e: '3️⃣', f: 'Đọc đủ 6 dữ kiện', b: 'Ngôi & kiểu thế · cơn co · ối · biến dạng · tim thai\nĐọc theo cùng cột thời gian', c: 'mint' },
          { e: '4️⃣', f: 'Lý giải → quyết định', b: 'Cơn co / đầu ối / trở ngại cơ học\n→ phá ối · tăng co · đánh giá lại · mổ sanh\n(nêu tuyến: TTYT hay bệnh viện)', c: 'yellow' }]);
        host.append(note(['Đề OSCE thường hỏi theo chuỗi: ', B('nhận định → nguyên nhân → xử trí → lý giải'), '. Câu lý giải phải nêu ', B('dữ kiện trên sản đồ'), ' làm bằng chứng.'], 'l'));
      } },

      { t: `Trạm OSCE (${STATIONS.length} trạm)`, say: 'Mỗi trạm: đọc ca + sản đồ, trả lời từng câu (1 lần chọn), đọc giải thích từng đáp án', gate: true, run(host, ctx) {
        const SS = Sando.st; SS.oRight = 0; SS.oAsked = 0; SS.oMiss = []; const got = STATIONS.map(() => null);
        const nav = h('div', { class: 'row left' }), wrap = h('div', { class: 'stack' });
        host.append(nav, wrap);
        const drawNav = cur => nav.replaceChildren(STATIONS.map((s, i) => h('button', { class: 'chip stn' + (i === cur ? ' on' : '') + (got[i] ? ' done' : ''), title: s.title, onclick: () => station(i) }, (got[i] ? '✓ ' : '') + (i + 1))));
        function station(si) {
          const st = STATIONS[si]; let qi = 0, right = 0; drawNav(si);
          const p = Partograph(Object.assign({}, st.cfg, { rows: Object.assign({ oxy: true }, st.cfg.rows) }));
          plotNow(p, st.c); if (st.extra) { p.fast = true; st.extra(p); p.fast = false; }
          const stem = h('div', { class: 'frame stack stem' },
            h('div', { class: 'row left' }, h('span', { class: 'chip c-yellow' }, `Trạm ${si + 1}/${STATIONS.length}`), h('b', { class: 'stt' }, st.title), h('span', { class: 'pill l' }, '📚 ' + st.src)),
            h('div', {}, '👩 ', st.who), st.story.map(s => h('div', {}, '📋 ', s)), h('div', { class: 'now' }, '🩺 ', st.now));
          const panel = h('div', { class: 'stack' });
          wrap.replaceChildren(stem, lay(box(p), panel));
          const ask = () => {
            const q = st.qs[qi];
            panel.replaceChildren(h('div', { class: 'row left' }, st.qs.map((_, i) => h('span', { class: 'pill ' + (i < qi ? 'g' : i === qi ? '' : 'w') }, 'Câu ' + (i + 1)))), h('div', { class: 'qq' }, h('span', { class: 'qi' }, '❓'), q.q));
            const list = h('div', { class: 'stack' }); panel.append(list); let over = false;
            q.o.forEach((t, i) => list.append(h('button', { class: 'opt', onclick() {
              if (over) return; over = true;
              const good = i === q.a; SS.oAsked++;
              if (good) { SS.oRight++; right++; burst(this); ctx.ok(); } else { ctx.oops('Chưa đúng — đọc giải thích từng đáp án nha.'); SS.oMiss.push({ q: `[Trạm ${si + 1} · ${st.title}] ${q.q}`, w: q.e[q.a] }); }
              [...list.children].forEach((b, j) => { b.disabled = true; b.classList.add(j === q.a ? 'good' : j === i ? 'bad' : 'dim'); b.append(h('div', { class: 'exp' }, q.e[j])); });
              panel.append(h('div', { class: 'row' }, h('button', { class: 'btn go', onclick() { qi++; if (qi < st.qs.length) ask(); else end(); } }, qi + 1 < st.qs.length ? 'Câu tiếp ▶' : 'Kết thúc trạm ▶')));
            } }, h('span', { class: 'k' }, 'ABCDEF'[i]), h('span', { class: 'ot' }, t))));
          };
          const end = () => {
            got[si] = [right, st.qs.length]; drawNav(si);
            panel.replaceChildren(stamp(`Trạm ${si + 1}: ${right}/${st.qs.length}`, right === st.qs.length ? 'ok' : 'warn'), note(['🔑 Chốt trạm: ', st.key], 'm'),
              h('div', { class: 'row' }, h('button', { class: 'btn go', onclick() { const nx = got.findIndex(g => !g); if (nx >= 0) station(nx); else fin(); } }, got.some(g => !g) ? 'Trạm tiếp ▶' : '🏁 Xem kết quả')));
            if (got.every(Boolean)) fin(true);
          };
          ask();
        }
        const fin = soft => {
          const tot = got.reduce((a, g) => a + (g ? g[1] : 0), 0), ok = got.reduce((a, g) => a + (g ? g[0] : 0), 0), r = ok / (tot || 1);
          if (soft) { ctx.done(); return; }
          drawNav(-1);
          wrap.replaceChildren(h('div', { class: 'final stack' }, h('div', { class: 'bigt' }, `🎯 ${ok}/${tot}`), stamp(r >= .8 ? '🏆 Cao thủ sản đồ!' : r >= .55 ? '🌟 Khá lắm!' : '🌱 Ôn thêm xíu nha', r >= .55 ? 'ok' : 'warn'),
            h('table', { class: 'src' }, h('tr', {}, h('th', {}, 'Trạm'), h('th', {}, 'Điểm')), STATIONS.map((s, i) => h('tr', {}, h('td', {}, (i + 1) + '. ' + s.title), h('td', {}, got[i] ? got[i][0] + '/' + got[i][1] : '—')))),
            h('div', { class: 'cap' }, 'Bấm số trạm ở trên để làm lại · Tiếp ▶ để ôn nhanh')));
          burst(wrap); ctx.done();
        };
        station(0);
      } },

      { t: `Ôn nhanh: ${QS.length} câu kiến thức`, say: 'Mỗi câu 40 giây. Nhanh tay lên nha!', run(host, ctx) {
        const S = Sando.st; S.right = 0; S.asked = 0; S.miss = [];
        const sub = Object.assign({}, ctx, { done() { } }), body = h('div', { class: 'stack' }); host.append(body);
        let i = 0;
        const show = () => {
          body.replaceChildren(); const it = QS[i];
          body.append(h('div', { class: 'row' }, h('span', { class: 'chip c-yellow' }, `Câu ${i + 1}/${QS.length}`), h('span', { class: 'chip c-mint' }, `✅ ${S.right}`), h('span', { class: 'chip c-coral' }, `❌ ${S.miss.length}`)));
          Q(sub, body, { q: typeof it.q === 'function' ? it.q() : it.q, opts: it.o, ans: it.a, why: it.w, time: 40, onEnd(good) {
            S.asked++; if (good) S.right++; else S.miss.push({ q: typeof it.q === 'function' ? 'Câu nhận dạng icon kiểu thế' : it.q, w: it.w });
            ctx.later(() => body.append(h('div', { class: 'row' }, h('button', { class: 'btn go', onclick() { if (++i < QS.length) show(); else fin(); } }, i + 1 < QS.length ? 'Câu tiếp ▶' : '🏁 Xem kết quả'))), 300);
          } });
        };
        const fin = () => { body.replaceChildren(h('div', { class: 'final stack' }, h('div', { class: 'bigt' }, `⚡ ${S.right}/${QS.length}`), h('div', { class: 'cap' }, 'Bấm Tiếp ▶'))); burst(body); ctx.done(); };
        show();
      } },

      { t: 'Đề thật: OSCE 6320 – trạm A (tự luyện)', say: 'Đọc ca, tự trả lời 3 câu, rồi lật thẻ dấu hiệu để tự kiểm tra', run(host, ctx) {
        host.append(note(['📄 Kỳ thi cuối tín chỉ Thực hành (mã 6320, 04/06/2020). Sản phụ M., 25 tuổi, PARA 0000, được ', B('chuyển từ BV quận vì "suy thai trong chuyển dạ"'), '. Không dùng oxytocin, không gây tê.'], 'l'),
          h('div', { class: 'frame' }, h('b', {}, 'Sản đồ (mô tả lại từ ảnh chụp đề):'), ' đã phá ối; CTC tiếp tục mở nhưng ngôi đứng yên; tim thai tăng dần tới ~170 lần/phút; cơn co dày, dài; nước ối chuyển sang có phân su; biến dạng đầu tăng tới +++.',
            h('br'), h('b', {}, 'Khám lúc 8:30:'), ' bề cao TC 33 cm, ước 3200 g · 7–8 cơn co/10 phút · đoạn dưới tử cung kéo dài · CTC chưa trọn hẳn, còn mép trước phù nề nhiều · bướu huyết thanh ~6 cm · phần thấp nhất của đầu ngang 2 gai hông · khung chậu bình thường · sờ được vành tai thai.'),
          h('div', { class: 'qq stack' }, h('div', {}, '❓ Câu 2: Vấn đề cốt lõi? A. Bất xứng đầu chậu · B. Hội chứng vượt trở ngại · C. Dọa vỡ tử cung · D. Nhau bong non'),
            h('div', {}, '❓ Câu 3: Lúc 8:30 can thiệp nào phù hợp? A. Chưa thể quyết định ngay · B. Cho rặn sanh ngay · C. Sanh giúp ngay · D. Mổ sanh ngay'),
            h('div', {}, '❓ Câu 4: Hãy lí giải vì sao chọn như trên (lí giải chung cho cả 2 câu).'),
            h('div', { class: 'cap', style: { textAlign: 'left' } }, '(Câu 1 phân loại EFM theo ACOG 2009 — học ở bài CTG.)')));
        tapCards(host, ctx, [
          { e: '⚡', f: '7–8 cơn co/10 phút', b: 'Cơn co cường tính (> 5 cơn/10 phút)', c: 'yellow' },
          { e: '📏', f: 'Đoạn dưới kéo dài', b: 'Dấu hiệu dọa vỡ tử cung', c: 'coral' },
          { e: '🌸', f: 'CTC phù nề mép trước', b: 'Gặp trong hội chứng vượt trở ngại', c: 'pink' },
          { e: '🎈', f: 'Bướu huyết thanh ~6 cm', b: 'Đầu bị ép lâu → gợi ý bất xứng đầu chậu', c: 'peach' },
          { e: '📍', f: 'Đầu ngang 2 gai hông, CTC chưa trọn', b: 'Chưa đủ điều kiện sanh giúp', c: 'blue' },
          { e: '👂', f: 'Sờ được vành tai thai', b: 'Đầu lọt không thuận lợi (lệch / bất đối xứng) — đối chiếu thầy cô', c: 'lav' }], 4);
        host.append(note(['💡 Gợi ý tự phân tích: các dấu hiệu khớp với ', B('hội chứng vượt trở ngại → dọa vỡ tử cung'), ', nguyên nhân nghĩ do ', B('bất xứng đầu chậu'), '; CTC chưa trọn nên không sanh giúp được → hướng ', B('mổ sanh'), '. Đề KHÔNG kèm đáp án chính thức — đối chiếu thầy cô.'], 'p'));
      } },

      { t: 'Nguồn & đối chiếu', say: 'Bảng cho biết mỗi tài liệu đã được dạy ở đâu trong sổ', run(host, ctx) {
        const R = [
          ['Handout "Thực hành ghi & lí giải sản đồ WHO 1993" (Âu Nhựt Luân) — bản Obsidian + bản ATCS có ghi chú', 'Ch.1–8: toàn bộ nội dung chính, Hình 1–19 · Ch.9 trạm 1, 3–7, 9', '✅'],
          ['Lưu đồ "Bên trái đường báo động"', 'Ch.5 (3P, tiền sử) · Ch.6 (3 dạng, việc cần làm) · Ch.9 trạm 4–5', '✅'],
          ['Lưu đồ "Bên phải đường báo động"', 'Ch.7 (phá ối ưu tiên, tăng co tuyến huyện)', '✅'],
          ['Nguyên lý sản đồ WHO 1993', 'Ch.1 (tử vong mẹ) · Ch.2 (Friedman → Philpott, 2 đường, vùng 4 giờ, bản 2002)', '✅'],
          ['Slide "Chuyển dạ bất thường & Partograph"', 'Ch.2 (tiêu chuẩn CD bất thường) · Ch.3 (tim thai, mẹ, 5/5, ối, cơn co) · Ch.4 (Bà X, Bà A) · Ch.5 (3P) · Ch.8 (xử trí theo vùng/tuyến) · Ch.9 trạm 2', '✅'],
          ['Ôn sản đồ (chị Uyên)', 'Ch.7 ca Bà C · Ch.8 ca Bà S · Ch.9 trạm 8, 12–14 (ca 2.1–2.3, 3.1, 3.2, 4.1, 4.2)', '✅ (bỏ phần đọc CTG)'],
          ['Giải đề chuyển dạ – CTG – sản đồ (.docx)', 'Ch.8 (vượt trở ngại → dọa vỡ → vỡ TC) · Ch.9 trạm 10–11, ôn nhanh', '✅ (CTG, khám thai, BHSS: ngoài phạm vi)'],
          ['Đề IUGR-Partograph (OSCE 6320)', 'Ch.9 đề thật trạm A', '✅ (trang siêu âm IUGR: ngoài phạm vi)'],
          ['Theo dõi chuyển dạ – Sản đồ', 'Ch.3 (cơn co bình thường) · Ch.4 (điều kiện vẽ)', '✅'],
          ['Đọc sản đồ (ghi chú)', 'Ch.6–7 · bẫy "tịnh tiến 4 cm" ở Ch.4, Ch.9', '✅'],
          ['Sản Đồ.pdf · Biểu đồ chuyển dạ WHO 1998', 'Ch.3 tour tờ đầy đủ · mẫu thực tế', '✅'],
          ['Biểu đồ chuyển dạ BV Từ Dũ', 'Ch.3 mẫu thực tế (độ lọt −3 → +2, TTCB/DĐNT)', '✅'],
          ['Ngân hàng đề Obsidian (Bài 23, qbank 5.3)', 'Ch.2 quiz · Ch.8 dấu hiệu BXĐC · Ch.9 ôn nhanh', '✅ (qbank ghi 1993 bắt đầu 4 cm → theo handout: 3 cm)']];
        host.append(h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'src' }, h('tr', {}, h('th', {}, 'Tài liệu'), h('th', {}, 'Dạy ở đâu'), h('th', {}, 'Trạng thái')), R.map(r => h('tr', {}, r.map(c => h('td', {}, c)))))),
          note(['Khi các nguồn lệch nhau, sổ theo ', B('handout BM Phụ Sản'), ' và ghi rõ nguồn của ý bổ sung (slide, file ôn, đề cũ).'], 'b'));
        ctx.done();
      } },

      { t: 'Tổng kết', say: 'Xem lại lỗi sai, rồi học lại phần còn yếu', run(host, ctx) {
        const S = Sando.st, n = Object.keys(S.done).length, tot = CH.reduce((a, c) => a + c.steps.length, 0);
        const ci = CH.length - 1, osce = CH[ci].steps.findIndex(s => s.t.startsWith('Trạm OSCE'));
        const miss = [].concat(S.oMiss || [], S.miss || []);
        host.append(h('div', { class: 'final stack' },
          h('div', { class: 'bigt' }, '🎉 ', h('em', {}, 'Xong sổ!')),
          h('div', { class: 'row' }, h('span', { class: 'chip c-yellow' }, `⭐ ${n}/${tot} màn`),
            S.oAsked ? h('span', { class: 'chip c-mint' }, `🏥 Trạm OSCE ${S.oRight}/${S.oAsked}`) : h('span', { class: 'chip c-lav' }, 'Chưa làm trạm OSCE'),
            S.asked ? h('span', { class: 'chip c-blue' }, `⚡ Ôn nhanh ${S.right}/${S.asked}`) : null),
          miss.length ? h('div', { class: 'missed' }, h('b', {}, '📕 Sổ hố tử thần — xem lại:'), miss.map(m => h('div', {}, '🔸 ', m.q, h('br'), h('small', {}, '→ ' + m.w)))) : null,
          note('📌 Số liệu & ngưỡng bám theo bài giảng Thực hành Sản khoa (BM Phụ Sản ĐHYD TP.HCM). Khi thi, đối chiếu bản của thầy cô.'),
          h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { location.hash = '#0.0'; } }, '🔁 Học lại từ đầu'), h('button', { class: 'btn go', onclick: () => { location.hash = '#' + ci + '.' + osce; } }, '🏥 Làm lại trạm OSCE'))));
        burst(host); ctx.done();
      } }
    ] });
})();
