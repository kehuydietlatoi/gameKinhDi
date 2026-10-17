// Màn 2 – Canh linh cữu: theo mục "Kiểm tra nhanh" của docs/man-2-canh-linh-cuu.md.
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, initialState, view, type GameState } from '../src/engine/index.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

const level = loadLevel('m2');
const reached = new Set<string>();

function playM2(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m2', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}

// Hai lượt ở hub căn hộ. QUIET không mất Tỉnh táo; MIRROR mất 1 (c2).
const QUIET = ['Đọc tờ giấy luồn qua khe cửa', 'Gõ vách sang phòng 305'];
const MIRROR = ['Soi gương', 'Mở tủ quần áo'];
const TO_DARK = ['Nằm xuống giường'];
const LIE_STILL = ['Nằm yên lắng nghe', 'Im lặng', 'Nhắm chặt mắt hết sức', 'Nằm yên'];
const TO_N40 = [...QUIET, ...TO_DARK, ...LIE_STILL];
const SURVIVE = [...TO_N40, 'Nằm yên, đếm tiếng gà', 'Ngồi dậy, bước ra khỏi quan tài, rồi mới mở mắt'];

const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => b.segments.map((x) => x.text).join('')) : []));
const panelText = (s: GameState, id: string) =>
  bloodtextPanel(level, s)
    .find((l) => l.id === id)!
    .segments.map((x) => x.text)
    .join('');

describe('đường sống', () => {
  test('nằm yên, đếm đủ ba tiếng gà, bước ra rồi mới mở mắt: mất tối thiểu 3, còn 2', () => {
    const t = run(level, SURVIVE);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm2_e1', phase: 'ending', sanity: 2, eyes_closed: false, time: '05:30' });
    expect(t.state.scene).toEqual({ bg: 'phong_sinh_hoat_tang', light: 'dawn' });
    expect(t.path).toEqual([
      'm2_n01', 'm2_n02', 'm2_n03', 'm2_n04', 'm2_n03', 'm2_n07', 'm2_n03', 'm2_n08', 'm2_n09', 'm2_n10',
      'm2_n11', 'm2_n20', 'm2_n21', 'm2_n30', 'm2_n31', 'm2_n40', 'm2_n50', 'm2_n51', 'm2_e1',
    ]);
    const e = endingView(level, t.state)!;
    expect(e).toMatchObject({ result: 'survive', cause: 'Sống sót' });
    expect(e.solution.flatMap((l) => l.segments.filter((x) => x.mark === 'solution').map((x) => x.text))).toEqual([
      'Người trong quan tài',
      'người nằm được dậy',
    ]);
  });

  test('đường sống qua mọi nhánh không chết: xuống phòng, sờ quanh người, hét lên, ngồi dậy rồi nằm xuống', () => {
    const t = run(level, [
      'Mở tủ quần áo', 'Gõ vách sang phòng 305', 'Xuống phòng sinh hoạt chung',
      'Đưa tay sờ quanh người', 'Im lặng', 'Hét lên: "Buông ra!"', 'Ngồi dậy (vẫn nhắm mắt)', 'Nằm xuống',
      'Nằm yên, đếm tiếng gà', 'Ngồi dậy, bước ra khỏi quan tài, rồi mới mở mắt',
    ]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm2_e1', sanity: 1, flags: ['di_xuong', 'ngoi_day'] });
    expect(t.state.clues).toEqual(['c3', 'c4', 'c5']);
    expect(t.path).toContain('m2_n12');
    expect(t.path).toContain('m2_n32');
  });

  test('nhắm mắt từ M2-10 đến trước M2-51: màn hình đen và không có giờ (G24)', () => {
    const t = run(level, SURVIVE);
    const closed = t.views.filter((v) => ['m2_n10', 'm2_n11', 'm2_n20', 'm2_n21', 'm2_n30', 'm2_n31', 'm2_n40', 'm2_n50'].includes(v.node));
    expect(closed.length).toBeGreaterThan(0);
    for (const v of closed) {
      expect(v.eyesClosed).toBe(true);
      expect(v.scene.light).toBe('dark');
      expect(v.time).toBeNull();
      expect(v.lines.some((l) => l.ch === 'env' && l.sense === 'nhìn')).toBe(false);
    }
    const n51 = t.views.find((v) => v.node === 'm2_n51')!;
    expect(n51).toMatchObject({ eyesClosed: false, time: '05:30', scene: { bg: 'phong_sinh_hoat_tang', light: 'dawn' } });
    expect(n51.lines.filter((l) => l.ch === 'env' && l.sense === 'nhìn')).toHaveLength(2);
  });

  test('dòng có điều kiện: đi xuống / nằm xuống, lên tiếng, ngồi dậy', () => {
    const down = run(level, [...QUIET, 'Xuống phòng sinh hoạt chung']).views.find((v) => v.node === 'm2_n09')!;
    expect(down.lines[0]).toEqual({
      ch: 'narration',
      text: 'Bạn bước xuống cầu thang. Đến chiếu nghỉ tầng 2 thì hai chân khuỵu xuống.',
    });
    const bed = run(level, [...QUIET, 'Nằm xuống giường']).views.find((v) => v.node === 'm2_n09')!;
    expect(bed.lines[0]).toEqual({ ch: 'narration', text: 'Bạn nằm xuống. Chăn lạnh như vừa giặt xong chưa phơi.' });

    const spoke = run(level, [...QUIET, ...TO_DARK, 'Nằm yên lắng nghe', 'Lên tiếng: "Còn tôi."']).views.find(
      (v) => v.node === 'm2_n20',
    )!;
    expect(spoke.lines.at(-1)).toEqual({ ch: 'npc', name: 'Chị Mai', tone: 'whisper', text: 'Bà… bà là ai thế?' });

    const sat = run(level, [...QUIET, ...TO_DARK, 'Nằm yên lắng nghe', 'Im lặng', 'Nhắm chặt mắt hết sức', 'Ngồi dậy (vẫn nhắm mắt)', 'Nằm xuống']);
    expect(sat.state.node).toBe('m2_n40');
    const n31 = sat.views.find((v) => v.node === 'm2_n31')!;
    expect(n31.lines[0]).toEqual({ ch: 'npc', name: 'Anh Phong', tone: 'normal', text: 'Đuổi được con mèo rồi.' });
    const lay = run(level, TO_N40).views.find((v) => v.node === 'm2_n31')!;
    expect(lay.lines[0]).toMatchObject({ ch: 'sound', src: 'cửa phòng' });
  });

  test('anh_phong và phong_gia đều hiện "Anh Phong" (G25)', () => {
    const t = run(level, TO_N40);
    const n11 = t.views.find((v) => v.node === 'm2_n11')!;
    const n31 = t.views.find((v) => v.node === 'm2_n31')!;
    expect(n11.lines.find((l) => l.ch === 'npc' && l.text === 'Phong đây. Nhanh lên cho xong.')).toMatchObject({ name: 'Anh Phong' });
    expect(n31.lines.find((l) => l.ch === 'npc')).toMatchObject({ name: 'Anh Phong', text: 'Đuổi được con mèo rồi.' });
  });
});

describe('D1 · Mở mắt giữa đêm (vi phạm L2), từ cả bốn node', () => {
  test.each([
    ['M2-10', [...QUIET, ...TO_DARK, 'Mở mắt']],
    ['M2-20', [...QUIET, ...TO_DARK, 'Nằm yên lắng nghe', 'Im lặng', 'Để yên, không phản ứng']],
    ['M2-32', [...QUIET, ...TO_DARK, 'Nằm yên lắng nghe', 'Im lặng', 'Nhắm chặt mắt hết sức', 'Ngồi dậy (vẫn nhắm mắt)', 'Mở mắt']],
    ['M2-40', [...TO_N40, 'Mở mắt']],
  ])('từ %s', (_from, choices) => {
    const s = playM2(choices);
    expect(s).toMatchObject({ node: 'm2_d1', eyes_closed: false, deaths: 1 });
    // Dòng cuối là env nhìn: phải hiện được vì đã mở mắt.
    expect(view(level, s).lines).toEqual([
      { ch: 'env', sense: 'nhìn', text: 'Ngay trên mặt bạn là một khuôn mặt đàn bà, hai hốc mắt trống, đang mỉm cười.' },
    ]);
    expect(endingView(level, s)!.cause).toBe('Mở mắt giữa đêm');
  });
});

describe('các kết cục chết khác', () => {
  test('D2 · Rời phòng sớm (vi phạm L3)', () => {
    const s = playM2([...TO_N40, 'Ngồi dậy, lần ra cửa (vẫn nhắm mắt)']);
    expect(s.node).toBe('m2_d2');
    expect(view(level, s).lines[0]).toMatchObject({ ch: 'sound', src: 'hành lang', vol: 3 });
    expect(endingView(level, s)!.solution[2]!.segments).toEqual([
      { text: 'Không ai được rời khỏi phòng ' },
      { text: 'trước khi gà gáy ba tiếng', mark: 'solution' },
      { text: '.' },
    ]);
  });

  test('D3 · Mở mắt khi còn trong quan tài (vi phạm L2)', () => {
    const s = playM2([...TO_N40, 'Nằm yên, đếm tiếng gà', 'Mở mắt']);
    expect(s).toMatchObject({ node: 'm2_d3', eyes_closed: false });
    expect(view(level, s).lines[0]).toMatchObject({ ch: 'env', sense: 'nhìn' });
  });

  test('D4 · Hoảng loạn: đi đủ mọi lựa chọn mất Tỉnh táo; lần mất thứ năm (ngồi dậy) đưa về 0 ở M2-32', () => {
    // c2, lên tiếng, M2-20, M2-30, ngồi dậy: 5 lần, nên chưa tới M2-40 đã về 0.
    const t = run(level, [
      ...MIRROR, ...TO_DARK, 'Nằm yên lắng nghe', 'Lên tiếng: "Còn tôi."', 'Nhắm chặt mắt hết sức',
      'Ngồi dậy (vẫn nhắm mắt)',
    ]);
    reached.add(t.state.node);
    const n32 = t.views.find((v) => v.node === 'm2_n32')!;
    expect(n32.sanity).toBe(0);
    expect(n32.lines.length).toBeGreaterThan(0); // dòng của M2-32 vẫn hiện (G13)
    expect(n32.exit).toEqual({ kind: 'continue', to: 'm2_n90' });
    expect(t.path.slice(-3)).toEqual(['m2_n32', 'm2_n90', 'm2_d4']);
    expect(t.views.find((v) => v.node === 'm2_n90')!.exit).toEqual({ kind: 'continue', to: 'm2_d4' });
    expect(t.state).toMatchObject({ node: 'm2_d4', sanity: 0, eyes_closed: false });
    expect(view(level, t.state).lines).toEqual([
      { ch: 'env', sense: 'nhìn', text: 'Ánh nến. Những khuôn mặt cúi nhìn xuống bạn. Một khuôn mặt ướt sũng.' },
    ]);
    expect(endingView(level, t.state)!.reveal).toBe('Tỉnh táo về 0 khi bạn vẫn ở trong quan tài.');
  });

  test('D4 qua M2-40: lên tiếng và ngồi dậy (không soi gương) thì về 0 đúng ở M2-40', () => {
    const t = run(level, [
      ...QUIET, ...TO_DARK, 'Nằm yên lắng nghe', 'Lên tiếng: "Còn tôi."', 'Nhắm chặt mắt hết sức',
      'Ngồi dậy (vẫn nhắm mắt)', 'Nằm xuống',
    ]);
    reached.add(t.state.node);
    const n40 = t.views.find((v) => v.node === 'm2_n40')!;
    expect(n40.sanity).toBe(0);
    expect(n40.exit).toEqual({ kind: 'continue', to: 'm2_n90' });
    expect(t.path.slice(-3)).toEqual(['m2_n40', 'm2_n90', 'm2_d4']);
  });

  test('mất 4 (lên tiếng, M2-20, M2-30, M2-40) thì vẫn sống được, còn 1', () => {
    const s = playM2([...QUIET, ...TO_DARK, 'Nằm yên lắng nghe', 'Lên tiếng: "Còn tôi."', 'Nhắm chặt mắt hết sức', 'Nằm yên', 'Nằm yên, đếm tiếng gà', 'Ngồi dậy, bước ra khỏi quan tài, rồi mới mở mắt']);
    expect(s).toMatchObject({ node: 'm2_e1', sanity: 1 });
  });
});

describe('bản méo L2 và L4 ở M2-40', () => {
  const L2_FAKE = 'Người canh linh cữu tuyệt đối không được mở mắt.';
  const L2_REAL = 'Người trong quan tài tuyệt đối không được mở mắt.';
  const L4_FAKE = 'Khi gà gáy, tất cả được mở mắt.';
  const L4_REAL = 'Khi gà gáy ba tiếng, người canh được về, người nằm được dậy.';

  test('đường tối thiểu tới M2-40 còn sanity 2: cả hai bản méo hiện khi chưa đánh dấu', () => {
    const s = play('m2', TO_N40);
    expect(s).toMatchObject({ node: 'm2_n40', sanity: 2 });
    expect(bloodIn(s)).toEqual([L2_FAKE, L4_FAKE]);
    expect(panelText(s, 'L2')).toBe(L2_FAKE);
    expect(panelText(s, 'L4')).toBe(L4_FAKE);
  });

  test('đánh dấu k2: L2 giữ bản gốc, L4 vẫn méo', () => {
    const s = play('m2', TO_N40, { highlights: ['k2'] });
    expect(bloodIn(s)).toEqual([L4_FAKE]);
    expect(panelText(s, 'L2')).toBe(L2_REAL);
  });

  test('đánh dấu k6: L4 giữ bản gốc, L2 vẫn méo', () => {
    const s = play('m2', TO_N40, { highlights: ['k6'] });
    expect(bloodIn(s)).toEqual([L2_FAKE]);
    expect(panelText(s, 'L4')).toBe(L4_REAL);
  });

  test('đánh dấu cả k2 và k6: không dòng nào méo', () => {
    const s = play('m2', TO_N40, { highlights: ['k2', 'k6'] });
    expect(bloodIn(s)).toEqual([]);
    expect(panelText(s, 'L2')).toBe(L2_REAL);
    expect(panelText(s, 'L4')).toBe(L4_REAL);
  });

  test('đánh dấu k3 (cùng dòng L2 nhưng không phải cụm bảo vệ) không ngăn bản méo', () => {
    expect(bloodIn(play('m2', TO_N40, { highlights: ['k3'] }))).toEqual([L2_FAKE, L4_FAKE]);
  });

  test('trước M2-40 (sanity 3) chưa méo', () => {
    const s = play('m2', [...QUIET, ...TO_DARK, ...LIE_STILL.slice(0, 3)]);
    expect(s).toMatchObject({ node: 'm2_n30', sanity: 3 });
    expect(panelText(s, 'L2')).toBe(L2_REAL);
  });
});

describe('chuyển màn (G23, G33)', () => {
  test('vào màn 2 luôn với Tỉnh táo 5, mang theo hồ sơ màn 1', () => {
    const s = initialState(level, { unlocked: ['hs_chay_c4_1986'] });
    expect(s).toMatchObject({ level: 'm2', node: 'm2_n01', sanity: 5, actions_left: 2, time: '22:00', unlocked: ['hs_chay_c4_1986'] });
    expect(s.scene).toEqual({ bg: 'can_ho_304', light: 'normal' });
  });
});

// Chạy sau cùng (Vitest chạy test trong file theo thứ tự khai báo).
test('mọi kết cục của màn 2 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});

describe('cảnh M2-09 (brief cau_thang_chieu_nghi)', () => {
  test('đi xuống thì thấy cầu thang; nằm xuống giường thì vẫn ở căn hộ', () => {
    const down = run(level, [...QUIET, 'Xuống phòng sinh hoạt chung']).views.find((v) => v.node === 'm2_n09')!;
    expect(down.scene).toEqual({ bg: 'cau_thang_chieu_nghi', light: 'flicker' });
    const bed = run(level, [...QUIET, 'Nằm xuống giường']).views.find((v) => v.node === 'm2_n09')!;
    expect(bed.scene).toEqual({ bg: 'can_ho_304', light: 'normal' });
  });
});
