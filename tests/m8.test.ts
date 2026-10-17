// Màn 8 – Bình minh không đến: đối chiếu kịch bản và mục "Kiểm tra nhanh" của docs/man-8-binh-minh-khong-den.md.
import { describe, expect, test } from 'vitest';
import { endingView, view, type GameState } from '../src/engine/index.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

checkLevelContent('m8', 'man-8-binh-minh-khong-den.md');

const level = loadLevel('m8');
const reached = new Set<string>();
function playM8(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m8', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}
const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => b.segments.map((x) => x.text).join('')) : []));

const BOOK = 'Xem vở tập vẽ trên bàn học';
const SUNSET = 'Nhìn tranh trên tường cửa ra vào';
const GHOST = 'Nhìn tranh con ma đen';
const NA = 'Nói chuyện với bé Na';
const PENS = 'Mở hộp bút sáp trên bàn';
const QUIET = [BOOK, NA, PENS];
const ASK = 'Hỏi Na mượn bút vàng';
const BARS = 'Dùng mẩu bút đen vẽ thêm song sắt nhốt con ma';
const SUN = '"Để vẽ ông mặt trời, cho trời sáng."';
const EAST = 'Vẽ mặt trời lên tường cửa sổ bếp';

describe('đường sống', () => {
  test('ngắn nhất, không cần manh mối: hỏi mượn bút, nói để vẽ mặt trời, vẽ ở tường cửa sổ bếp', () => {
    const t = run(level, [SUNSET, GHOST, PENS, ASK, SUN, EAST]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm8_e1', time: '05:30', scene: { bg: 'can_ho_304', light: 'dawn' } });
    // Giờ đứng ở 23:59 đến M8-31.
    for (const v of t.views.filter((x) => !['m8_n31', 'm8_e1'].includes(x.node))) expect(v.time, v.node).toBe('23:59');
    // Mặt trời sáp vàng đã vẽ trên tường cửa sổ bếp: dùng ảnh riêng cho M8-31.
    expect(t.views.find((v) => v.node === 'm8_n31')!.scene).toEqual({ bg: 'phong_404_1986_mat_troi', light: 'dawn' });
    expect(t.views.find((v) => v.node === 'm8_n30')!.scene).toEqual({ bg: 'phong_404_1986', light: 'flicker' });
  });

  test('có long_sat: M8-30 không mất Tỉnh táo, nghe tiếng song sắt (G40)', () => {
    const t = run(level, [...QUIET, BARS, SUN, EAST]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm8_e1', sanity: 4, flags: ['long_sat'] });
    const n30 = t.views.find((v) => v.node === 'm8_n30')!;
    expect(n30.notices).toEqual([]);
    expect(n30.lines[0]).toEqual({ ch: 'sound', src: 'tường đầu giường', vol: 1, text: 'Rắc… rắc… — song sắt đang cong dần.' });
  });

  test('không có long_sat: M8-30 mất 1 Tỉnh táo, nghe tiếng sáp sau lưng', () => {
    const t = run(level, [...QUIET, ASK, SUN, EAST]);
    expect(t.state).toMatchObject({ node: 'm8_e1', sanity: 3 });
    const n30 = t.views.find((v) => v.node === 'm8_n30')!;
    expect(n30.notices).toEqual([{ kind: 'sanity', delta: -1 }]);
    expect(n30.lines[0]).toMatchObject({ ch: 'sound', src: 'sau lưng' });
  });

  test('qua M8-22 rồi xin lỗi', () => {
    const t = run(level, [...QUIET, ASK, '"Để vẽ đè lên con ma."', '"Thôi, anh xin lỗi. Anh mượn để vẽ ông mặt trời."', EAST]);
    reached.add(t.state.node);
    expect(t.path).toContain('m8_n22');
    expect(t.state.node).toBe('m8_e1');
  });

  test.each([
    ['tường cửa ra vào', 'Vẽ mặt trời lên tường cửa ra vào, cạnh ông mặt trời đỏ'],
    ['tường bàn học', 'Vẽ mặt trời lên tường bàn học'],
  ])('vẽ sai ở %s một lần rồi sửa ở tường cửa sổ bếp', (_name, wrong) => {
    const t = run(level, [...QUIET, ASK, SUN, wrong, 'Vẽ lên tường cửa sổ bếp']);
    reached.add(t.state.node);
    expect(t.path.slice(-3)).toEqual(['m8_n32', 'm8_n31', 'm8_e1']);
    expect(t.state.sanity).toBe(2);
  });
});

describe('kết cục chết', () => {
  test.each([
    ['M8-10', ['Giật cây bút vàng trong tay Na']],
    ['M8-11', ['Lấy giẻ xoá tranh con ma']],
    ['M8-20', [ASK, '"Đưa đây!"']],
    ['M8-22', [ASK, '"Để vẽ đè lên con ma."', 'Giật lấy bút']],
    ['M8-30', [ASK, SUN, 'Vẽ mặt trời đè lên con ma']],
  ])('D1 · Na khóc từ %s', (_from, tail) => {
    const s = playM8([...QUIET, ...tail]);
    expect(s.node).toBe('m8_d1');
    expect(endingView(level, s)!.reveal).toBe('Con ma là của Na, cây bút cũng là của Na. Không được làm Na khóc.');
  });

  test('M8-11: Na hét trước khi khóc', () => {
    const t = run(level, [...QUIET, 'Lấy giẻ xoá tranh con ma']);
    expect(t.views.find((v) => v.node === 'm8_n11')!.lines[1]).toEqual({
      ch: 'npc',
      name: 'Bé Na',
      tone: 'shout',
      text: 'Đừng! Đấy là con ma của em!',
    });
  });

  test('D2 · Con ma tới', () => {
    const s = playM8([...QUIET, ASK, SUN, 'Vẽ mặt trời lên tường bàn học', 'Vẽ lại một ông mặt trời to hơn ở chỗ cũ']);
    expect(s.node).toBe('m8_d2');
  });
});

describe('Tỉnh táo và bản méo ở M8-30', () => {
  const L2_FAKE = 'Ở đây, mặt trời chỉ mọc ở phía tây.';
  const L4_FAKE = 'Thứ gì có trên tường thì phải xoá đi.';

  test('mức mất tối đa là 4 (c3, M8-10, M8-30 khi không có long_sat, M8-32), còn 1', () => {
    const s = playM8([GHOST, BOOK, NA, ASK, SUN, 'Vẽ mặt trời lên tường bàn học', 'Vẽ lên tường cửa sổ bếp']);
    expect(s).toMatchObject({ node: 'm8_e1', sanity: 1 });
  });

  test('c3 và không vẽ song sắt: hai bản méo ở M8-30 khi chưa đánh dấu', () => {
    const s = play('m8', [GHOST, BOOK, NA, ASK, SUN]);
    expect(s).toMatchObject({ node: 'm8_n30', sanity: 2 });
    expect(bloodIn(s)).toEqual([L2_FAKE, L4_FAKE]);
    expect(bloodIn(play('m8', [GHOST, BOOK, NA, ASK, SUN], { highlights: ['k2', 'k4'] }))).toEqual([]);
    expect(bloodIn(play('m8', [GHOST, BOOK, NA, ASK, SUN], { highlights: ['k4'] }))).toEqual([L2_FAKE]);
  });

  test('c3 nhưng có song sắt: M8-30 còn 3, chưa méo', () => {
    const s = play('m8', [GHOST, BOOK, NA, BARS, SUN]);
    expect(s).toMatchObject({ node: 'm8_n30', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
  });
});

test('mọi kết cục của màn 8 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});
