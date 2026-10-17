// Lưu tiến trình vào localStorage (AGENTS.md mục 10).
// Mọi đọc/ghi bọc try/catch: storage lỗi hoặc trống thì game vẫn chạy.
// Đổi cấu trúc Save thì tăng phiên bản key và viết hàm migrate.
import type { Level } from '../content/types.ts';
import type { GameState } from '../engine/index.ts';

export const SAVE_KEY = 'sinhlo.save.v1';

export type Speed = 'slow' | 'normal' | 'fast' | 'instant';
export type Settings = { speed: Speed };
export type Save = { version: 1; state: GameState | null; settings: Settings };

export const DEFAULT_SETTINGS: Settings = { speed: 'normal' };
const SPEEDS: Speed[] = ['slow', 'normal', 'fast', 'instant'];

export function loadSave(storage: Pick<Storage, 'getItem'> | undefined = safeStorage()): Save {
  const empty: Save = { version: 1, state: null, settings: DEFAULT_SETTINGS };
  try {
    const raw = storage?.getItem(SAVE_KEY);
    if (!raw) return empty;
    const data = JSON.parse(raw) as Partial<Save>;
    if (data.version !== 1) return empty;
    const speed = SPEEDS.includes(data.settings?.speed as Speed) ? (data.settings!.speed as Speed) : 'normal';
    return { version: 1, state: data.state ?? null, settings: { speed } };
  } catch {
    return empty;
  }
}

export function writeSave(save: Save, storage: Pick<Storage, 'setItem'> | undefined = safeStorage()): void {
  try {
    storage?.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Storage đầy hoặc bị chặn: bỏ qua, game vẫn chạy.
  }
}

/** Trạng thái đã lưu chỉ dùng lại khi khớp màn hiện tại; nếu không thì bỏ. */
export function usableState(state: GameState | null, level: Level): GameState | null {
  if (!state || typeof state !== 'object') return null;
  if (state.level !== level.level || !level.nodes.some((n) => n.id === state.node)) return null;
  if (typeof state.sanity !== 'number' || !Array.isArray(state.lines) || !state.npc) return null;
  return state;
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
