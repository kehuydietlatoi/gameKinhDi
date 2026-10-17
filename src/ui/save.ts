// Lưu tiến trình vào localStorage (AGENTS.md mục 10).
// Mọi đọc/ghi bọc try/catch: storage lỗi hoặc trống thì game vẫn chạy.
// Đổi cấu trúc Save thì tăng phiên bản key và viết hàm migrate.
// v2 (G55): state có `campaign` (G50, G51, G53); Save có `lastMarks` (G49).
import type { Level } from '../content/types.ts';
import { emptyCampaign, type Campaign, type GameState } from '../engine/index.ts';

export const SAVE_KEY = 'sinhlo.save.v2';
export const SAVE_KEY_V1 = 'sinhlo.save.v1';

export type Speed = 'slow' | 'normal' | 'fast' | 'instant';
export type Settings = { speed: Speed };
/** Từ khoá đánh dấu lần trước, để Chơi lại chọn sẵn (G49). */
export type LastMarks = { level: string; ids: string[] } | null;
export type Save = { version: 2; state: GameState | null; settings: Settings; lastMarks: LastMarks };

export const DEFAULT_SETTINGS: Settings = { speed: 'normal' };
const SPEEDS: Speed[] = ['slow', 'normal', 'fast', 'instant'];
const EMPTY: Save = { version: 2, state: null, settings: DEFAULT_SETTINGS, lastMarks: null };

type Store = Pick<Storage, 'getItem'>;

export function loadSave(storage: Store | undefined = safeStorage()): Save {
  try {
    const raw = storage?.getItem(SAVE_KEY);
    if (raw) return parseV2(JSON.parse(raw));
    const old = storage?.getItem(SAVE_KEY_V1);
    if (old) return migrateV1(JSON.parse(old));
    return EMPTY;
  } catch {
    return EMPTY;
  }
}

function speedOf(settings: unknown): Settings {
  const speed = (settings as Partial<Settings> | undefined)?.speed;
  return { speed: SPEEDS.includes(speed as Speed) ? (speed as Speed) : 'normal' };
}

function parseV2(data: Partial<Save>): Save {
  if (data.version !== 2) return EMPTY;
  const marks = data.lastMarks;
  const lastMarks =
    marks && typeof marks.level === 'string' && Array.isArray(marks.ids) ? { level: marks.level, ids: marks.ids } : null;
  return { version: 2, state: data.state ?? null, settings: speedOf(data.settings), lastMarks };
}

/** v1 → v2: thêm campaign. Không biết lịch sử cũ nên coi như đã tới mọi màn đến màn đang chơi. */
export function migrateV1(data: { version?: number; state?: GameState | null; settings?: unknown }): Save {
  if (data.version !== 1) return EMPTY;
  const old = data.state;
  if (!old || typeof old !== 'object' || typeof old.level !== 'string') {
    return { ...EMPTY, settings: speedOf(data.settings) };
  }
  const n = Number(old.level.slice(1));
  const campaign: Campaign = {
    ...emptyCampaign(),
    deaths: typeof old.deaths === 'number' ? old.deaths : 0,
    reached: Array.from({ length: Number.isInteger(n) && n > 0 ? n : 1 }, (_, i) => `m${i + 1}`),
  };
  return { version: 2, state: { ...old, campaign }, settings: speedOf(data.settings), lastMarks: null };
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
  const c = state.campaign;
  if (!c || typeof c !== 'object' || !Array.isArray(c.reached) || typeof c.deaths !== 'number') return null;
  return state;
}

function safeStorage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}
