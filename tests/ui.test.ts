import { describe, expect, test } from 'vitest';
import { initialState } from '../src/engine/index.ts';
import { DEFAULT_SETTINGS, loadSave, SAVE_KEY, usableState, writeSave } from '../src/ui/save.ts';
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
    writeSave({ version: 1, state, settings: { speed: 'fast' } }, store);
    expect([...store.data.keys()]).toEqual([SAVE_KEY]);
    expect(loadSave(store)).toEqual({ version: 1, state, settings: { speed: 'fast' } });
  });

  test('storage trống, hỏng hoặc ném lỗi thì dùng mặc định', () => {
    const empty = { version: 1, state: null, settings: DEFAULT_SETTINGS };
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
    store.setItem(SAVE_KEY, JSON.stringify({ version: 1, state: null, settings: { speed: 'turbo' } }));
    expect(loadSave(store).settings).toEqual({ speed: 'normal' });
  });

  test('trạng thái không khớp màn bị bỏ', () => {
    const state = initialState(level);
    expect(usableState(state, level)).toBe(state);
    expect(usableState({ ...state, node: 'm1_n99' }, level)).toBeNull();
    expect(usableState({ ...state, level: 'm2' }, level)).toBeNull();
    expect(usableState(null, level)).toBeNull();
  });
});
