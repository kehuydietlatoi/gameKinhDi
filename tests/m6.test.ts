// Màn 6 – Cầu nối: đối chiếu kịch bản và mục "Kiểm tra nhanh" của docs/man-6-cau-noi.md.
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, view, type GameState } from '../src/engine/index.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

checkLevelContent('m6', 'man-6-cau-noi.md');

const level = loadLevel('m6');
const reached = new Set<string>();
function playM6(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m6', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}
const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => b.segments.map((x) => x.text).join('')) : []));

const STORY = 'Hỏi bà Sáu chuyện cây cầu';
const BRIDGE = 'Ra nhìn cầu nối từ đầu cầu C4';
const BALCONY = 'Ra ban công nhìn sang C5';
const ADVICE = 'Hỏi bà Sáu cách qua cầu';
const QUIET = [STORY, ADVICE];
const FORWARD = 'Bước lên cầu, đi thẳng sang C5';
const BACKWARD = 'Quay mặt về phía C4, bước lùi lên cầu';
const TO_N31 = [BACKWARD, 'Lùi tiếp, giữ nhịp'];
const TO_N32 = [...TO_N31, 'Lùi tiếp, tay lần theo lan can'];
const SURVIVE = [...TO_N32, 'Vừa lùi vừa đáp: "Cháu bên C4!"'];

describe('đường sống', () => {
  test('quay người ở đầu cầu, đi lùi, vừa lùi vừa đáp', () => {
    const t = run(level, [...QUIET, ...SURVIVE]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm6_e1', sanity: 3, scene: { bg: 'cau_noi_c4_c5', light: 'normal' } });
    expect(endingView(level, t.state)!.cause).toBe('Sang được C5');
    // Đứng ở đầu cầu nhìn sang C5; từ lúc quay người đi lùi thì nhìn về C4.
    expect(t.views.find((v) => v.node === 'm6_n10')!.scene).toEqual({ bg: 'cau_noi_c4_c5', light: 'flicker' });
    for (const id of ['m6_n30', 'm6_n31', 'm6_n32', 'm6_n33']) {
      expect(t.views.find((v) => v.node === id)!.scene, id).toEqual({ bg: 'cau_noi_nhin_ve_c4', light: 'flicker' });
    }
  });

  test('đi tiến thì vẫn nhìn sang C5', () => {
    const t = run(level, [...QUIET, FORWARD, 'Đi tiếp']);
    for (const id of ['m6_n20', 'm6_n21']) {
      expect(t.views.find((v) => v.node === id)!.scene, id).toEqual({ bg: 'cau_noi_c4_c5', light: 'flicker' });
    }
  });

  test('cảnh của hub M6-03 trở lại can_ho_304 sau M6-05', () => {
    const t = run(level, [BRIDGE]);
    expect(t.views.find((v) => v.node === 'm6_n05')!.scene).toEqual({ bg: 'cau_noi_c4_c5', light: 'normal' });
    expect(t.state).toMatchObject({ node: 'm6_n03', scene: { bg: 'can_ho_304', light: 'normal' } });
  });

  test('M6-31: "Một giọng quen" nói bằng giọng mẹ (G35)', () => {
    const s = play('m6', [...QUIET, ...TO_N31]);
    expect(view(level, s).lines[2]).toEqual({
      ch: 'npc',
      name: 'Một giọng quen',
      tone: 'normal',
      text: 'Con ơi, nhìn đường kìa. Sau lưng con lan can gãy đấy. Quay lại mà nhìn.',
      note: 'giọng mẹ',
    });
  });
});

describe('kết cục chết', () => {
  test('D1 · Không đi', () => {
    const t = run(level, [...QUIET, 'Không đi nữa, quay về với bà Sáu']);
    reached.add(t.state.node);
    expect(t.path.slice(-2)).toEqual(['m6_n11', 'm6_d1']);
    expect(t.views.find((v) => v.node === 'm6_n11')!.scene).toEqual({ bg: 'can_ho_304', light: 'dark' });
  });

  test.each([
    ['M6-20', [FORWARD, 'Quay đầu nhìn lại']],
    ['M6-30', [BACKWARD, 'Quay người lại, chạy cho nhanh']],
    ['M6-31', [...TO_N31, 'Quay lại xem lan can có gãy không']],
    ['M6-32', [...TO_N32, 'Quay lại cho bà ấy soi mặt']],
  ])('D2 · Quay đầu từ %s', (_from, tail) => {
    expect(playM6([...QUIET, ...tail]).node).toBe('m6_d2');
  });

  test.each([
    ['M6-20', [FORWARD, 'Đứng lại nghe ngóng']],
    ['M6-30', [BACKWARD, 'Đứng lại nhìn cho rõ']],
    ['M6-31', [...TO_N31, 'Dừng lại, bám chặt lấy lan can']],
    ['M6-32', [...TO_N32, 'Dừng lại, đáp: "Cháu bên C4, bà Sáu ốm!"']],
  ])('D3 · Dừng bước từ %s', (_from, tail) => {
    expect(playM6([...QUIET, ...tail]).node).toBe('m6_d3');
  });

  test.each([['Đi tiếp'], ['Chạy thật nhanh']])('D4 · Quay lưng qua "%s" ở M6-20', (choice) => {
    const t = run(level, [...QUIET, FORWARD, choice]);
    reached.add(t.state.node);
    expect(t.path.slice(-2)).toEqual(['m6_n21', 'm6_d4']);
  });
});

describe('Tỉnh táo và bản méo ở M6-31', () => {
  const L3_FAKE = 'Trên cầu nối, khi bị gọi tên thì phải dừng bước.';
  const L4_FAKE = 'Thứ ở trên cầu sẽ bắt kẻ nào nhìn thẳng vào nó.';

  test('mức mất tối đa là 3 (c2, M6-30, M6-31)', () => {
    const s = playM6([BRIDGE, BALCONY, ...SURVIVE]);
    expect(s).toMatchObject({ node: 'm6_e1', sanity: 2 });
  });

  test('đã chọn c2: hai bản méo hiện ở M6-31 khi chưa đánh dấu', () => {
    const s = play('m6', [BRIDGE, STORY, ...TO_N31]);
    expect(s).toMatchObject({ node: 'm6_n31', sanity: 2 });
    expect(bloodIn(s)).toEqual([L3_FAKE, L4_FAKE]);
  });

  test('đánh dấu k4 giữ L3, đánh dấu k3 giữ L4', () => {
    expect(bloodIn(play('m6', [BRIDGE, STORY, ...TO_N31], { highlights: ['k4'] }))).toEqual([L4_FAKE]);
    expect(bloodIn(play('m6', [BRIDGE, STORY, ...TO_N31], { highlights: ['k3'] }))).toEqual([L3_FAKE]);
    const both = play('m6', [BRIDGE, STORY, ...TO_N31], { highlights: ['k3', 'k4'] });
    expect(bloodIn(both)).toEqual([]);
    expect(bloodtextPanel(level, both)[3]!.segments.map((x) => x.text).join('')).toBe(
      'Thứ ở trên cầu sẽ bắt kẻ nào quay lưng về phía nó.',
    );
  });

  test('không chọn c2 thì M6-31 còn 3, chưa méo', () => {
    const s = play('m6', [...QUIET, ...TO_N31]);
    expect(s).toMatchObject({ node: 'm6_n31', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
  });
});

test('mọi kết cục của màn 6 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});
