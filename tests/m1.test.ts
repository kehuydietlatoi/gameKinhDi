// Màn 1 – Trốn tìm: đường sống, từng kết cục chết, hai bản bóp méo (AGENTS.md mục 6.6, 11).
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, initialState, step, view, type GameState } from '../src/engine/index.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

const level = loadLevel('m1');
const reached = new Set<string>();

/** play() rồi ghi lại kết cục đã tới, để kiểm tra đủ mọi kết cục ở cuối file. */
function playM1(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m1', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}

const panelText = (s: GameState, id: string) =>
  bloodtextPanel(level, s)
    .find((l) => l.id === id)!
    .segments.map((x) => x.text)
    .join('');

// Ba lượt quan sát. CLUE_SANITY mất 2 Tỉnh táo (M1-05, M1-06), nên tới M1-41 còn 2.
const QUIET = ['Nhìn xuống sàn dưới bóng đèn', 'Nói chuyện với cô Hằng', 'Nói chuyện với anh Khải'];
const CLUE_SANITY = ['Xem bảng tin tổ dân phố', 'Nhìn ra cửa sổ kính', 'Nói chuyện với bé Na'];
const SEEK = ['"Tôi sẽ đi tìm."', 'Tiếp tục đếm', 'Đếm tiếp đến một trăm'];
const SEARCH = [
  'Hành lang tầng 2',
  'Nhà vệ sinh chung cuối hành lang',
  'Mở cửa buồng: "Tìm thấy em rồi."',
  'Gầm cầu thang',
  '"Huyết tự chỉ cho một người đi tìm. Người đó là tôi."',
  'Sân phơi tầng thượng',
];

describe('đường sống', () => {
  test('nhận vai đi tìm, tìm đủ 4 nơi, đứng yên chờ gà gáy', () => {
    const t = run(level, [...QUIET, ...SEEK, ...SEARCH, 'Đứng yên, nhắm mắt chờ']);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({
      node: 'm1_e1',
      phase: 'ending',
      role: 'seeker',
      sanity: 4,
      time: '04:00',
      eyes_closed: false,
      deaths: 0,
      unlocked: [],
    });
    expect(t.path).toEqual([
      'm1_n01', 'm1_n02', 'm1_n03', 'm1_n04', 'm1_n07', 'm1_n04', 'm1_n08', 'm1_n04', 'm1_n10',
      'm1_n20', 'm1_n21', 'm1_n40', 'm1_n41', 'm1_n42', 'm1_n50', 'm1_n51', 'm1_n50', 'm1_n52', 'm1_n52b',
      'm1_n50', 'm1_n53', 'm1_n53b', 'm1_n50', 'm1_n54', 'm1_n50', 'm1_n60', 'm1_n61', 'm1_n63', 'm1_e1',
    ]);
    expect(Object.entries(t.state.npc).filter(([, n]) => n.found).map(([id]) => id).sort()).toEqual(
      ['anh_khai', 'bac_tam', 'be_na', 'chi_dung', 'co_hang'],
    );
    const e = endingView(level, t.state)!;
    expect(e).toMatchObject({ result: 'survive', cause: 'Sống sót', dossiers: [] });
    expect(t.state.scene).toEqual({ bg: 'bang_tin_cao_pho_7', light: 'dawn' });
  });

  test('gọi tên ông Lâm, lặng lẽ quay đi; có c1 thì mở khoá hồ sơ', () => {
    const s = playM1(
      [...CLUE_SANITY, ...SEEK, ...SEARCH.slice(0, 4), 'Lặng lẽ quay đi', 'Sân phơi tầng thượng', 'Gọi to: "Ông Lâm! Tìm thấy ông rồi!"'],
      { highlights: ['k2', 'k4', 'k6'] },
    );
    expect(s).toMatchObject({ node: 'm1_e1', sanity: 1, unlocked: ['hs_chay_c4_1986'] });
    expect(s.npc.ong_lam!.found).toBe(true);
    const e = endingView(level, s)!;
    expect(e.dossiers).toEqual(['Vụ cháy nhà C4, 1986']);
    expect(e.keywords).toEqual([
      { id: 'k2', text: 'Một người làm người đi tìm', correct: true },
      { id: 'k4', text: 'bị quỷ tìm thấy', correct: true },
      { id: 'k6', text: 'khi gà gáy', correct: false },
    ]);
  });

  test('Tỉnh táo thấp nhất là 1 nên on_sanity_zero không cần (màn 1, Tổng quan)', () => {
    const s = playM1([...CLUE_SANITY, ...SEEK, ...SEARCH, 'Gọi to: "Ông Lâm! Tìm thấy ông rồi!"']);
    expect(s.sanity).toBe(1);
    expect(level.on_sanity_zero).toBeUndefined();
  });

  test('hub tìm kiếm: số người theo sau và tiếng bước chân', () => {
    const t = run(level, [...QUIET, ...SEEK, ...SEARCH]);
    const hubLines = t.views.filter((v) => v.node === 'm1_n50').map((v) => (v.lines[0] as { text: string }).text);
    expect(hubLines).toEqual([
      'Sau lưng bạn không có ai. Bạn vẫn nghe thấy hai tiếng bước chân.',
      'Sau lưng bạn có 2 người. Bạn nghe thấy 4 tiếng bước chân.',
      'Sau lưng bạn có 3 người. Bạn nghe thấy 5 tiếng bước chân.',
      'Sau lưng bạn có 4 người. Bạn nghe thấy 6 tiếng bước chân.',
      'Sau lưng bạn có 5 người. Bạn nghe thấy 7 tiếng bước chân.',
    ]);
    // Lần vào cuối: đủ 4 nơi nên chỉ còn nút Tiếp tới M1-60 (G4).
    expect(t.views.filter((v) => v.node === 'm1_n50').at(-1)!.exit).toEqual({ kind: 'continue', to: 'm1_n60' });
  });

  test('hub quan sát: 3 lượt, lựa chọn đã chọn bị ẩn, rồi Tiếp tới M1-20', () => {
    const t = run(level, CLUE_SANITY.slice(0, 2));
    const v = view(level, t.state);
    expect(v.exit.kind === 'choices' && v.exit.choices.map((c) => c.text)).toEqual([
      'Nhìn xuống sàn dưới bóng đèn',
      'Nói chuyện với cô Hằng',
      'Nói chuyện với bé Na',
      'Nói chuyện với anh Khải',
    ]);
    const done = run(level, CLUE_SANITY).state;
    expect(done.node).toBe('m1_n20');
    expect(done.actions_left).toBe(0);
  });

  test('M1-20 không giữ ảnh có clue của node quan sát cuối (G4, G22)', () => {
    const s = playM1(['Nói chuyện với cô Hằng', 'Nhìn ra cửa sổ kính', 'Xem bảng tin tổ dân phố']);
    expect(s.node).toBe('m1_n20');
    expect(s.scene).toEqual({ bg: 'phong_sinh_hoat', light: 'flicker' });
  });

  test('M1-20: dòng có clue c1 và lựa chọn nắm tay bé Na chỉ hiện khi đủ điều kiện', () => {
    const without = view(level, play('m1', QUIET));
    expect(without.lines.some((l) => l.ch === 'narration')).toBe(false);
    expect(without.exit.kind === 'choices' && without.exit.choices.length).toBe(4);
    const withClues = view(level, play('m1', CLUE_SANITY));
    expect(withClues.lines.at(-1)).toEqual({ ch: 'narration', text: 'Sáu khuôn mặt trên tờ cáo phó đang nhìn bạn.' });
    expect(withClues.exit.kind === 'choices' && withClues.exit.choices.map((c) => c.text)).toContain(
      'Nắm tay bé Na: "Anh trốn với em."',
    );
  });

  test('nhắm mắt khi đếm: màn hình đen; mở mắt ở M1-42', () => {
    const t = run(level, [...QUIET, '"Tôi sẽ đi tìm."']);
    expect(t.state.node).toBe('m1_n40');
    expect(view(level, t.state).scene.light).toBe('dark');
    const at42 = run(level, ['Tiếp tục đếm', 'Đếm tiếp đến một trăm'], { from: t.state }).views.find((v) => v.node === 'm1_n42')!;
    expect(at42.eyesClosed).toBe(false);
    expect(at42.lines.some((l) => l.ch === 'env')).toBe(true);
  });
});

describe('kết cục chết', () => {
  test('D1 · Từ chối chơi (vi phạm L1)', () => {
    const s = playM1([...QUIET, '"Tôi không chơi."']);
    expect(s).toMatchObject({ node: 'm1_d1', phase: 'ending', deaths: 1, scene: { bg: null, light: 'dark' } });
    const e = endingView(level, s)!;
    expect(e).toMatchObject({ result: 'death', cause: 'Từ chối chơi', reveal: 'Vi phạm L1: tất cả phải chơi.' });
    expect(e.solution[0]).toEqual({
      id: 'L1',
      ink: 'do',
      segments: [{ text: 'Tất cả những ai đang ở trong phòng này phải chơi trốn tìm.', mark: 'solution' }],
    });
    expect(view(level, s).lines[0]).toMatchObject({ ch: 'bloodtext', glow: true });
  });

  describe('D2 · Bị tìm thấy (người trốn)', () => {
    const spots = [
      ['Tủ gỗ dưới gầm cầu thang', 'tu_go', { bg: 'phong_sinh_hoat', light: 'dark' }],
      ['Nhà vệ sinh chung cuối hành lang', 'wc', { bg: 'nha_ve_sinh_chung', light: 'flicker' }],
      ['Sân phơi tầng thượng, giữa những hàng chăn', 'san_phoi', { bg: 'san_phoi', light: 'normal' }],
    ] as const;

    test.each(spots)('để anh Khải đi tìm → %s', (choice, spot, scene) => {
      const t = run(level, [...QUIET, '"Để anh Khải đi tìm."', choice]);
      expect(t.state).toMatchObject({ node: 'm1_n31', role: 'hider', spot, scene, sanity: 4 });
      const s = playM1(['Nín thở, giữ im lặng'], { from: t.state });
      expect(s.node).toBe('m1_d2');
    });

    test('bốc thăm → lao ra chạy', () => {
      const s = playM1([...QUIET, '"Bốc thăm cho công bằng."', 'Nhà vệ sinh chung cuối hành lang', 'Lao ra chạy']);
      expect(s).toMatchObject({ node: 'm1_d2', role: 'hider' });
    });

    test('nắm tay bé Na: bỏ qua bước chọn chỗ trốn, vào thẳng tủ gỗ (G12)', () => {
      const t = run(level, [...CLUE_SANITY, 'Nắm tay bé Na: "Anh trốn với em."']);
      expect(t.path.slice(-3)).toEqual(['m1_n20', 'm1_n30', 'm1_n31']);
      expect(t.state).toMatchObject({ spot: 'tu_go', role: 'hider', scene: { light: 'dark' } });
      expect(view(level, t.state).lines[0]).toEqual({ ch: 'env', sense: 'ngửi', text: 'Trong tủ tối om, mùi long não và gỗ mục.' });
      const s = playM1(['Nín thở, giữ im lặng'], { from: t.state });
      expect(s.node).toBe('m1_d2');
      expect(endingView(level, s)!.solution[3]!.segments).toEqual([
        { text: 'Kẻ nào ' },
        { text: 'bị quỷ tìm thấy', mark: 'solution' },
        { text: ' sẽ chết.' },
      ]);
    });
  });

  test.each([
    ['M1-40', ['Mở mắt, quay lại']],
    ['M1-41', ['Tiếp tục đếm', 'Mở mắt']],
  ])('D3 · Mở mắt khi đếm từ %s (vi phạm L3)', (_from, tail) => {
    const s = playM1([...QUIET, '"Tôi sẽ đi tìm."', ...tail]);
    expect(s).toMatchObject({ node: 'm1_d3', eyes_closed: false });
    // Dòng cuối là env nhìn: phải hiện được vì đã mở mắt (spec-changes: sửa docs 3.1).
    expect(view(level, s).lines).toEqual([{ ch: 'env', sense: 'nhìn', text: 'Sáu khuôn mặt cháy sém kề sát mặt bạn.' }]);
    expect(endingView(level, s)!.solution[2]!.segments).toEqual([
      { text: 'Người đi tìm ' },
      { text: 'đếm đến một trăm rồi mới được mở mắt', mark: 'solution' },
      { text: '.' },
    ]);
  });

  test('màn hình chết: nhãn dòng, dòng bị vi phạm, không có bản méo khi còn tỉnh táo (G47)', () => {
    const s = playM1([...QUIET, '"Tôi sẽ đi tìm."', 'Mở mắt, quay lại']);
    const e = endingView(level, s)!;
    expect(e.labels).toEqual(['L1', 'L2', 'L3', 'L4', 'L5']);
    expect(e.violates).toEqual(['L3']);
    expect(e.misread).toEqual([]);
  });

  test('màn hình chết: chết vì tin bản méo thì hiện lại câu đã đọc (G47)', () => {
    const s = playM1([...CLUE_SANITY, '"Tôi sẽ đi tìm."', 'Mở mắt, quay lại']);
    expect(s).toMatchObject({ node: 'm1_d3', sanity: 2, highlights: [] });
    const e = endingView(level, s)!;
    expect(e.misread.map((l) => [l.id, l.segments.map((x) => x.text).join('')])).toEqual([
      ['L3', 'Người đi tìm được mở mắt khi có người gọi.'],
      ['L4', 'Kẻ nào đi tìm sẽ chết.'],
    ]);
    // Đánh dấu đúng cụm thì dòng đó không méo nên không hiện lại.
    const marked = playM1([...CLUE_SANITY, '"Tôi sẽ đi tìm."', 'Mở mắt, quay lại'], { highlights: ['k3'] });
    expect(endingView(level, marked)!.misread.map((l) => l.id)).toEqual(['L4']);
  });

  test('kết cục sống không có dòng vi phạm hay bản méo (G47)', () => {
    const e = endingView(level, playM1([...QUIET, ...SEEK, ...SEARCH, 'Đứng yên, nhắm mắt chờ']))!;
    expect(e).toMatchObject({ result: 'survive', violates: [], misread: [] });
  });

  test('D4 · Đổi lượt', () => {
    const s = playM1([...QUIET, ...SEEK, 'Gầm cầu thang', '"Được, đổi lượt."']);
    expect(s.node).toBe('m1_d4');
    expect(endingView(level, s)!.reveal).toBe('Đổi lượt nghĩa là trở thành người trốn, tức là chờ bị quỷ tìm thấy.');
  });

  test.each([
    ['M1-52', ['Nhà vệ sinh chung cuối hành lang', 'Lách vào buồng, đóng cửa lại']],
    ['M1-60', [...SEARCH, 'Chui xuống gầm bàn']],
  ])('D5 · Trốn giữa chừng từ %s', (_from, tail) => {
    const s = playM1([...QUIET, ...SEEK, ...tail]);
    expect(s.node).toBe('m1_d5');
    expect(view(level, s).lines).toEqual([{ ch: 'npc', name: 'Tất cả', tone: 'whisper', text: 'Tìm thấy rồi.' }]);
  });

  test('Chơi lại sau khi chết: về M1-01, giữ số lần chết, xoá đánh dấu', () => {
    const dead = playM1([...QUIET, '"Tôi không chơi."'], { highlights: ['k1'] });
    const again = step(level, dead, { type: 'restart' });
    expect(again).toEqual(initialState(level, { deaths: 1 }));
    expect(again).toMatchObject({ node: 'm1_n01', highlights: [], highlightDone: false, sanity: 5 });
  });
});

describe('bóp méo (sanity ≤ 2 và chưa đánh dấu)', () => {
  const toN41 = [...CLUE_SANITY, '"Tôi sẽ đi tìm."', 'Tiếp tục đếm'];
  const toN53 = [...CLUE_SANITY, ...SEEK, 'Gầm cầu thang'];
  const L3_FAKE = 'Người đi tìm được mở mắt khi có người gọi.';
  const L3_REAL = 'Người đi tìm đếm đến một trăm rồi mới được mở mắt.';
  const L4_FAKE = 'Kẻ nào đi tìm sẽ chết.';
  const L4_REAL = 'Kẻ nào bị quỷ tìm thấy sẽ chết.';
  const bloodIn = (s: GameState) =>
    view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => b.segments.map((x) => x.text).join('')) : []));

  test('L3 ở M1-41: hiện bản méo trong node và trong nút Huyết tự', () => {
    const s = play('m1', toN41);
    expect(s).toMatchObject({ node: 'm1_n41', sanity: 2 });
    expect(bloodIn(s)).toEqual([L3_FAKE]);
    expect(panelText(s, 'L3')).toBe(L3_FAKE);
    expect(level.bloodtext.find((b) => b.id === 'L3')!.text).toBe(L3_REAL); // dữ liệu giữ bản gốc
  });

  test('L3: đã đánh dấu k3 thì không méo và dòng trong node không hiện', () => {
    const s = play('m1', toN41, { highlights: ['k3'] });
    expect(bloodIn(s)).toEqual([]);
    expect(panelText(s, 'L3')).toBe(L3_REAL);
  });

  test('L3: sanity 3 thì không méo', () => {
    const s = play('m1', ['Xem bảng tin tổ dân phố', ...QUIET.slice(0, 2), '"Tôi sẽ đi tìm."', 'Tiếp tục đếm']);
    expect(s).toMatchObject({ node: 'm1_n41', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
    expect(panelText(s, 'L3')).toBe(L3_REAL);
  });

  test('L4 ở M1-53: hiện bản méo trong node và trong nút Huyết tự', () => {
    const s = play('m1', toN53);
    expect(s).toMatchObject({ node: 'm1_n53', sanity: 2 });
    expect(bloodIn(s)).toEqual([L4_FAKE]);
    expect(panelText(s, 'L4')).toBe(L4_FAKE);
  });

  test('L4: đã đánh dấu k4 thì không méo; chỉ đánh dấu k5 thì vẫn méo', () => {
    const marked = play('m1', toN53, { highlights: ['k4'] });
    expect(bloodIn(marked)).toEqual([]);
    expect(panelText(marked, 'L4')).toBe(L4_REAL);
    const wrong = play('m1', toN53, { highlights: ['k5'] });
    expect(bloodIn(wrong)).toEqual([L4_FAKE]);
    // k5 "sẽ chết" vẫn được gạch chân trong bản méo vì cụm đó có mặt nguyên văn.
    expect(bloodtextPanel(level, wrong)[3]!.segments).toEqual([
      { text: 'Kẻ nào đi tìm ' },
      { text: 'sẽ chết', mark: 'highlighted' },
      { text: '.' },
    ]);
  });

  test('các dòng không có bản méo luôn hiện bản gốc', () => {
    const s = play('m1', toN53);
    for (const id of ['L1', 'L2', 'L5']) expect(panelText(s, id)).toBe(level.bloodtext.find((b) => b.id === id)!.text);
  });
});

// Chạy sau cùng (Vitest chạy test trong file theo thứ tự khai báo).
test('mọi kết cục của màn đều có test đi tới (AGENTS.md mục 6.6)', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});
