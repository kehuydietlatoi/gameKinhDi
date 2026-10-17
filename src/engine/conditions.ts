// Nơi duy nhất định nghĩa điều kiện `if` (AGENTS.md mục 5.4).
// Bảng được khai báo theo ConditionKey: thêm khoá vào schema mà quên ở đây sẽ lỗi typecheck.
import type { Condition, ConditionKey, ConditionValues, Level } from '../content/types.ts';
import { EngineError, following, type GameState } from './state.ts';

type Ctx = { level: Level; state: GameState };
type Evaluators = { [K in ConditionKey]: (value: ConditionValues[K], ctx: Ctx) => boolean };

const evaluators: Evaluators = {
  clue: (v, { state }) => state.clues.includes(v),
  flag: (v, { state }) => state.flags.includes(v),
  not_flag: (v, { state }) => !state.flags.includes(v),
  role: (v, { state }) => state.role === v,
  sanity_lte: (v, { state }) => state.sanity <= v,
  // G1: chỉ đếm các goto thuộc lựa chọn của hub đang đứng.
  visited_count_gte: (v, { level, state }) => {
    const hub = level.nodes.find((n) => n.id === state.node);
    if (hub?.type !== 'scene' || !hub.hub) throw new EngineError(`visited_count_gte dùng ngoài hub (${state.node})`);
    const targets = new Set(hub.choices!.map((c) => c.goto));
    return state.visited.filter((id) => targets.has(id)).length >= v;
  },
  not_visited: (v, { state }) => !state.visited.includes(v),
  not_highlighted: (v, { state }) => !state.highlights.includes(v),
  spot: (v, { state }) => state.spot === v,
  has_spot: (v, { state }) => (state.spot !== '') === v,
  actions_left_lte: (v, { state }) => state.actions_left <= v,
  following_lte: (v, { state }) => following(state) <= v,
  following_gte: (v, { state }) => following(state) >= v,
};

/** Không có `if` là đúng; nhiều khoá là AND (G10). */
export function check(cond: Condition | undefined, level: Level, state: GameState): boolean {
  if (!cond) return true;
  return Object.entries(cond).every(([key, value]) => {
    const evaluate = evaluators[key as ConditionKey] as ((v: unknown, ctx: Ctx) => boolean) | undefined;
    if (!evaluate) throw new EngineError(`Điều kiện không xác định: ${key}`);
    return evaluate(value, { level, state });
  });
}
