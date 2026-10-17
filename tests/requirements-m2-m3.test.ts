// Các bổ sung đặc tả cho màn 2 và màn 3 (docs/spec-changes.md G23–G33), thử trên màn giả.
import { describe, expect, test } from 'vitest';
import { parseAssets } from '../src/content/loader.ts';
import type { Assets } from '../src/content/types.ts';
import { validateAssets } from '../src/content/validate/assets.ts';
import { exclusive, levelWarnings, validateLevel } from '../src/content/validate/level.ts';
import { check } from '../src/engine/conditions.ts';
import { endingView, initialState, step, view } from '../src/engine/index.ts';
import { errorsAfter, fixture, levelAfter, loadFixtureLevel } from './helpers/fixtures.ts';
import { run } from './helpers/play.ts';

const assetsResult = parseAssets(fixture('assets.yaml'), 'assets.yaml');
if (!assetsResult.ok) throw new Error(assetsResult.errors.join('\n'));
const assets: Assets = assetsResult.value;
const level = loadFixtureLevel();

describe('G23 · Tỉnh táo về init ở đầu mỗi màn', () => {
  test('initialState không nhận Tỉnh táo từ màn trước', () => {
    expect(initialState(level, { deaths: 2, unlocked: ['hs_x'] })).toMatchObject({ sanity: 3, deaths: 2, unlocked: ['hs_x'] });
  });

  test('Chơi lại trả Tỉnh táo về init', () => {
    const dead = run(level, ['Đi A', 'Đi B', 'Từ chối']).state;
    expect(dead.sanity).toBe(2);
    expect(step(level, dead, { type: 'restart' }).sanity).toBe(3);
  });
});

describe('G24 · ẩn giờ khi nhắm mắt', () => {
  test('view.time là null khi eyes_closed', () => {
    const open = run(level, ['Đi A', 'Đi B']).state;
    expect(view(level, open).time).toBe('23:00');
    const closed = run(level, ['"Tìm."'], { from: open }).state;
    expect(closed.eyes_closed).toBe(true);
    expect(view(level, closed).time).toBeNull();
    expect(closed.time).toBe('23:00'); // state vẫn giữ giờ
  });
});

describe('G25 · hai NPC khác id cùng tên hiển thị', () => {
  test('validator không báo lỗi; mỗi dòng hiện đúng tên', () => {
    const twin = levelAfter((raw) => {
      raw.npcs.push({ id: 'npc_a_gia', name: 'Người A' });
      raw.node('m9_n01').lines.splice(5, 0, { ch: 'npc', who: 'npc_a_gia', text: 'Giọng khàn.' });
    });
    expect(validateLevel(twin, assets)).toEqual([]);
    const names = view(twin, initialState(twin)).lines.flatMap((l) => (l.ch === 'npc' ? [l.name] : []));
    expect(names).toEqual(['Người A', 'Người A', 'Người B']);
  });
});

describe('G26 · on_sanity_zero trỏ tới node thường', () => {
  const zero = levelAfter((raw) => {
    raw.on_sanity_zero = 'm9_n90';
    raw.nodes.push({
      id: 'm9_n90',
      type: 'scene',
      scene: { bg: 'nen_a', light: 'dark' },
      effects: [{ eyes_closed: false }],
      lines: [{ ch: 'narration', text: 'Hoảng loạn.' }],
      next: 'm9_d2',
    });
  });

  test('schema và validator chấp nhận', () => {
    expect(validateLevel(zero, assets)).toEqual([]);
  });

  test('node đó có thể được vào từ bất kỳ đâu, nên không được kế thừa ảnh có clue (G22)', () => {
    const noScene = levelAfter((raw) => {
      raw.on_sanity_zero = 'm9_n90';
      raw.nodes.push({ id: 'm9_n90', type: 'scene', lines: [{ ch: 'narration', text: 'Hoảng loạn.' }], next: 'm9_d2' });
    });
    expect(validateLevel(noScene, assets)).toEqual([
      'm9: m9_n90.scene — ảnh `nen_b` chứa manh mối c1 nhưng node không thêm c1 (G22)',
    ]);
  });

  test('về 0: hiện dòng, Tiếp tới node đó, rồi đi theo next, không quay vòng', () => {
    const s = { ...run(zero, []).state, sanity: 1 };
    const atZero = step(zero, s, { type: 'choose', index: 0 });
    expect(view(zero, atZero).exit).toEqual({ kind: 'continue', to: 'm9_n90' });
    const panic = step(zero, atZero, { type: 'continue' });
    expect(panic).toMatchObject({ node: 'm9_n90', sanity: 0 });
    expect(view(zero, panic).exit).toEqual({ kind: 'continue', to: 'm9_d2' });
    expect(step(zero, panic, { type: 'continue' })).toMatchObject({ node: 'm9_d2', phase: 'ending' });
  });

  test('các node chỉ tới được qua on_sanity_zero vẫn được tính là tới được', () => {
    const only = levelAfter((raw) => {
      raw.on_sanity_zero = 'm9_n90';
      raw.nodes.push(
        { id: 'm9_n90', type: 'scene', scene: { bg: 'nen_a', light: 'dark' }, next: 'm9_d3' },
        { id: 'm9_d3', type: 'ending', result: 'death', cause: 'Hoảng loạn', reveal: 'Về 0.', violates: ['L1'] },
      );
    });
    expect(validateLevel(only, assets)).toEqual([]);
  });

  test('on_sanity_zero không được là start', () => {
    const errors = validateLevel(levelAfter((raw) => (raw.on_sanity_zero = 'm9_n01')), assets);
    expect(errors).toContain('m9: on_sanity_zero — không được trỏ về `start`');
  });
});

describe('G27 · điều kiện has_dossier', () => {
  test('đúng khi hồ sơ đã mở khoá, kể cả từ màn trước', () => {
    expect(check({ has_dossier: 'hs_khac' }, level, initialState(level))).toBe(false);
    expect(check({ has_dossier: 'hs_khac' }, level, initialState(level, { unlocked: ['hs_khac'] }))).toBe(true);
  });

  test('validator: hồ sơ phải được khai báo ở màn này hoặc màn khác', () => {
    const uses = levelAfter((raw) => {
      raw.node('m9_n05').lines[2].if = { has_dossier: 'hs_khac' };
    });
    expect(validateLevel(uses, assets)).toContain('m9: m9_n05.lines[2].if — hồ sơ `hs_khac` chưa được khai báo');
    expect(validateLevel(uses, assets, new Set(['hs_khac']))).toEqual([]);
  });
});

describe('G28, G29 · nhiều kết cục sống; kết cục sống có consequence_of', () => {
  const two = levelAfter((raw) => {
    raw.node('m9_n08').choices = [
      { text: 'Sống A', goto: 'm9_e1' },
      { text: 'Sống B', goto: 'm9_e2' },
    ];
    delete raw.node('m9_n08').next;
    raw.nodes.push({
      id: 'm9_e2',
      type: 'ending',
      result: 'survive',
      cause: 'Sống nhưng mất người',
      reveal: 'Có người chết thay.',
      consequence_of: ['L2'],
      solution: ['k1', 'k2'],
    });
  });

  test('schema và validator chấp nhận', () => {
    expect(validateLevel(two, assets)).toEqual([]);
  });

  test('màn hình kết quả biết đạt kết cục nào và cụm sinh lộ của nó', () => {
    const s = run(two, ['Đi A', 'Đi B', '"Tìm."', 'Đếm tiếp', 'Sống B']).state;
    const e = endingView(two, s)!;
    expect(e).toMatchObject({ result: 'survive', cause: 'Sống nhưng mất người' });
    expect(e.solution.flatMap((l) => l.segments.filter((x) => x.mark === 'solution').map((x) => x.text))).toEqual([
      'phải được tuân thủ',
      'hệ quả',
    ]);
  });

  test('kết cục sống vẫn không được có violates', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_e1').violates = ['L1'];
    });
    expect(errors.join('\n')).toMatch(/m9_e1\)\.violates — kết cục sống không có `violates`/);
  });
});

describe('G31 · lựa chọn cùng chữ', () => {
  test('điều kiện loại trừ nhau: không cảnh báo; play() chọn đúng lựa chọn đang hiện', () => {
    const same = levelAfter((raw) => {
      raw.node('m9_n05').choices.push(
        { text: 'Đi tiếp', goto: 'm9_d1', if: { flag: 'co_c' } },
        { text: 'Đi tiếp', goto: 'm9_n07', if: { not_flag: 'co_c' } },
      );
    });
    expect(validateLevel(same, assets)).toEqual([]);
    expect(levelWarnings(same)).toEqual([]);
    expect(run(same, ['Đi A', 'Đi B', 'Đi tiếp']).state.node).toBe('m9_d1');
  });

  test('có thể cùng hiện: cảnh báo, không phải lỗi', () => {
    const same = levelAfter((raw) => {
      raw.node('m9_n05').choices.push({ text: 'Từ chối', goto: 'm9_n07' });
    });
    expect(validateLevel(same, assets)).toEqual([]);
    expect(levelWarnings(same)).toEqual([
      'm9: m9_n05.choices[2] và [3] — hai lựa chọn cùng chữ "Từ chối" có thể cùng hiện (G31)',
    ]);
  });

  test.each([
    [{ flag: 'a' }, { not_flag: 'a' }, true],
    [{ not_flag: 'a' }, { flag: 'a', clue: 'c1' }, true],
    [{ spot: 'x' }, { spot: 'y' }, true],
    [{ has_spot: false }, { spot: 'x' }, true],
    [{ role: 'seeker' as const }, { role: 'hider' as const }, true],
    [{ flag: 'a' }, { flag: 'b' }, false],
    [{ clue: 'c1' }, undefined, false],
  ])('exclusive(%j, %j) = %s', (a, b, expected) => {
    expect(exclusive(a, b)).toBe(expected);
  });
});

describe('G43 · clue của ảnh ghi theo màn (m3:c1), thay G32', () => {
  test('clue không ghi màn là lỗi schema', () => {
    const r = parseAssets('assets:\n  - {id: x, file: bg/x.png, alt: "X.", clue: c1}\n', 'assets.yaml');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.join('\n')).toMatch(/clue của ảnh phải có dạng m<màn>:c<số>/);
  });

  test('ảnh mang manh mối của màn khác được dùng tự do ở node thường', () => {
    const other = parseAssets(
      'assets:\n  - {id: nen_a, alt: "A.", placeholder: true}\n  - {id: nen_b, alt: "B.", placeholder: true, clue: "m1:c1"}\n',
      'assets.yaml',
    );
    if (!other.ok) throw new Error(other.errors.join('\n'));
    // m9_n02 (hub) không thêm c1; nếu nen_b thuộc m9 thì đó là lỗi G22, nhưng nen_b thuộc m1.
    const inherits = levelAfter((raw) => {
      delete raw.node('m9_n02').scene;
    });
    expect(validateLevel(inherits, other.value)).toEqual([]);
    expect(validateAssets(other.value, [level]).errors).toEqual(['assets: assets[1] (nen_b).clue — không có màn m1']);
  });

  test('trong màn sở hữu manh mối, quy tắc G22 vẫn áp', () => {
    const inherits = levelAfter((raw) => {
      delete raw.node('m9_n02').scene;
    });
    expect(validateLevel(inherits, assets)).toContain(
      'm9: m9_n02.scene — ảnh `nen_b` chứa manh mối c1 nhưng node không thêm c1 (G22)',
    );
  });
});
