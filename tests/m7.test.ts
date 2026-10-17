// Màn 7 – Giữ lửa: đối chiếu kịch bản và mục "Kiểm tra nhanh" của docs/man-7-giu-lua.md.
import { describe, expect, test } from 'vitest';
import { endingView, view, type GameState } from '../src/engine/index.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

checkLevelContent('m7', 'man-7-giu-lua.md');

const level = loadLevel('m7');
const reached = new Set<string>();
function playM7(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m7', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}
const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => b.segments.map((x) => x.text).join('')) : []));

const SIGNS = 'Đọc biển tên trên các bếp';
const HANH = 'Hỏi bác sĩ Thanh về chị Hạnh';
const STOVE = 'Hỏi ông Đức về lò than';
const COUNT = 'Đếm người trong bếp';
const STAY = '"Tôi ở lại."';
const CHAIR = 'Đập một chiếc ghế gỗ, bỏ vào lò';
const COAL = 'Xúc than trong thùng ở góc bỏ vào lò';
const ANSWER = 'Đáp: "Dạ."';
const SIT = '"Dạ." rồi ngồi yên bên lò';

describe('đường sống', () => {
  test('không cần manh mối nào: ở lại, đập ghế, đáp "dạ" hai lần, ngồi yên', () => {
    const t = run(level, [COUNT, HANH, STAY, CHAIR, ANSWER, SIT]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm7_e1', time: '05:45', sanity: 3, scene: { bg: 'bep_tap_the', light: 'dawn' } });
    expect(endingView(level, t.state)!.cause).toBe('Giữ được lửa');
  });

  test('giữ lửa bằng thùng than ở góc (cần c3)', () => {
    const t = run(level, [STOVE, COUNT, STAY, COAL, ANSWER, SIT]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm7_e1', sanity: 4 });
  });

  test('không có c3 thì không xúc than được', () => {
    const v = view(level, play('m7', [COUNT, HANH, STAY]));
    expect(v.exit.kind === 'choices' && v.exit.choices.map((c) => c.text)).toEqual([
      'Ra kho ngoài ngõ lấy than',
      CHAIR,
      'Ngồi yên chờ người khác lo',
    ]);
  });

  test('có c2 thì có lời "giữ lửa thay chị ấy"', () => {
    const text = '"Chị Hạnh đang nằm trạm y tế. Tôi ở lại giữ lửa thay chị ấy."';
    const choicesOf = (hub: string[]) => {
      const v = view(level, play('m7', hub));
      return v.exit.kind === 'choices' ? v.exit.choices.map((c) => c.text) : [];
    };
    expect(choicesOf([HANH, COUNT])).toContain(text);
    expect(choicesOf([STOVE, COUNT])).not.toContain(text);
    expect(playM7([HANH, COUNT, text, CHAIR, ANSWER, SIT]).node).toBe('m7_e1');
  });

  test('ánh lò: candle; lửa yếu ở M7-20 thì tối; bùng lại ở M7-21', () => {
    const t = run(level, [COUNT, HANH, STAY, CHAIR]);
    expect(t.views.find((v) => v.node === 'm7_n01')!.scene).toEqual({ bg: 'bep_tap_the', light: 'candle' });
    expect(t.views.find((v) => v.node === 'm7_n20')!.scene.light).toBe('dark');
    expect(t.views.find((v) => v.node === 'm7_n21')!.scene.light).toBe('candle');
    expect(t.views.find((v) => v.node === 'm7_n30')!.scene.light).toBe('candle');
  });
});

describe('kết cục chết', () => {
  test.each([
    ['M7-20', [STAY, 'Ngồi yên chờ người khác lo']],
    ['M7-32', [STAY, CHAIR, ANSWER, '"Dạ." rồi ra ngõ']],
  ])('D1 · Bỏ lửa từ %s', (_from, tail) => {
    expect(playM7([COUNT, HANH, ...tail]).node).toBe('m7_d1');
  });

  test.each([
    ['M7-10', ['"Tôi ra ngoài."']],
    ['M7-20', [STAY, 'Ra kho ngoài ngõ lấy than']],
  ])('D2 · Ra ngoài khi không có tên từ %s', (_from, tail) => {
    expect(playM7([COUNT, HANH, ...tail]).node).toBe('m7_d2');
  });

  test.each([
    ['M7-30', [STAY, CHAIR, 'Im lặng']],
    ['M7-32', [STAY, CHAIR, ANSWER, 'Im lặng']],
  ])('D3 · Không ai đáp từ %s', (_from, tail) => {
    const s = playM7([COUNT, HANH, ...tail]);
    expect(s.node).toBe('m7_d3');
    expect(view(level, s).lines).toEqual([{ ch: 'npc', name: 'Thứ ngoài ngõ', tone: 'normal', text: 'Thiếu một.' }]);
  });

  test('D4 · Xưng tên mình', () => {
    const s = playM7([COUNT, HANH, STAY, CHAIR, 'Đáp: "Chị Hạnh không có ở đây. Tôi là người ở phòng 304."']);
    expect(s.node).toBe('m7_d4');
    expect(endingView(level, s)!.solution.flatMap((l) => l.segments.filter((x) => x.mark === 'solution').map((x) => x.text))).toEqual([
      'sáu người sau đây',
      'người có tên trong danh sách',
    ]);
  });
});

describe('Tỉnh táo và bản méo ở M7-30', () => {
  const L3_FAKE = 'Thứ ngoài ngõ sẽ gọi tên từng người. Người được gọi tên không được đáp lời.';
  const L4_FAKE = 'Thứ ngoài ngõ không đụng tới người ở trong bếp.';

  test('mức mất tối đa là 3 (c1, đập ghế, M7-30)', () => {
    const s = playM7([SIGNS, HANH, STAY, CHAIR, ANSWER, SIT]);
    expect(s).toMatchObject({ node: 'm7_e1', sanity: 2 });
  });

  test('c1 và đập ghế: hai bản méo ở M7-30 khi chưa đánh dấu', () => {
    const s = play('m7', [SIGNS, HANH, STAY, CHAIR]);
    expect(s).toMatchObject({ node: 'm7_n30', sanity: 2 });
    expect(bloodIn(s)).toEqual([L3_FAKE, L4_FAKE]);
    expect(bloodIn(play('m7', [SIGNS, HANH, STAY, CHAIR], { highlights: ['k3', 'k4'] }))).toEqual([]);
    expect(bloodIn(play('m7', [SIGNS, HANH, STAY, CHAIR], { highlights: ['k3'] }))).toEqual([L4_FAKE]);
  });

  test('c1 nhưng xúc than (không đập ghế): M7-30 còn 3, chưa méo', () => {
    const s = play('m7', [SIGNS, STOVE, STAY, COAL]);
    expect(s).toMatchObject({ node: 'm7_n30', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
  });
});

test('mọi kết cục của màn 7 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});
