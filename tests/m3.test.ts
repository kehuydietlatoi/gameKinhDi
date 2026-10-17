// Màn 3 – Hình nhân thế mạng: theo mục "Kiểm tra nhanh" của docs/man-3-hinh-nhan-the-mang.md.
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, initialState, view, type GameState } from '../src/engine/index.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

const level = loadLevel('m3');
const reached = new Set<string>();

function playM3(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m3', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}

const SHOP = 'Xuống tiệm vàng mã bà Hoa';
const ALTAR = 'Xem bàn thờ chung ở chiếu nghỉ';
const BOOK = 'Mượn sổ hộ khẩu tập thể của bà Sáu';
const PEEK = 'Nhìn qua khe cửa 404';
const BIN = 'Nói chuyện với thằng Bin';
const QUY = 'Nói chuyện với ông Quý';
const PUPPET = 'Dùng hình nhân giấy';
const PLACE = 'Đặt hình nhân ở ngưỡng cửa rồi buông tay';
const WAIT = 'Chờ đến sáng';

/** Đường E1 ngắn nhất: c6 + c1 + một hành động bất kỳ → M3-20 → hình nhân → tên → ngưỡng cửa → M3-40. */
const e1 = (name: string, third = BOOK) => [SHOP, ALTAR, third, PUPPET, name, PLACE, WAIT, 'Tiếp'];
const flagsSet = (s: GameState) => s.flags.filter((f) => f.startsWith('chet_'));

const panelText = (s: GameState, id: string) =>
  bloodtextPanel(level, s)
    .find((l) => l.id === id)!
    .segments.map((x) => x.text)
    .join('');

describe('E1 · Không ai chết', () => {
  test.each([
    ['"Tâm"', 'ten_tam', { name: 'Bác Tâm', text: 'Cảm ơn cháu.' }],
    ['"Na"', 'ten_na', { name: 'Bé Na', text: 'Em cảm ơn anh.' }],
  ])('viết %s', (name, flag, thanks) => {
    const t = run(level, e1(name));
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm3_e1', phase: 'ending', time: '05:30' });
    expect(t.state.flags).toEqual(expect.arrayContaining(['co_hinh_nhan', 'ten_dung', flag]));
    expect(flagsSet(t.state)).toEqual([]);
    const n33 = t.views.find((v) => v.node === 'm3_n33')!;
    expect(n33.lines.at(-1)).toEqual({ ch: 'npc', tone: 'whisper', ...thanks });
    expect(n33.lines.filter((l) => l.ch === 'npc')).toHaveLength(1);
    const n40 = t.views.find((v) => v.node === 'm3_n40')!;
    expect(n40.lines).toEqual([
      { ch: 'env', sense: 'nhìn', text: 'Trời hửng sáng. Hành lang tầng 4 ngả màu xám nhạt.' },
      { ch: 'npc', name: 'Thằng Bin', tone: 'normal', text: 'Anh ơi, sáng rồi. Mọi người vẫn đủ cả.' },
    ]);
    expect(n40.exit).toEqual({ kind: 'choices', choices: [{ index: 0, text: 'Tiếp' }] });
    const e = endingView(level, t.state)!;
    expect(e).toMatchObject({ result: 'survive', cause: 'Không ai chết' });
    expect(e.solution.flatMap((l) => l.segments.filter((x) => x.mark === 'solution').map((x) => x.text))).toEqual([
      'một người',
      'chỉ nhận người có tên',
      'Người có tên trong phòng 404',
    ]);
  });

  test('thời gian: 20:00, mỗi lượt hub +1 giờ, M3-20 đặt 23:30', () => {
    const t = run(level, [SHOP, ALTAR, BOOK]);
    expect(t.views.find((v) => v.node === 'm3_n13')!.time).toBe('23:00');
    expect(t.state).toMatchObject({ node: 'm3_n20', time: '23:30' });
  });

  test('hub: sau 3 lượt thì tới M3-20; lựa chọn đã chọn bị ẩn', () => {
    const t = run(level, [SHOP, ALTAR]);
    const v = view(level, t.state);
    expect(v.exit.kind === 'choices' && v.exit.choices.map((c) => c.text)).toEqual([BOOK, PEEK, BIN, QUY]);
  });
});

describe('E2 · Có người chết thay: mỗi cách bật đúng một cờ chet_*', () => {
  test.each([
    ['để ông Quý vào', [BOOK, BIN, QUY, 'Để ông Quý vào'], 'chet_quy', 'Cửa phòng 403 khép hờ. Điếu cày của ông Quý nằm lăn lóc trước cửa 404.'],
    ['bốc thăm', [BOOK, BIN, PEEK, '"Bốc thăm đi."'], 'chet_lien', 'Trước cửa 404 có một đôi dép nhựa của cô Liên, xếp ngay ngắn.'],
    ['viết "Quý"', [SHOP, BOOK, BIN, PUPPET, '"Quý"', PLACE, WAIT], 'chet_quy', 'Cửa phòng 403 khép hờ. Điếu cày của ông Quý nằm lăn lóc trước cửa 404.'],
    ['viết "Lâm" (thằng Bin chết)', [SHOP, ALTAR, QUY, PUPPET, '"Lâm"', PLACE, WAIT], 'chet_bin', 'Bà Sáu ngồi bệt trước cửa phòng 401, khóc không thành tiếng.'],
  ])('%s', (_name, choices, flag, line) => {
    const t = run(level, [...choices, 'Tiếp']);
    reached.add(t.state.node);
    expect(t.state.node).toBe('m3_e2');
    expect(flagsSet(t.state)).toEqual([flag]);
    expect(t.state.flags).not.toContain('ten_dung');
    const n40 = t.views.find((v) => v.node === 'm3_n40')!;
    expect(n40.lines).toEqual([
      { ch: 'env', sense: 'nhìn', text: 'Trời hửng sáng. Hành lang tầng 4 ngả màu xám nhạt.' },
      { ch: 'env', sense: 'nhìn', text: line },
    ]);
    const e = endingView(level, t.state)!;
    expect(e).toMatchObject({ result: 'survive', cause: 'Có người chết thay' });
    expect(view(level, t.state).lines).toEqual([{ ch: 'narration', text: 'Tòa nhà vẫn đứng nguyên. Chỉ thiếu đi một người.' }]);
  });

  test('không có c1 thì không viết được "Tâm", "Na", "Lâm"', () => {
    const s = play('m3', [SHOP, BOOK, BIN, PUPPET]);
    const v = view(level, s);
    expect(v.exit.kind === 'choices' && v.exit.choices.map((c) => c.text)).toEqual(['Tên của bạn', '"Quý"', 'Không viết gì']);
  });

  test('không có hình nhân thì không có lựa chọn dùng hình nhân', () => {
    const v = view(level, play('m3', [ALTAR, BOOK, BIN]));
    expect(v.exit.kind === 'choices' && v.exit.choices.map((c) => c.text)).toEqual([
      '"Tôi sẽ vào."',
      'Để ông Quý vào',
      '"Bốc thăm đi."',
      '"Không ai vào cả."',
    ]);
  });
});

describe('kết cục chết', () => {
  test('D1 · Không ai vào (vi phạm L1, hệ quả L2)', () => {
    const s = playM3([BOOK, BIN, QUY, '"Không ai vào cả."']);
    expect(s.node).toBe('m3_d1');
    const e = endingView(level, s)!;
    expect(e.solution[0]).toEqual({
      id: 'L1',
      ink: 'do',
      segments: [{ text: 'Đêm nay, trước khi đồng hồ điểm mười hai tiếng, phải có một người bước vào phòng 404.', mark: 'solution' }],
    });
  });

  test.each([
    ['M3-20', [BOOK, BIN, QUY, '"Tôi sẽ vào."']],
    ['M3-31', [SHOP, ALTAR, BIN, PUPPET, '"Tâm"', 'Ôm hình nhân bước vào phòng']],
  ])('D2 · Tự bước vào từ %s', (_from, choices) => {
    const t = run(level, choices);
    reached.add(t.state.node);
    expect(t.path.slice(-2)).toEqual(['m3_n21', 'm3_d2']);
    expect(t.views.find((v) => v.node === 'm3_n21')!.scene.light).toBe('dark');
    expect(t.state.scene).toEqual({ bg: null, light: 'dark' });
    expect(view(level, t.state).lines).toEqual([
      { ch: 'env', sense: 'chạm', text: 'Trong bóng tối, những bàn tay giấy khô xào xạc chạm vào mặt bạn.' },
    ]);
  });

  test('D3 · Tên của mình: chỉ một lựa chọn "Chờ đến sáng" hiện, và nó dẫn tới D3', () => {
    const t = run(level, [SHOP, BOOK, BIN, PUPPET, 'Tên của bạn', PLACE]);
    expect(t.state.node).toBe('m3_n33');
    const v = view(level, t.state);
    expect(v.exit).toEqual({ kind: 'choices', choices: [{ index: 1, text: WAIT }] });
    const s = playM3([WAIT], { from: t.state });
    expect(s.node).toBe('m3_d3');
  });

  test('D4 · Hình nhân không tên', () => {
    const t = run(level, [SHOP, BOOK, BIN, PUPPET, 'Không viết gì']);
    expect(view(level, t.state).lines).toEqual([{ ch: 'env', sense: 'nhìn', text: 'Ngực hình nhân vẫn trắng trơn.' }]);
    const v = view(level, t.state);
    expect(v.exit.kind === 'choices' && v.exit.choices).toEqual([
      { index: 0, text: 'Ôm hình nhân bước vào phòng' },
      { index: 1, text: PLACE },
    ]);
    const s = playM3([PLACE], { from: t.state });
    expect(s.node).toBe('m3_d4');
    expect(endingView(level, s)!.solution[2]!.segments).toEqual([
      { text: 'Phòng 404 ' },
      { text: 'chỉ nhận người có tên', mark: 'solution' },
      { text: '.' },
    ]);
  });
});

describe('Tỉnh táo và bản méo L1, L3', () => {
  const L1_FAKE = 'Đêm nay, trước khi đồng hồ điểm mười hai tiếng, phải có một người sống bước vào phòng 404.';
  const L1_REAL = 'Đêm nay, trước khi đồng hồ điểm mười hai tiếng, phải có một người bước vào phòng 404.';
  const L3_FAKE = 'Phòng 404 chỉ nhận người còn sống.';
  const L3_REAL = 'Phòng 404 chỉ nhận người có tên.';

  test('mức mất tối đa là 4 (c3, c5, M3-20, M3-33), Tỉnh táo thấp nhất là 1', () => {
    const s = playM3([SHOP, PEEK, QUY, PUPPET, '"Quý"', PLACE, WAIT, 'Tiếp']);
    expect(s).toMatchObject({ node: 'm3_e2', sanity: 1 });
    expect(level.on_sanity_zero).toBeUndefined();
  });

  test('c3 và c5 rồi tới M3-20: sanity 2, bản méo L1 và L3 trong nút Huyết tự', () => {
    const s = play('m3', [PEEK, QUY, BOOK]);
    expect(s).toMatchObject({ node: 'm3_n20', sanity: 2 });
    expect(panelText(s, 'L1')).toBe(L1_FAKE);
    expect(panelText(s, 'L3')).toBe(L3_FAKE);
    expect(panelText(s, 'L2')).toBe('Nếu không ai bước vào, cả tòa nhà sẽ chết.');
  });

  test('đánh dấu k1 và k3 thì giữ bản gốc', () => {
    const s = play('m3', [PEEK, QUY, BOOK], { highlights: ['k1', 'k3'] });
    expect(panelText(s, 'L1')).toBe(L1_REAL);
    expect(panelText(s, 'L3')).toBe(L3_REAL);
  });

  test('đánh dấu k2 (cùng dòng L1 nhưng không phải cụm bảo vệ) không ngăn bản méo L1', () => {
    expect(panelText(play('m3', [PEEK, QUY, BOOK], { highlights: ['k2'] }), 'L1')).toBe(L1_FAKE);
  });

  test('chỉ một trong c3, c5 thì tới M3-20 còn 3, chưa méo', () => {
    const s = play('m3', [PEEK, BOOK, BIN]);
    expect(s).toMatchObject({ node: 'm3_n20', sanity: 3 });
    expect(panelText(s, 'L1')).toBe(L1_REAL);
    expect(panelText(s, 'L3')).toBe(L3_REAL);
  });
});

describe('has_dossier ở M3-12 (G27)', () => {
  const ALTAR_LINE = 'Những cái tên này bạn đã từng gặp. Trên một tờ cáo phó.';
  const altarView = (unlocked: string[]) =>
    run(level, [ALTAR], { from: initialState(level, { unlocked }) }).views.find((v) => v.node === 'm3_n12')!;

  test('chưa mở hồ sơ thì không có dòng nhắc cáo phó', () => {
    expect(altarView([]).lines.some((l) => 'text' in l && l.text === ALTAR_LINE)).toBe(false);
  });

  test('đã mở hồ sơ "Vụ cháy nhà C4, 1986" thì có', () => {
    expect(altarView(['hs_chay_c4_1986']).lines).toContainEqual({ ch: 'narration', text: ALTAR_LINE });
  });

  test('chơi màn 1 có c1, sống sót, sang màn 3 với hồ sơ mang theo (G33)', () => {
    const m1 = loadLevel('m1');
    const won = run(m1, [
      'Xem bảng tin tổ dân phố', 'Nhìn xuống sàn dưới bóng đèn', 'Nói chuyện với cô Hằng',
      '"Tôi sẽ đi tìm."', 'Tiếp tục đếm', 'Đếm tiếp đến một trăm',
      'Hành lang tầng 2', 'Nhà vệ sinh chung cuối hành lang', 'Mở cửa buồng: "Tìm thấy em rồi."',
      'Gầm cầu thang', 'Lặng lẽ quay đi', 'Sân phơi tầng thượng', 'Đứng yên, nhắm mắt chờ',
    ]).state;
    expect(won.unlocked).toEqual(['hs_chay_c4_1986']);
    const start = initialState(level, { unlocked: won.unlocked });
    expect(start.sanity).toBe(5);
    const v = run(level, [ALTAR], { from: start }).views.find((x) => x.node === 'm3_n12')!;
    expect(v.lines).toContainEqual({ ch: 'narration', text: ALTAR_LINE });
  });
});

describe('cảnh', () => {
  test('M3-12 dùng ảnh có clue c1 của màn 3, M3-14 ghé khe cửa thì tối', () => {
    const t = run(level, [ALTAR, PEEK]);
    expect(t.views.find((v) => v.node === 'm3_n12')!.scene).toEqual({ bg: 'ban_tho_chieu_nghi', light: 'normal' });
    expect(t.views.find((v) => v.node === 'm3_n14')!.scene).toEqual({ bg: 'hanh_lang_tang_4', light: 'dark' });
    // Về hub thì đặt lại cảnh hành lang.
    expect(t.views.filter((v) => v.node === 'm3_n10').at(-1)!.scene).toEqual({ bg: 'hanh_lang_tang_4', light: 'flicker' });
  });
});

// Chạy sau cùng (Vitest chạy test trong file theo thứ tự khai báo).
test('mọi kết cục của màn 3 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});

describe('cảnh M3-15 (dùng lại cau_thang_chieu_nghi)', () => {
  test('nói chuyện với thằng Bin trên cầu thang; về hub thì trở lại hành lang tầng 4', () => {
    const t = run(level, [BIN]);
    expect(t.views.find((v) => v.node === 'm3_n15')!.scene).toEqual({ bg: 'cau_thang_chieu_nghi', light: 'flicker' });
    expect(t.state).toMatchObject({ node: 'm3_n10', scene: { bg: 'hanh_lang_tang_4', light: 'flicker' } });
  });
});
