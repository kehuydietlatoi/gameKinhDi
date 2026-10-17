import { describe, expect, test } from 'vitest';
import { initialState, type GameState } from '../src/engine/index.ts';
import { DEFAULT_SETTINGS, loadSave, SAVE_KEY, SAVE_KEY_V1, usableState, writeSave } from '../src/ui/save.ts';
import { strings } from '../src/ui/strings.ts';
import { contrast, TEXT_COLORS, theme } from '../src/ui/theme.ts';
import { loadLevel } from './helpers/play.ts';

describe('màu UI (AGENTS.md mục 9)', () => {
  test.each(TEXT_COLORS)('%s đạt ≥ 4.5:1 trên nền tối nhất và trên surface', (name) => {
    expect(contrast(theme[name], theme.bg)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme[name], theme.surface)).toBeGreaterThanOrEqual(4.5);
  });

  test('chữ Huyết tự không dùng màu máu của ảnh', () => {
    expect(theme.blood).toBe('#ff5a52');
    expect(contrast('#8a0b0b', theme.bg)).toBeLessThan(4.5);
  });
});

describe('chuỗi UI', () => {
  test('thông báo Tỉnh táo dùng dấu trừ', () => {
    expect(strings.sanityNotice(-1)).toBe('Tỉnh táo −1');
    expect(strings.sanityNotice(2)).toBe('Tỉnh táo +2');
  });
});

describe('lưu tiến trình (AGENTS.md mục 10)', () => {
  const memory = () => {
    const data = new Map<string, string>();
    return {
      data,
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
    };
  };
  const level = loadLevel('m1');

  test('ghi rồi đọc lại', () => {
    const store = memory();
    const state = initialState(level);
    const save = { version: 2 as const, state, settings: { speed: 'fast' as const }, lastMarks: { level: 'm1', ids: ['k4'] } };
    writeSave(save, store);
    expect([...store.data.keys()]).toEqual([SAVE_KEY]);
    expect(SAVE_KEY).toBe('sinhlo.save.v2');
    expect(loadSave(store)).toEqual(save);
  });

  test('G55: bản lưu v1 được migrate sang v2, thêm campaign', () => {
    const store = memory();
    const v1State: Partial<GameState> = { ...initialState(loadLevel('m3')), deaths: 2 };
    delete v1State.campaign;
    store.setItem(SAVE_KEY_V1, JSON.stringify({ version: 1, state: v1State, settings: { speed: 'slow' } }));
    const save = loadSave(store);
    expect(save).toMatchObject({ version: 2, settings: { speed: 'slow' }, lastMarks: null });
    expect(save.state!.campaign).toEqual({ endings: {}, deaths: 2, keywords: {}, reached: ['m1', 'm2', 'm3'] });
    expect(usableState(save.state, loadLevel('m3'))).not.toBeNull();
    // Bản v2 có rồi thì không đọc v1 nữa.
    store.setItem(SAVE_KEY, JSON.stringify({ version: 2, state: null, settings: { speed: 'fast' }, lastMarks: null }));
    expect(loadSave(store).settings.speed).toBe('fast');
  });

  test('storage trống, hỏng hoặc ném lỗi thì dùng mặc định', () => {
    const empty = { version: 2, state: null, settings: DEFAULT_SETTINGS, lastMarks: null };
    expect(loadSave(memory())).toEqual(empty);
    const broken = memory();
    broken.setItem(SAVE_KEY, '{không phải json');
    expect(loadSave(broken)).toEqual(empty);
    const throwing = {
      getItem: () => {
        throw new Error('SecurityError');
      },
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    };
    expect(loadSave(throwing)).toEqual(empty);
    expect(() => writeSave(empty as never, throwing)).not.toThrow();
    expect(loadSave(undefined)).toEqual(empty);
  });

  test('tốc độ lạ trở về mặc định', () => {
    const store = memory();
    store.setItem(SAVE_KEY, JSON.stringify({ version: 2, state: null, settings: { speed: 'turbo' }, lastMarks: null }));
    expect(loadSave(store).settings).toEqual({ speed: 'normal' });
  });

  test('trạng thái không khớp màn bị bỏ', () => {
    const state = initialState(level);
    expect(usableState(state, level)).toBe(state);
    expect(usableState({ ...state, node: 'm1_n99' }, level)).toBeNull();
    expect(usableState({ ...state, level: 'm2' }, level)).toBeNull();
    expect(usableState(null, level)).toBeNull();
    const noCampaign: Partial<GameState> = { ...state };
    delete noCampaign.campaign;
    expect(usableState(noCampaign as GameState, level)).toBeNull();
  });
});
