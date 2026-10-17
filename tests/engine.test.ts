// Test đơn vị engine trên màn giả tests/fixtures/minimal.yaml.
import { describe, expect, test } from 'vitest';
import type { Level } from '../src/content/types.ts';
import { check } from '../src/engine/conditions.ts';
import { applyEffects } from '../src/engine/effects.ts';
import {
  bloodtextPanel,
  campaignSummary,
  endingView,
  EngineError,
  following,
  initialState,
  step,
  view,
  type GameState,
} from '../src/engine/index.ts';
import { interpolate, invalidPlaceholders } from '../src/engine/interpolate.ts';
import { resolveScene } from '../src/engine/scene.ts';
import { levelAfter, loadFixtureLevel } from './helpers/fixtures.ts';
import { run } from './helpers/play.ts';

const level: Level = loadFixtureLevel();
const fresh = () => initialState(level);
const at = (node: string, patch: Partial<GameState> = {}): GameState => ({ ...fresh(), node, ...patch });

describe('trạng thái đầu', () => {
  test('lấy từ init, vào node start, áp cảnh của start', () => {
    const s = fresh();
    expect(s).toMatchObject({
      node: 'm9_n01',
      sanity: 3,
      actions_left: 2,
      time: '22:00',
      role: 'none',
      spot: '',
      eyes_closed: false,
      scene: { bg: 'nen_a', light: 'flicker' },
      phase: 'highlight',
      bloodtextSeen: true,
    });
    expect(s.npc).toEqual({
      npc_a: { alive: true, found: false, following: false },
      npc_b: { alive: true, found: false, following: false },
    });
  });

  test('tất định: cùng đầu vào cho cùng kết quả', () => {
    expect(fresh()).toEqual(fresh());
    const a = run(level, ['Đi A', 'Đi B']).state;
    const b = run(level, ['Đi A', 'Đi B']).state;
    expect(a).toEqual(b);
  });
});

describe('điều kiện', () => {
  const s = at('m9_n02', {
    clues: ['c1'],
    flags: ['co_c'],
    role: 'seeker',
    sanity: 2,
    spot: 'tu',
    highlights: ['k2'],
    visited: ['m9_n03', 'm9_n07'],
    actions_left: 0,
    npc: { npc_a: { alive: true, found: true, following: true }, npc_b: { alive: true, found: false, following: false } },
  });
  test.each([
    [{ clue: 'c1' }, true],
    [{ clue: 'c2' }, false],
    [{ flag: 'co_c' }, true],
    [{ not_flag: 'co_c' }, false],
    [{ role: 'seeker' as const }, true],
    [{ sanity_lte: 2 }, true],
    [{ sanity_lte: 1 }, false],
    [{ visited_count_gte: 1 }, true], // m9_n07 không phải goto của hub m9_n02 nên không được đếm
    [{ visited_count_gte: 2 }, false],
    [{ not_visited: 'm9_n03' }, false],
    [{ not_highlighted: 'k1' }, true],
    [{ not_highlighted: 'k2' }, false],
    [{ spot: 'tu' }, true],
    [{ has_spot: true }, true],
    [{ has_spot: false }, false],
    [{ actions_left_lte: 0 }, true],
    [{ following_lte: 0 }, false],
    [{ following_gte: 1 }, true],
    [{ sanity_lte: 2, not_highlighted: 'k1' }, true],
    [{ sanity_lte: 2, not_highlighted: 'k2' }, false],
  ])('%j → %s', (cond, expected) => {
    expect(check(cond, level, s)).toBe(expected);
  });

  test('visited_count_gte ngoài hub là lỗi engine', () => {
    expect(() => check({ visited_count_gte: 1 }, level, at('m9_n05'))).toThrow(EngineError);
  });

  test('điều kiện không xác định là lỗi, không bị bỏ qua', () => {
    expect(() => check({ bogus: 1 } as never, level, fresh())).toThrow('Điều kiện không xác định: bogus');
  });
});

describe('hiệu ứng', () => {
  test('sanity kẹp trong 0–5 và chỉ báo khi thật sự đổi', () => {
    const s = applyEffects({ ...fresh(), sanity: 1 }, [{ sanity: -1 }, { sanity: -1 }, { sanity: 9 }]);
    expect(s.sanity).toBe(5);
    expect(s.notices).toEqual([{ kind: 'sanity', delta: -1 }, { kind: 'sanity', delta: 5 }]);
  });

  test('found tăng following một lần duy nhất', () => {
    const s = applyEffects(fresh(), [{ found: 'npc_a' }, { found: 'npc_a' }]);
    expect(s.npc.npc_a).toEqual({ alive: true, found: true, following: true });
    expect(following(s)).toBe(1);
  });

  test('time_add cộng phút và quay vòng qua nửa đêm; time đặt tuyệt đối', () => {
    const s = applyEffects({ ...fresh(), time: '23:59' }, [{ time_add: 60 }]);
    expect(s.time).toBe('00:59');
    expect(applyEffects(s, [{ time: '04:00' }]).time).toBe('04:00');
  });

  test('actions_left cộng/trừ, không âm', () => {
    expect(applyEffects(fresh(), [{ actions_left: -5 }]).actions_left).toBe(0);
  });

  test('các hiệu ứng còn lại', () => {
    const s = applyEffects(fresh(), [
      { flag: 'x' },
      { clue: 'c2' },
      { role: 'hider' },
      { spot: 'tu' },
      { visit: 'm9_n03' },
      { eyes_closed: true },
    ]);
    expect(s).toMatchObject({ flags: ['x'], clues: ['c2'], role: 'hider', spot: 'tu', visited: ['m9_n03'], eyes_closed: true });
  });

  test('hiệu ứng không xác định là lỗi', () => {
    expect(() => applyEffects(fresh(), [{ bogus: 1 } as never])).toThrow('Hiệu ứng không xác định: bogus');
  });
});

describe('chèn biến', () => {
  test('{var} và {var ± n}', () => {
    expect(interpolate('{following} / {following + 2} / {sanity - 1}', { following: 3, sanity: 4, actions_left: 0 })).toBe(
      '3 / 5 / 3',
    );
  });
  test('phát hiện biểu thức lạ', () => {
    expect(invalidPlaceholders('{following}{x}{following * 2} }')).toEqual(['{x}', '{following * 2}', 'dấu ngoặc nhọn lẻ']);
  });
});

describe('cảnh', () => {
  test('chỉ ghi đè trường được nêu; dạng danh sách lấy mục đầu khớp', () => {
    const s = { ...fresh(), scene: { bg: 'nen_a', light: 'flicker' as const } };
    expect(resolveScene({ light: 'dark' }, level, s)).toEqual({ bg: 'nen_a', light: 'dark' });
    const list = [{ if: { spot: 'tu' }, light: 'dark' as const }, { bg: 'nen_b', light: 'normal' as const }];
    expect(resolveScene(list, level, { ...s, spot: 'tu' })).toEqual({ bg: 'nen_a', light: 'dark' });
    expect(resolveScene(list, level, s)).toEqual({ bg: 'nen_b', light: 'normal' });
  });

  test('nhắm mắt thì màn hình đen', () => {
    const t = run(level, ['Đi A', 'Đi B', '"Tìm."']);
    expect(t.state.node).toBe('m9_n07');
    expect(view(level, t.state).scene.light).toBe('dark');
  });

  test('kết cục chết không khai báo cảnh thì nền đen', () => {
    const t = run(level, ['Đi A', 'Đi B', 'Từ chối']);
    expect(t.state.scene).toEqual({ bg: null, light: 'dark' });
  });
});

describe('luồng', () => {
  test('bước đánh dấu chặn mọi lối ra cho tới khi xác nhận', () => {
    const s = fresh();
    expect(view(level, s).exit).toEqual({ kind: 'none' });
    expect(() => step(level, s, { type: 'continue' })).toThrow(EngineError);
    expect(() => step(level, s, { type: 'highlight', ids: ['k1', 'k2', 'k1', 'k9'] })).toThrow('Từ khoá không tồn tại: k9');
    const t = step(level, s, { type: 'highlight', ids: ['k1'] });
    expect(t).toMatchObject({ phase: 'scene', highlights: ['k1'], highlightDone: true });
    expect(view(level, t).exit).toEqual({ kind: 'continue', to: 'm9_n02' });
  });

  test('tối đa 3 cụm', () => {
    const many = levelAfter((raw) => {
      raw.keywords.push(
        { id: 'k3', line: 'L1', text: 'Dòng', correct: false },
        { id: 'k4', line: 'L1', text: 'một', correct: false },
      );
    });
    expect(() => step(many, initialState(many), { type: 'highlight', ids: ['k1', 'k2', 'k3', 'k4'] })).toThrow(
      'tối đa 3',
    );
  });

  test('hub: lựa chọn đã chọn bị ẩn, dòng hub hiện mỗi lần vào', () => {
    const t = run(level, ['Đi A']);
    expect(t.path).toEqual(['m9_n01', 'm9_n02', 'm9_n03', 'm9_n02']);
    const v = view(level, t.state);
    expect(v.exit).toEqual({ kind: 'choices', choices: [{ index: 1, text: 'Đi B' }] });
    expect(v.lines).toEqual([{ ch: 'sound', src: 'sau lưng', vol: 1, text: 'Có 1 người, 3 tiếng.' }]);
    expect(t.views.find((x) => x.node === 'm9_n02')!.lines).toEqual([
      { ch: 'sound', src: 'sau lưng', vol: 1, text: 'Không ai.' },
    ]);
    expect(t.state.time).toBe('23:00');
  });

  test('hub: điều kiện xong thì thay mọi lựa chọn bằng một nút Tiếp, sau khi hiện dòng (G4)', () => {
    let s = run(level, ['Đi B']).state;
    expect(s.actions_left).toBe(1);
    s = step(level, s, { type: 'choose', index: 2 }); // "Đi C" hiện vì co_c đã bật
    expect(s.node).toBe('m9_n03b');
    s = step(level, s, { type: 'continue' });
    expect(s.node).toBe('m9_n02');
    const v = view(level, s);
    expect(v.lines.length).toBe(1);
    expect(v.exit).toEqual({ kind: 'continue', to: 'm9_n05' });
    expect(s.scene).toEqual({ bg: 'nen_a', light: 'flicker' });
  });

  test('hub: xong mà không có dòng nào hiện thì đi thẳng tới hub_exit (G45)', () => {
    const silent = levelAfter((raw) => {
      raw.node('m9_n02').lines = [];
    });
    let s = run(silent, ['Đi B']).state;
    s = step(silent, s, { type: 'choose', index: 2 });
    s = step(silent, s, { type: 'continue' });
    expect(s.node).toBe('m9_n05');
    expect(s.scene).toEqual({ bg: 'nen_a', light: 'flicker' }); // cảnh của hub vẫn được áp (G4)
  });

  test('hub tính theo lượt cho biết số lượt còn lại; nơi khác thì không (G46)', () => {
    const t = run(level, ['Đi A']);
    expect(t.views.find((x) => x.node === 'm9_n02')!.actionsLeft).toBe(2);
    expect(view(level, t.state).actionsLeft).toBe(1);
    expect(t.views.find((x) => x.node === 'm9_n03')!.actionsLeft).toBeNull();
  });

  test('chọn lựa chọn đang ẩn là lỗi', () => {
    const s = run(level, []).state;
    expect(s.node).toBe('m9_n02');
    expect(() => step(level, s, { type: 'choose', index: 2 })).toThrow('Lựa chọn 2 không có ở m9_n02');
  });

  test('G12: mọi lựa chọn bị ẩn thì đi theo next', () => {
    const atChoice = run(level, ['Đi A', 'Đi B']).state;
    expect(atChoice.node).toBe('m9_n05');
    const withSpot = { ...atChoice, spot: 'tu', clues: [] };
    expect(view(level, withSpot).exit).toMatchObject({ kind: 'choices' }); // vẫn còn "Tìm." và "Từ chối"
    const noChoice = levelAfter((raw) => {
      raw.node('m9_n05').choices = [raw.node('m9_n05').choices[0]];
    });
    const s2 = { ...withSpot };
    expect(view(noChoice, s2).exit).toEqual({ kind: 'continue', to: 'm9_n07' });
  });

  test('thứ tự G13: hiệu ứng lựa chọn → cảnh → hiệu ứng node → điều kiện dòng', () => {
    const t = run(level, ['Đi A', 'Đi B', 'Trốn']);
    expect(t.state.node).toBe('m9_n06');
    expect(t.state.scene).toEqual({ bg: 'nen_a', light: 'dark' }); // spot đặt ở lựa chọn, có trước cảnh
    expect(view(level, t.state).lines).toEqual([{ ch: 'env', sense: 'chạm', text: 'Tối.' }]);
  });

  test('nhắm mắt: ẩn env nhìn; mở mắt ở lựa chọn trước khi vào kết cục', () => {
    const t = run(level, ['Đi A', 'Đi B', '"Tìm."']);
    expect(view(level, t.state).lines).toEqual([{ ch: 'narration', text: 'Đếm.' }]);
    const d = run(level, ['Mở mắt'], { from: t.state }).state;
    expect(d).toMatchObject({ node: 'm9_d1', eyes_closed: false, phase: 'ending', deaths: 1 });
  });

  test('thông báo Tỉnh táo chỉ thuộc lần chuyển gần nhất', () => {
    const t = run(level, ['Đi A']);
    expect(t.views.find((x) => x.node === 'm9_n03')!.notices).toEqual([{ kind: 'sanity', delta: -1 }]);
    expect(t.state.notices).toEqual([]);
  });

  test('sanity về 0 mà màn không có on_sanity_zero là lỗi engine (G19)', () => {
    const s = { ...run(level, []).state, sanity: 1 };
    expect(() => step(level, s, { type: 'choose', index: 0 })).toThrow(/on_sanity_zero/);
  });

  test('sanity về 0: hiện dòng của node rồi chỉ còn nút Tiếp tới on_sanity_zero', () => {
    const withZero = levelAfter((raw) => {
      raw.on_sanity_zero = 'm9_d2';
    });
    const s = { ...run(withZero, []).state, sanity: 1 };
    const t = step(withZero, s, { type: 'choose', index: 0 });
    expect(t.node).toBe('m9_n03');
    expect(view(withZero, t).lines.length).toBe(1);
    expect(view(withZero, t).exit).toEqual({ kind: 'continue', to: 'm9_d2' });
  });
});

describe('Huyết tự', () => {
  const sane = run(level, []).state;

  test('sanity ≥ 3: bản gốc', () => {
    expect(bloodtextPanel(level, sane)[0]!.segments.map((x) => x.text).join('')).toBe('Dòng một phải được tuân thủ.');
  });

  test('sanity ≤ 2 và chưa đánh dấu: bản méo, không có dấu hiệu khác', () => {
    const panel = bloodtextPanel(level, { ...sane, sanity: 2 });
    expect(panel[0]).toEqual({ id: 'L1', ink: 'do', segments: [{ text: 'Dòng một có thể bỏ qua.' }] });
    expect(level.bloodtext[0]!.text).toBe('Dòng một phải được tuân thủ.'); // level giữ bản gốc
  });

  test('đã đánh dấu: không bị méo và được gạch chân', () => {
    const marked = run(level, [], { highlights: ['k1'] }).state;
    expect(bloodtextPanel(level, { ...marked, sanity: 1 })[0]).toEqual({
      id: 'L1',
      ink: 'do',
      segments: [{ text: 'Dòng một ' }, { text: 'phải được tuân thủ', mark: 'highlighted' }, { text: '.' }],
    });
  });

  test('nút Huyết tự bị khoá trước khi Huyết tự xuất hiện', () => {
    const quiet = levelAfter((raw) => {
      raw.nodes[0].lines.splice(6, 1);
      delete raw.nodes[0].highlight;
      raw.keywords = [];
      raw.distortions = [];
      raw.solution = ['L1'];
    });
    const s = initialState(quiet);
    expect(s.bloodtextSeen).toBe(false);
    expect(bloodtextPanel(quiet, s)).toEqual([]);
  });

  test('dòng bloodtext trong node hiện bản méo theo state (G9, G10)', () => {
    const atChoice = run(level, ['Đi A', 'Đi B']).state;
    expect(atChoice).toMatchObject({ node: 'm9_n05', sanity: 2 });
    expect(view(level, atChoice).lines[1]).toEqual({
      ch: 'bloodtext',
      glow: false,
      lines: [{ id: 'L1', ink: 'do', segments: [{ text: 'Dòng một có thể bỏ qua.' }] }],
    });
  });
});

describe('kết cục', () => {
  test('màn hình chết: solution riêng của ending, bản gốc', () => {
    const t = run(level, ['Đi A', 'Đi B', 'Từ chối'], { highlights: ['k2'] });
    const e = endingView(level, { ...t.state, sanity: 1 })!;
    expect(e).toMatchObject({ result: 'death', cause: 'Vi phạm', reveal: 'Vi phạm L1.' });
    expect(e.solution[0]).toEqual({ id: 'L1', ink: 'do', segments: [{ text: 'Dòng một phải được tuân thủ.', mark: 'solution' }] });
    expect(e.keywords).toEqual([{ id: 'k2', text: 'hệ quả', correct: false }]);
  });

  test('solution cấp màn tô cụm từ khoá', () => {
    const t = run(level, ['Đi A', 'Đi B', 'Trốn', 'Nín thở']);
    expect(t.state.node).toBe('m9_d2');
    expect(endingView(level, t.state)!.solution[0]!.segments).toEqual([
      { text: 'Dòng một ' },
      { text: 'phải được tuân thủ', mark: 'solution' },
      { text: '.' },
    ]);
  });

  test('sống sót mở khoá hồ sơ khi đủ điều kiện', () => {
    const win = run(level, ['Đi A', 'Đi B', '"Tìm."', 'Đếm tiếp']).state;
    expect(win).toMatchObject({ node: 'm9_e1', phase: 'ending', unlocked: ['hs_thu'], deaths: 0, time: '04:00' });
    expect(endingView(level, win)!.dossiers).toEqual(['Hồ sơ thử']);
    const noClue = run(level, ['Đi B', 'Đi C', '"Tìm."', 'Đếm tiếp']).state;
    expect(noClue.unlocked).toEqual([]);
    expect(endingView(level, noClue)!.dossiers).toEqual([]);
  });

  test('Chơi lại: về start với init, xoá đánh dấu, giữ số lần chết và hồ sơ', () => {
    const dead = run(level, ['Đi A', 'Đi B', 'Từ chối'], { highlights: ['k1'] }).state;
    const again = step(level, { ...dead, unlocked: ['hs_thu'] }, { type: 'restart' });
    expect(again).toEqual({ ...initialState(level, { deaths: 1, unlocked: ['hs_thu'], campaign: dead.campaign }) });
    expect(again.highlights).toEqual([]);
  });
});

describe('số liệu chuyến chơi (G50, G51, G53)', () => {
  const DIE = ['Đi A', 'Đi B', 'Từ chối'];

  test('màn bắt đầu được ghi vào reached; chết được đếm theo kết cục và cộng dồn', () => {
    expect(initialState(level).campaign).toEqual({ endings: {}, deaths: 0, keywords: {}, reached: ['m9'] });
    const dead = run(level, DIE).state;
    expect(dead.campaign).toMatchObject({ endings: { [dead.node]: 1 }, deaths: 1 });
    const twice = run(level, DIE, { from: step(level, dead, { type: 'restart' }) }).state;
    expect(twice.campaign).toMatchObject({ endings: { [dead.node]: 2 }, deaths: 2 });
    // Sang màn khác vẫn giữ số liệu.
    expect(initialState(level, { campaign: twice.campaign }).campaign.deaths).toBe(2);
  });

  test('G50: lần chết đầu ở một kết cục ẩn câu hé lộ, từ lần thứ hai thì hiện', () => {
    const dead = run(level, DIE).state;
    expect(endingView(level, dead)!.revealHidden).toBe(true);
    const twice = run(level, DIE, { from: step(level, dead, { type: 'restart' }) }).state;
    expect(endingView(level, twice)!.revealHidden).toBe(false);
  });

  test('campaignSummary: chết, từ khoá trúng / đã đánh dấu, kết cục đã mở / tổng số', () => {
    const c = { endings: { m9_d1: 2, khong_co: 1 }, deaths: 2, keywords: { m1: { hit: 2, marked: 3 }, m2: { hit: 1, marked: 1 } }, reached: ['m9'] };
    // Màn giả có ba kết cục m9_e1, m9_d1, m9_d2; id không có thật thì không tính.
    expect(campaignSummary([level], c)).toEqual({ deaths: 2, keywordsHit: 3, keywordsMarked: 4, endingsOpened: 1, endingsTotal: 3 });
  });

});
