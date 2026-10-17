// Màn 9 – Người đàn bà không mắt (màn cuối): đối chiếu kịch bản và mục "Kiểm tra nhanh"
// của docs/man-9-nguoi-dan-ba-khong-mat.md.
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, initialState, step, view, type GameState } from '../src/engine/index.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

checkLevelContent('m9', 'man-9-nguoi-dan-ba-khong-mat.md');

const level = loadLevel('m9');
const reached = new Set<string>();
function playM9(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m9', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}
const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => [b.id, b.ink, b.segments.map((x) => x.text).join('')]) : []));

const ASK_SAU = 'Hỏi bà Sáu về đêm cháy năm 1986';
const BOOK = 'Xem sổ hộ khẩu năm 1986 của bà Sáu';
const INCENSE = 'Xuống tiệm bà Hoa mua hương';
const INK = 'Nhìn kỹ dòng thứ tư và thứ năm';
const DOSSIER = 'Đọc lại hồ sơ vụ cháy';
const LOOK = 'Không bịt mắt, nhìn về phía cầu thang';
const RUN = 'Lách qua bà, chạy xuống bàn thờ chung';
const SEVEN = 'Thắp bảy nén';
const BREAK = 'Bẻ đôi một nén cho đủ bảy';
const HAI = 'Khấn sáu tên, và tên bà Đỗ Thị Hai';

describe('E1 · Lửa đã tắt', () => {
  test('có co_bay_nen: thắp bảy nén, khấn đủ bảy tên; hết game', () => {
    const t = run(level, [ASK_SAU, INCENSE, INK, LOOK, RUN, SEVEN, HAI]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm9_e1', time: '05:30', scene: { bg: 'bang_tin_cao_pho_7_day', light: 'dawn' } });
    const e = endingView(level, t.state)!;
    expect(e).toMatchObject({ result: 'survive', cause: 'Lửa đã tắt', finale: 'complete' });
    expect(t.views.find((v) => v.node === 'm9_n20')!.lines[1]).toEqual({
      ch: 'env',
      sense: 'nhìn',
      text: 'Bạn cầm bó hương bảy nén của bà Hoa.',
    });
  });

  test('không có co_bay_nen: bẻ đôi một nén', () => {
    const t = run(level, [ASK_SAU, INK, BOOK, LOOK, RUN, BREAK, HAI]);
    reached.add(t.state.node);
    expect(t.state.node).toBe('m9_e1');
    expect(t.state.flags).toContain('co_bay_nen');
    const n20 = t.views.find((v) => v.node === 'm9_n20')!;
    expect(n20.lines[1]).toEqual({ ch: 'env', sense: 'nhìn', text: 'Ống hương trên bàn thờ còn đúng sáu nén.' });
    expect(n20.exit.kind === 'choices' && n20.exit.choices.map((c) => c.text)).toEqual([
      'Thắp sáu nén, khấn sáu tên trên bài vị',
      BREAK,
    ]);
  });

  test('qua M9-11 rồi tháo khăn: lúc bịt mắt màn hình đen, không có giờ', () => {
    const t = run(level, [ASK_SAU, INCENSE, INK, 'Bịt mắt', 'Tháo khăn, nhìn vào mặt bà', RUN, SEVEN, HAI]);
    reached.add(t.state.node);
    expect(t.state.node).toBe('m9_e1');
    const n11 = t.views.find((v) => v.node === 'm9_n11')!;
    expect(n11).toMatchObject({ eyesClosed: true, time: null, scene: { light: 'dark' } });
    expect(n11.lines.at(-1)).toEqual({
      ch: 'npc',
      name: 'Người đàn bà áo trắng',
      tone: 'whisper',
      text: 'Cháu bịt mắt làm gì. Mặt bà có gì đâu mà sợ.',
      note: 'sát tai',
    });
    expect(t.views.find((v) => v.node === 'm9_n12')!.eyesClosed).toBe(false);
  });

  test('qua M9-14: gọi đúng tên bà Hai', () => {
    const t = run(level, [ASK_SAU, INCENSE, INK, LOOK, 'Hỏi: "Bà là ai?"', '"Bà là bà Hai."', SEVEN, HAI]);
    reached.add(t.state.node);
    expect(t.path).toContain('m9_n14');
    expect(t.state.node).toBe('m9_e1');
  });

  test('không biết tên bà Hai thì không có lựa chọn khấn tên bà, cũng không gọi được tên bà', () => {
    // Ba lượt không bật biet_ten_hai (có hồ sơ nên dùng được c5).
    const s13 = play('m9', [INCENSE, INK, DOSSIER], { from: initialState(level, { unlocked: ['hs_chay_c4_1986'] }) });
    expect(s13.node).toBe('m9_n10');
    expect(s13.flags).not.toContain('biet_ten_hai');
    const at13 = run(level, [LOOK, 'Hỏi: "Bà là ai?"'], { from: s13 }).state;
    const v13 = view(level, at13);
    expect(v13.exit.kind === 'choices' && v13.exit.choices.map((c) => c.text)).toEqual([RUN, 'Mở nắp hũ cho bà']);
    const at23 = run(level, [RUN, SEVEN], { from: at13 }).state;
    const v23 = view(level, at23);
    expect(v23.exit.kind === 'choices' && v23.exit.choices.map((c) => c.text)).toEqual([
      'Khấn sáu tên trên bài vị',
      'Khấn sáu tên, và tên của chính bạn',
    ]);
  });
});

describe('E2 · Bình minh, chưa hết (kết thúc mở)', () => {
  test('khấn sáu tên', () => {
    const t = run(level, [ASK_SAU, INCENSE, INK, LOOK, RUN, SEVEN, 'Khấn sáu tên trên bài vị']);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm9_e2', scene: { bg: 'ban_tho_chieu_nghi', light: 'dawn' } });
    expect(endingView(level, t.state)).toMatchObject({ result: 'survive', cause: 'Bình minh, chưa hết', finale: 'open' });
    // Chơi lại màn 9 để tìm E1, giữ hồ sơ.
    const again = step(level, { ...t.state, unlocked: ['hs_chay_c4_1986'] }, { type: 'restart' });
    expect(again).toMatchObject({ level: 'm9', node: 'm9_n01', sanity: 5, unlocked: ['hs_chay_c4_1986'] });
  });
});

describe('kết cục chết', () => {
  test.each([
    ['M9-12', [LOOK, 'Mở nắp hũ']],
    ['M9-13', [LOOK, 'Hỏi: "Bà là ai?"', 'Mở nắp hũ cho bà']],
  ])('D1 · Nhìn vào hũ từ %s', (_from, tail) => {
    const s = playM9([ASK_SAU, INCENSE, INK, ...tail]);
    expect(s.node).toBe('m9_d1');
    expect(endingView(level, s)!.solution[4]).toEqual({
      id: 'F1',
      ink: 'nau',
      segments: [{ text: 'Hũ của bà ấy phải được mở ra.', mark: 'struck' }],
    });
  });

  test('D2 · Ngã cầu thang: không gắn với dòng luật nào (G44)', () => {
    const s = playM9([ASK_SAU, INCENSE, INK, 'Bịt mắt', 'Giữ khăn, lần xuống cầu thang']);
    expect(s).toMatchObject({ node: 'm9_d2', eyes_closed: true });
    expect(view(level, s).lines).toEqual([
      { ch: 'env', sense: 'chạm', text: 'Bậc thang hụt dưới chân. Bạn rơi vào bóng tối, và không ai đỡ.' },
    ]);
    const node = level.nodes.find((n) => n.id === 'm9_d2')!;
    expect(node.type === 'ending' && [node.violates, node.consequence_of]).toEqual([undefined, undefined]);
  });

  test('D3 · Thiếu hương', () => {
    expect(playM9([ASK_SAU, INCENSE, INK, LOOK, RUN, 'Thắp sáu nén, khấn sáu tên trên bài vị']).node).toBe('m9_d3');
  });

  test('D4 · Khấn tên mình', () => {
    expect(playM9([ASK_SAU, INCENSE, INK, LOOK, RUN, SEVEN, 'Khấn sáu tên, và tên của chính bạn']).node).toBe('m9_d4');
  });
});

describe('c5 chỉ hiện khi có hồ sơ hs_chay_c4_1986', () => {
  const hubChoices = (s: GameState) => {
    const v = view(level, s);
    return v.exit.kind === 'choices' ? v.exit.choices.map((c) => c.text) : [];
  };
  test('không có hồ sơ', () => {
    expect(hubChoices(play('m9', []))).not.toContain(DOSSIER);
  });
  test('có hồ sơ từ màn 1', () => {
    const s = play('m9', [], { from: initialState(level, { unlocked: ['hs_chay_c4_1986'] }) });
    expect(hubChoices(s)).toContain(DOSSIER);
    const t = run(level, [DOSSIER], { from: s });
    expect(t.views.find((v) => v.node === 'm9_n08')!.lines[1]).toEqual({
      ch: 'env',
      sense: 'nhìn',
      text: 'Nhưng biên bản của đội cứu hoả kẹp ở trang cuối ghi: "Tìm thấy bảy người trên tầng 4."',
    });
  });
});

describe('mực, Tỉnh táo và bản méo', () => {
  const L2_FAKE = 'Đừng nhìn vào mặt người đàn bà áo trắng.';
  const L4_FAKE = 'Khi đủ sáu cái tên được khấn, lửa sẽ tắt.';

  test('năm dòng: ba dòng đỏ, L4 máu khô, F1 mực nâu', () => {
    expect(bloodtextPanel(level, play('m9', [])).map((l) => `${l.id}:${l.ink}`)).toEqual([
      'L1:do', 'L2:do', 'L3:do', 'L4:kho', 'F1:nau',
    ]);
  });

  test('L4 mực kho là Huyết tự thật: chọn được từ khoá, được bóp méo', () => {
    expect(level.keywords.filter((k) => k.line === 'L4').map((k) => k.id)).toEqual(['k4', 'k5']);
  });

  test('mức mất tối đa là 3 (c2, M9-10, M9-12), còn 2', () => {
    const s = playM9([BOOK, INCENSE, INK, LOOK, RUN, SEVEN, HAI]);
    expect(s).toMatchObject({ node: 'm9_e1', sanity: 2 });
  });

  test('c2 rồi qua M9-12: bản méo L2 và F1 mực kho ở M9-12', () => {
    const s = play('m9', [BOOK, INCENSE, INK, LOOK]);
    expect(s).toMatchObject({ node: 'm9_n12', sanity: 2 });
    expect(bloodIn(s)).toEqual([
      ['L2', 'do', L2_FAKE],
      ['F1', 'kho', 'Hũ của bà ấy phải được mở ra.'],
    ]);
    // Trong bảng Huyết tự, F1 giờ trông như máu khô giống L4.
    expect(bloodtextPanel(level, s).map((l) => `${l.id}:${l.ink}`)).toEqual(['L1:do', 'L2:do', 'L3:do', 'L4:kho', 'F1:kho']);
    const marked = play('m9', [BOOK, INCENSE, INK, LOOK], { highlights: ['k1'] });
    expect(bloodIn(marked)).toEqual([['F1', 'kho', 'Hũ của bà ấy phải được mở ra.']]);
  });

  test('c2 rồi qua M9-12: bản méo L4 ở M9-20', () => {
    const s = play('m9', [BOOK, INCENSE, INK, LOOK, RUN]);
    expect(s).toMatchObject({ node: 'm9_n20', sanity: 2 });
    expect(bloodIn(s)).toEqual([['L4', 'kho', L4_FAKE]]);
    expect(bloodIn(play('m9', [BOOK, INCENSE, INK, LOOK, RUN], { highlights: ['k4'] }))).toEqual([]);
  });

  test('không có c2 thì M9-12 còn 3, chưa méo', () => {
    const s = play('m9', [ASK_SAU, INCENSE, INK, LOOK]);
    expect(s).toMatchObject({ node: 'm9_n12', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
  });
});

test('màn 9 là màn cuối', () => {
  expect(level.final).toBe(true);
});

test('mọi kết cục của màn 9 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});

describe('cảnh M9-06 (brief tiem_vang_ma_ngoai)', () => {
  test('bà Hoa chờ ở bậc thềm tiệm; về hub thì trở lại căn hộ', () => {
    const t = run(level, [INCENSE]);
    expect(t.views.find((v) => v.node === 'm9_n06')!.scene).toEqual({ bg: 'tiem_vang_ma_ngoai', light: 'normal' });
    expect(t.state).toMatchObject({ node: 'm9_n03', scene: { bg: 'can_ho_304', light: 'normal' } });
  });
});
