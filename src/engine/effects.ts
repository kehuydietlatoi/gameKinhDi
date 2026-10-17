// Nơi duy nhất định nghĩa hiệu ứng `effects` (AGENTS.md mục 5.4).
// Bảng được khai báo theo EffectKey: thêm khoá vào schema mà quên ở đây sẽ lỗi typecheck.
import type { Effect, EffectKey, EffectValues, Level } from '../content/types.ts';
import { check } from './conditions.ts';
import { addUnique, EngineError, type GameState } from './state.ts';

type Appliers = { [K in EffectKey]: (s: GameState, value: EffectValues[K]) => GameState };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number) as [number, number];
  const total = (((h * 60 + m + minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

const appliers: Appliers = {
  sanity: (s, v) => {
    const sanity = clamp(s.sanity + v, 0, 5);
    const delta = sanity - s.sanity;
    return delta === 0 ? s : { ...s, sanity, notices: [...s.notices, { kind: 'sanity', delta }] };
  },
  flag: (s, v) => ({ ...s, flags: addUnique(s.flags, v) }),
  clue: (s, v) => ({ ...s, clues: addUnique(s.clues, v) }),
  role: (s, v) => ({ ...s, role: v }),
  spot: (s, v) => ({ ...s, spot: v }),
  found: (s, v) => {
    const npc = s.npc[v];
    if (!npc) throw new EngineError(`NPC không có trạng thái: ${v}`);
    return { ...s, npc: { ...s.npc, [v]: { ...npc, found: true, following: true } } };
  },
  actions_left: (s, v) => ({ ...s, actions_left: Math.max(0, s.actions_left + v) }),
  time: (s, v) => ({ ...s, time: v }),
  time_add: (s, v) => ({ ...s, time: addMinutes(s.time, v) }),
  visit: (s, v) => ({ ...s, visited: addUnique(s.visited, v) }),
  eyes_closed: (s, v) => ({ ...s, eyes_closed: v }),
};

function applyOne(state: GameState, effect: Effect): GameState {
  let s = state;
  for (const [key, value] of Object.entries(effect)) {
    if (key === 'if') continue;
    const apply = appliers[key as EffectKey] as ((s: GameState, v: unknown) => GameState) | undefined;
    if (!apply) throw new EngineError(`Hiệu ứng không xác định: ${key}`);
    s = apply(s, value);
  }
  return s;
}

/**
 * Áp hiệu ứng theo thứ tự. G40: hiệu ứng có `if` được xét sau khi mọi hiệu ứng
 * không điều kiện của cùng danh sách đã áp, theo thứ tự khai báo.
 */
export function applyEffects(state: GameState, effects: Effect[] | undefined, level?: Level): GameState {
  const list = effects ?? [];
  let s = list.filter((e) => !e.if).reduce(applyOne, state);
  for (const e of list) {
    if (!e.if) continue;
    if (!level) throw new EngineError('Hiệu ứng có điều kiện cần level để xét `if`');
    if (check(e.if, level, s)) s = applyOne(s, e);
  }
  return s;
}
