// Các bổ sung đặc tả cho màn 4–9 (docs/spec-changes.md G35–G44), thử trên màn giả.
import { describe, expect, test } from 'vitest';
import { parseAssets } from '../src/content/loader.ts';
import type { Assets } from '../src/content/types.ts';
import { validateLevel } from '../src/content/validate/level.ts';
import { applyEffects } from '../src/engine/effects.ts';
import { bloodtextPanel, endingView, initialState, step, view } from '../src/engine/index.ts';
import { resolveScene } from '../src/engine/scene.ts';
import { errorsAfter, fixture, levelAfter, loadFixtureLevel, type RawLevel } from './helpers/fixtures.ts';
import { run } from './helpers/play.ts';

const assetsResult = parseAssets(fixture('assets.yaml'), 'assets.yaml');
if (!assetsResult.ok) throw new Error(assetsResult.errors.join('\n'));
const assets: Assets = assetsResult.value;

/** Màn giả có thêm một dòng giả F1 mực nâu, bóp méo đổi mực sang đỏ. */
const withFake = (extra: (raw: RawLevel) => void = () => {}) =>
  levelAfter((raw) => {
    raw.bloodtext.splice(1, 0, { id: 'F1', text: 'Dòng giả bảo làm ngược lại.', fake: true, ink: 'nau' });
    raw.distortions.push({ line: 'F1', ink: 'do' });
    raw.node('m9_n01').lines[6].lines = ['L1', 'F1', 'L2'];
    extra(raw);
  });

describe('G36 · dòng giả và kiểu mực', () => {
  test('dòng giả hợp lệ: id F, fake, không violable; Huyết tự mặc định mực đỏ', () => {
    const level = withFake();
    expect(validateLevel(level, assets)).toEqual([]);
    expect(level.bloodtext.map((b) => [b.id, b.ink, b.fake, b.violable])).toEqual([
      ['L1', 'do', false, true],
      ['F1', 'nau', true, false],
      ['L2', 'do', false, false],
    ]);
  });

  test('mực kho là Huyết tự thật: violable và được làm từ khoá', () => {
    const level = levelAfter((raw) => {
      raw.bloodtext[1].ink = 'kho';
    });
    expect(validateLevel(level, assets)).toEqual([]);
    expect(level.bloodtext[1]).toMatchObject({ ink: 'kho', fake: false });
  });

  test.each([
    ['id F mà thiếu fake', (raw: RawLevel) => raw.bloodtext.push({ id: 'F2', text: 'X.' }), /dòng F<số> phải có `fake: true`/],
    ['fake mà id L', (raw: RawLevel) => raw.bloodtext.push({ id: 'L3', text: 'X.', fake: true }), /dòng giả phải có id dạng F<số>/],
    ['dòng giả có violable', (raw: RawLevel) => raw.bloodtext.push({ id: 'F2', text: 'X.', fake: true, violable: false }), /dòng giả không có `violable`/],
    ['mực lạ', (raw: RawLevel) => (raw.bloodtext[0].ink = 'xanh'), /ink/],
  ])('schema: %s', (_name, mutate, pattern) => {
    expect(errorsAfter(mutate).join('\n')).toMatch(pattern);
  });

  test('validator: dòng giả không làm từ khoá, violates hay consequence_of được', () => {
    const level = withFake((raw) => {
      raw.keywords.push({ id: 'k3', line: 'F1', text: 'Dòng giả', correct: false });
      raw.node('m9_d1').violates = ['L1', 'F1'];
      raw.node('m9_d2').consequence_of = ['F1'];
    });
    expect(validateLevel(level, assets)).toEqual([
      'm9: keywords[2] — dòng giả F1 không dùng được cho từ khoá (G36)',
      'm9: m9_d1.violates[1] — dòng giả F1 không dùng được cho violates (G36)',
      'm9: m9_d2.consequence_of[0] — dòng giả F1 không dùng được cho consequence_of (G36)',
    ]);
  });

  test('view mang ink từng dòng; không lộ trường fake', () => {
    const level = withFake();
    const panel = bloodtextPanel(level, run(level, []).state);
    expect(panel.map((l) => [l.id, l.ink])).toEqual([
      ['L1', 'do'],
      ['F1', 'nau'],
      ['L2', 'do'],
    ]);
    expect(panel.every((l) => !('fake' in l))).toBe(true);
  });
});

describe('G37 · bóp méo đổi mực', () => {
  test('sanity ≤ 2: dòng giả hiện mực đỏ, chữ giữ nguyên; không bảo vệ được bằng từ khoá', () => {
    const level = withFake();
    const s = run(level, [], { highlights: ['k1', 'k2'] }).state;
    const low = bloodtextPanel(level, { ...s, sanity: 2 }).find((l) => l.id === 'F1')!;
    expect(low).toEqual({ id: 'F1', ink: 'do', segments: [{ text: 'Dòng giả bảo làm ngược lại.' }] });
    expect(bloodtextPanel(level, { ...s, sanity: 3 }).find((l) => l.id === 'F1')!.ink).toBe('nau');
  });

  test('một dòng có thể vừa đổi chữ vừa đổi mực', () => {
    const level = levelAfter((raw) => {
      raw.bloodtext[0].ink = 'kho';
      raw.distortions.push({ line: 'L1', ink: 'do' });
    });
    expect(validateLevel(level, assets)).toEqual([]);
    const s = { ...run(level, []).state, sanity: 2 };
    expect(bloodtextPanel(level, s)[0]).toEqual({ id: 'L1', ink: 'do', segments: [{ text: 'Dòng một có thể bỏ qua.' }] });
  });

  test('hai bản méo đổi mực cho cùng một dòng là lỗi', () => {
    const level = withFake((raw) => raw.distortions.push({ line: 'F1', ink: 'kho' }));
    expect(validateLevel(level, assets)).toContain(
      'm9: distortions — mỗi dòng chỉ có một bản méo đổi chữ và một bản méo đổi mực',
    );
  });
});

describe('G38 · solution tham chiếu dòng giả', () => {
  test('dòng giả trong solution được gạch ngang, mực gốc; dòng thật được tô', () => {
    const level = withFake((raw) => {
      raw.node('m9_d1').solution = ['L1', 'F1'];
    });
    expect(validateLevel(level, assets)).toEqual([]);
    const dead = run(level, ['Đi A', 'Đi B', 'Từ chối']).state;
    const e = endingView(level, { ...dead, sanity: 1 })!;
    expect(e.solution.slice(0, 2)).toEqual([
      { id: 'L1', ink: 'do', segments: [{ text: 'Dòng một phải được tuân thủ.', mark: 'solution' }] },
      { id: 'F1', ink: 'nau', segments: [{ text: 'Dòng giả bảo làm ngược lại.', mark: 'struck' }] },
    ]);
  });
});

describe('G39 · ánh sáng candle', () => {
  test('schema chấp nhận; engine giữ như mọi kiểu ánh sáng khác; nhắm mắt vẫn đen', () => {
    const level = levelAfter((raw) => {
      raw.node('m9_n01').scene = { bg: 'nen_a', light: 'candle' };
    });
    expect(validateLevel(level, assets)).toEqual([]);
    const s = initialState(level);
    expect(s.scene).toEqual({ bg: 'nen_a', light: 'candle' });
    expect(view(level, { ...s, eyes_closed: true }).scene.light).toBe('dark');
    expect(resolveScene({ light: 'candle' }, level, s)).toEqual({ bg: 'nen_a', light: 'candle' });
  });
});

describe('G40 · hiệu ứng có điều kiện', () => {
  const level = loadFixtureLevel();

  test('hiệu ứng có if xét sau mọi hiệu ứng không điều kiện, theo thứ tự khai báo', () => {
    const s = applyEffects(
      initialState(level),
      [{ sanity: -1, if: { flag: 'x' } }, { flag: 'x' }, { clue: 'c2', if: { sanity_lte: 2 } }],
      level,
    );
    // flag x bật trước, nên sanity −1 được áp; sau đó sanity 2 nên c2 cũng được thêm.
    expect(s).toMatchObject({ sanity: 2, flags: ['x'], clues: ['c2'] });
  });

  test('điều kiện sai thì bỏ qua', () => {
    const s = applyEffects(initialState(level), [{ sanity: -1, if: { not_flag: 'long_sat' } }, { flag: 'long_sat' }], level);
    expect(s.sanity).toBe(3);
  });

  test('dùng trong node và trong lựa chọn qua step', () => {
    const cond = levelAfter((raw) => {
      raw.node('m9_n03').effects.push({ flag: 'qua_a', if: { not_flag: 'co_c' } });
      raw.node('m9_n02').choices[1].effects.push({ sanity: -1, if: { clue: 'c1' } });
    });
    expect(validateLevel(cond, assets)).toEqual([]);
    const s = run(cond, ['Đi A', 'Đi B']).state;
    expect(s.flags).toEqual(['qua_a', 'co_c']);
    expect(s.sanity).toBe(1); // −1 ở m9_n03, −1 ở lựa chọn "Đi B" vì đã có c1
  });

  test('schema: hiệu ứng vẫn chỉ có đúng một khoá ngoài if', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n03').effects = [{ if: { flag: 'co_c' } }];
    });
    expect(errors.join('\n')).toMatch(/mỗi hiệu ứng phải có đúng một khoá/);
  });

  test('validator kiểm tra cả điều kiện của hiệu ứng', () => {
    const level2 = levelAfter((raw) => {
      raw.node('m9_n03').effects.push({ sanity: -1, if: { flag: 'khong_ai_bat' } });
    });
    expect(validateLevel(level2, assets)).toContain(
      'm9: m9_n03.effects[3].if — cờ `khong_ai_bat` không được hiệu ứng nào bật',
    );
  });
});

describe('G41 · màn cuối', () => {
  const finalLevel = (extra: (raw: RawLevel) => void = () => {}) =>
    levelAfter((raw) => {
      raw.final = true;
      raw.node('m9_n08').choices = [
        { text: 'Trọn vẹn', goto: 'm9_e1' },
        { text: 'Dở dang', goto: 'm9_e2' },
      ];
      delete raw.node('m9_n08').next;
      raw.nodes.push({ id: 'm9_e2', type: 'ending', result: 'survive', cause: 'Chưa hết', reveal: 'Còn nữa.', open: true });
      extra(raw);
    });

  test('kết cục sống thường là hết game; open là kết thúc mở', () => {
    const level = finalLevel();
    expect(validateLevel(level, assets)).toEqual([]);
    const path = ['Đi A', 'Đi B', '"Tìm."', 'Đếm tiếp'];
    expect(endingView(level, run(level, [...path, 'Trọn vẹn']).state)!.finale).toBe('complete');
    expect(endingView(level, run(level, [...path, 'Dở dang']).state)!.finale).toBe('open');
    expect(endingView(level, run(level, ['Đi A', 'Đi B', 'Từ chối']).state)!.finale).toBe('none');
  });

  test('màn không final thì không có finale', () => {
    const level = loadFixtureLevel();
    const s = run(level, ['Đi A', 'Đi B', '"Tìm."', 'Đếm tiếp']).state;
    expect(endingView(level, s)!.finale).toBe('none');
  });

  test('kết thúc mở: Chơi lại màn cuối vẫn giữ hồ sơ', () => {
    const level = finalLevel();
    const open = run(level, ['Đi A', 'Đi B', '"Tìm."', 'Đếm tiếp', 'Dở dang']).state;
    expect(open.unlocked).toEqual([]);
    const again = step(level, { ...open, unlocked: ['hs_thu'] }, { type: 'restart' });
    expect(again).toMatchObject({ node: 'm9_n01', unlocked: ['hs_thu'] });
  });

  test('open ở màn không final là lỗi; open ở kết cục chết là lỗi schema', () => {
    const notFinal = levelAfter((raw) => {
      raw.node('m9_e1').open = true;
    });
    expect(validateLevel(notFinal, assets)).toContain('m9: nodes — `open` chỉ dùng ở màn có `final: true` (G41)');
    const errors = errorsAfter((raw) => {
      raw.node('m9_d1').open = true;
    });
    expect(errors.join('\n')).toMatch(/`open` chỉ dùng cho kết cục sống/);
  });
});
