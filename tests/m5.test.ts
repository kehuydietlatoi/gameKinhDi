// Màn 5 – Nội quy: đối chiếu kịch bản và mục "Kiểm tra nhanh" của docs/man-5-noi-quy.md.
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, highlightOptions, view, type GameState } from '../src/engine/index.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

checkLevelContent('m5', 'man-5-noi-quy.md');

const level = loadLevel('m5');
const reached = new Set<string>();
function playM5(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m5', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}

const WALL = 'Gõ vách sang phòng 305';
const CANDLE = 'Tìm nến và diêm';
const KEYHOLE = 'Nhìn qua lỗ khoá ra hành lang';
const LOOK = 'Nhìn kỹ các dòng chữ trên tường';
const TO_N20 = ['Im lặng', 'Khoá vòi, không chạm vào nước'];
const TO_N30 = [...TO_N20, 'Bịt tai, ngồi im'];
const LIGHT_WITH = 'Thắp nến';
const LIGHT_WITHOUT = 'Lần mò ngăn kéo tìm nến, rồi thắp lên';
const FINISH = ['Nhìn thẳng vào ngọn nến, không đáp', 'Chờ'];

const panel = (s: GameState) => bloodtextPanel(level, s).map((l) => [l.id, l.ink, l.segments.map((x) => x.text).join('')]);
const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => [b.id, b.ink, b.segments.map((x) => x.text).join('')]) : []));

describe('tám dòng trên tường', () => {
  test('hiện đủ tám dòng theo thứ tự; F1, F2 mực nâu, còn lại mực đỏ', () => {
    const s = play('m5', []);
    expect(panel(s).map(([id, ink]) => `${id}:${ink}`)).toEqual([
      'L1:do', 'F1:nau', 'L2:do', 'L3:do', 'L4:do', 'F2:nau', 'L5:do', 'L6:do',
    ]);
  });

  test('chỉ chọn được từ khoá trên dòng đỏ', () => {
    const fakeOptions = highlightOptions(level).filter((o) => o.line.startsWith('F'));
    expect(fakeOptions.map((o) => [o.line, o.ink, o.keywords])).toEqual([
      ['F1', 'nau', []],
      ['F2', 'nau', []],
    ]);
  });
});

describe('đường sống', () => {
  test.each([
    ['có co_nen', [CANDLE, WALL], LIGHT_WITH],
    ['không có co_nen', [WALL, LOOK], LIGHT_WITHOUT],
  ])('%s', (_name, hub, light) => {
    const t = run(level, [...hub, ...TO_N30, light, ...FINISH]);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm5_e1', time: '05:00', scene: { bg: 'can_ho_304', light: 'dawn' } });
    const n30 = t.views.find((v) => v.node === 'm5_n30')!;
    expect(n30.exit.kind === 'choices' && n30.exit.choices.map((c) => c.text)).toEqual([
      light,
      'Ngồi yên trong bóng tối',
      'Ra hành lang xin lửa',
    ]);
    expect(t.views.find((v) => v.node === 'm5_n31')!.scene).toEqual({ bg: 'can_ho_304', light: 'candle' });
    expect(t.views.find((v) => v.node === 'm5_n40')!.scene).toEqual({ bg: 'can_ho_304', light: 'candle' });
    const e = endingView(level, t.state)!;
    expect(e.solution.filter((l) => l.segments.some((x) => x.mark === 'struck')).map((l) => [l.id, l.ink])).toEqual([
      ['F1', 'nau'],
      ['F2', 'nau'],
    ]);
  });

  test('M5-10: dòng nhắc lời bà Sáu chỉ hiện khi có c1', () => {
    const line = 'Bà Sáu vừa nói đêm nay bà không gõ cửa nhà ai.';
    const has = (hub: string[]) => view(level, play('m5', hub)).lines.some((l) => 'text' in l && l.text === line);
    expect(has([WALL, CANDLE])).toBe(true);
    expect(has([CANDLE, LOOK])).toBe(false);
  });

  test('M5-32: giọng dưới gầm giường "giờ ở ngay sau lưng bạn" (G35)', () => {
    const t = run(level, [CANDLE, WALL, ...TO_N30, LIGHT_WITH, 'Cúi nhìn xuống gầm giường']);
    expect(t.views.find((v) => v.node === 'm5_n32')!.lines[1]).toEqual({
      ch: 'npc',
      name: 'Một giọng trẻ con',
      tone: 'whisper',
      text: 'Em ở đây cơ mà.',
      note: 'giờ ở ngay sau lưng bạn',
    });
  });
});

describe('kết cục chết', () => {
  test('D1 · Trả lời tiếng gõ', () => {
    expect(playM5([WALL, CANDLE, 'Trả lời: "Bà đợi cháu tí."']).node).toBe('m5_d1');
  });

  test.each([
    ['M5-10', [WALL, CANDLE, 'Mở cửa']],
    ['M5-20', [WALL, CANDLE, ...TO_N20, 'Mở cửa']],
    ['M5-30', [WALL, CANDLE, ...TO_N30, 'Ra hành lang xin lửa']],
    ['M5-40', [WALL, CANDLE, ...TO_N30, LIGHT_WITH, 'Nhìn thẳng vào ngọn nến, không đáp', 'Mở cửa']],
  ])('D2 · Mở cửa từ %s', (_from, choices) => {
    const s = playM5(choices);
    expect(s.node).toBe('m5_d2');
    const solution = endingView(level, s)!.solution;
    expect(solution[0]!.segments.find((x) => x.mark === 'solution')!.text).toBe('đến năm giờ sáng');
    expect(solution[1]).toEqual({ id: 'F1', ink: 'nau', segments: [{ text: 'Nếu nghe tiếng mẹ gọi, hãy mở cửa.', mark: 'struck' }] });
  });

  test.each([['Vốc nước rửa mặt'], ['Uống một ngụm']])('D3 · Dùng nước đỏ: %s', (choice) => {
    expect(playM5([WALL, CANDLE, 'Im lặng', choice]).node).toBe('m5_d3');
  });

  test.each([
    ['M5-30', [WALL, CANDLE, ...TO_N30, 'Ngồi yên trong bóng tối']],
    ['M5-31', [WALL, CANDLE, ...TO_N30, LIGHT_WITH, 'Thổi nến']],
  ])('D4 · Bóng tối từ %s', (_from, choices) => {
    const s = playM5(choices);
    expect(s.node).toBe('m5_d4');
    expect(endingView(level, s)!.solution[5]!.segments).toEqual([
      { text: 'Mất điện thì phải ngồi yên trong bóng tối; không được thắp lửa.', mark: 'struck' },
    ]);
  });
});

describe('Tỉnh táo, mực đỏ của dòng giả, bản méo L1', () => {
  const L1_FAKE = 'Từ mười một giờ đêm đến bốn giờ sáng, không được mở cửa căn hộ.';
  const L1_REAL = 'Từ mười một giờ đêm đến năm giờ sáng, không được mở cửa căn hộ.';
  const LOSS3 = [KEYHOLE, CANDLE, ...TO_N20, 'Đáp: "Mẹ ơi…", nhưng không mở cửa'];

  test('mức mất tối đa là 4 (c3, M5-20, đáp lời mẹ, nhìn gầm giường), còn 1', () => {
    const s = playM5([...LOSS3, LIGHT_WITH, 'Cúi nhìn xuống gầm giường', 'Chờ']);
    expect(s).toMatchObject({ node: 'm5_e1', sanity: 1 });
  });

  test('M5-30 sau ba lần mất: F1, F2 hiện mực đỏ; L1 hiện bản méo khi chưa đánh dấu k2', () => {
    const s = play('m5', LOSS3);
    expect(s).toMatchObject({ node: 'm5_n30', sanity: 2 });
    expect(bloodIn(s)).toEqual([
      ['F1', 'do', 'Nếu nghe tiếng mẹ gọi, hãy mở cửa.'],
      ['F2', 'do', 'Mất điện thì phải ngồi yên trong bóng tối; không được thắp lửa.'],
      ['L1', 'do', L1_FAKE],
    ]);
    // Trong bảng Huyết tự, cả tám dòng đều đỏ: không còn dấu hiệu nào của dòng giả.
    expect(panel(s).every(([, ink]) => ink === 'do')).toBe(true);
  });

  test('đã đánh dấu k2: L1 giữ bản gốc, nhưng F1, F2 vẫn đỏ (không bảo vệ được)', () => {
    const s = play('m5', LOSS3, { highlights: ['k2'] });
    expect(bloodIn(s)).toEqual([
      ['F1', 'do', 'Nếu nghe tiếng mẹ gọi, hãy mở cửa.'],
      ['F2', 'do', 'Mất điện thì phải ngồi yên trong bóng tối; không được thắp lửa.'],
    ]);
    expect(panel(s)[0]).toEqual(['L1', 'do', L1_REAL]);
  });

  test('M5-40 tới được với Tỉnh táo 2 khi mất 3 lần (c3, M5-20, nhìn gầm giường)', () => {
    const s = play('m5', [KEYHOLE, CANDLE, ...TO_N30, LIGHT_WITH, 'Cúi nhìn xuống gầm giường']);
    expect(s).toMatchObject({ node: 'm5_n40', sanity: 2 });
    expect(bloodIn(s).map(([id, ink]) => `${id}:${ink}`)).toEqual(['F1:do', 'F2:do', 'L1:do']);
  });

  test('Tỉnh táo 3 ở M5-30 thì chưa méo, dòng giả vẫn nâu', () => {
    const s = play('m5', [KEYHOLE, CANDLE, ...TO_N30]);
    expect(s).toMatchObject({ node: 'm5_n30', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
    expect(panel(s)[1]).toEqual(['F1', 'nau', 'Nếu nghe tiếng mẹ gọi, hãy mở cửa.']);
  });
});

test('mọi kết cục của màn 5 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});

describe('cảnh M5-06 (brief hanh_lang_lo_khoa)', () => {
  test('nhìn qua lỗ khoá thấy hành lang; về hub thì trở lại căn hộ', () => {
    const t = run(level, [KEYHOLE]);
    expect(t.views.find((v) => v.node === 'm5_n06')!.scene).toEqual({ bg: 'hanh_lang_lo_khoa', light: 'normal' });
    expect(t.state).toMatchObject({ node: 'm5_n03', scene: { bg: 'can_ho_304', light: 'normal' } });
  });
});
