// Máy trạng thái: step(level, state, action) => state. Hàm thuần, tất định (AGENTS.md mục 5).
import type { Effect, EndingNode, Level, Node, SceneNode } from '../content/types.ts';
import { check } from './conditions.ts';
import { applyEffects } from './effects.ts';
import { resolveScene } from './scene.ts';
import { addUnique, EngineError, type GameState, type NpcState } from './state.ts';

export type Action =
  | { type: 'choose'; index: number } // chỉ số trong node.choices (gốc, không phải danh sách đang hiện)
  | { type: 'continue' }
  | { type: 'highlight'; ids: string[] } // [] = bỏ qua
  | { type: 'restart' };

export type Exit =
  | { kind: 'choices'; choices: { index: number; text: string }[] }
  | { kind: 'continue'; to: string }
  | { kind: 'none' };

export const MAX_HIGHLIGHTS = 3;

export function nodeById(level: Level, id: string): Node {
  const node = level.nodes.find((n) => n.id === id);
  if (!node) throw new EngineError(`Node không tồn tại: ${id}`);
  return node;
}

/** Tỉnh táo luôn lấy từ `init` của màn (G23); chỉ số lần chết và hồ sơ được mang theo. */
export type InitOptions = { deaths?: number; unlocked?: string[] };

export function initialState(level: Level, opts: InitOptions = {}): GameState {
  const npc: Record<string, NpcState> = {};
  for (const n of level.npcs) if (!n.group) npc[n.id] = { alive: true, found: false, following: false };
  const base: GameState = {
    level: level.level,
    node: level.start,
    phase: 'scene',
    lines: [],
    notices: [],
    sanity: level.init.sanity,
    flags: [],
    clues: [],
    actions_left: level.init.actions_left,
    role: 'none',
    npc,
    visited: [],
    time: level.init.time,
    highlights: [],
    highlightDone: false,
    eyes_closed: false,
    spot: '',
    scene: { bg: null, light: 'normal' },
    bloodtextSeen: false,
    deaths: opts.deaths ?? 0,
    unlocked: opts.unlocked ?? [],
  };
  return enter(level, base, level.start);
}

/** Vào node theo thứ tự G13. Hiệu ứng của lựa chọn đã được áp trước khi gọi. */
function enter(level: Level, state: GameState, id: string): GameState {
  const node = nodeById(level, id);
  let s: GameState = { ...state, node: id, scene: resolveScene(node.scene, level, state) };
  // G26: ghi lại lần vào on_sanity_zero để chỉ chuyển hướng một lần.
  if (id === level.on_sanity_zero) s = { ...s, visited: addUnique(s.visited, id) };

  if (node.type === 'ending') return enterEnding(level, s, node);

  s = applyEffects(s, node.effects, level);
  const lines = node.lines.flatMap((l, i) => (check(l.if, level, s) ? [i] : []));
  s = {
    ...s,
    lines,
    phase: node.highlight && !s.highlightDone ? 'highlight' : 'scene',
    bloodtextSeen: s.bloodtextSeen || lines.some((i) => node.lines[i]!.ch === 'bloodtext'),
  };
  if (s.sanity === 0 && !level.on_sanity_zero) {
    throw new EngineError(`Tỉnh táo về 0 ở ${id} nhưng màn ${level.level} không có on_sanity_zero (G19)`);
  }
  return s;
}

function enterEnding(level: Level, state: GameState, node: EndingNode): GameState {
  const scene = node.scene === undefined && node.result === 'death' ? { bg: null, light: 'dark' as const } : state.scene;
  const lines = node.lines.flatMap((l, i) => (check(l.if, level, state) ? [i] : []));
  let unlocked = state.unlocked;
  if (node.result === 'survive') {
    for (const u of node.unlock ?? []) if (check(u.if, level, state)) unlocked = addUnique(unlocked, u.dossier);
  }
  return {
    ...state,
    scene,
    lines,
    phase: 'ending',
    deaths: node.result === 'death' ? state.deaths + 1 : state.deaths,
    unlocked,
  };
}

/** Lối ra của node hiện tại: danh sách lựa chọn, một nút "Tiếp", hoặc không có gì. */
export function exits(level: Level, state: GameState): Exit {
  if (state.phase !== 'scene') return { kind: 'none' };
  const node = nodeById(level, state.node) as SceneNode;
  const zero = level.on_sanity_zero;
  if (state.sanity === 0 && zero && !state.visited.includes(zero)) return { kind: 'continue', to: zero };
  if (node.hub && check(node.hub_done, level, state)) return { kind: 'continue', to: node.hub_exit! };
  const choices = (node.choices ?? []).flatMap((c, index) =>
    check(c.if, level, state) && !(node.hub && state.visited.includes(c.goto)) ? [{ index, text: c.text }] : [],
  );
  if (choices.length) return { kind: 'choices', choices };
  if (node.next) return { kind: 'continue', to: node.next };
  throw new EngineError(`Node ${node.id} không còn lựa chọn nào và không có next`);
}

export function step(level: Level, state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'restart':
      return initialState(level, { deaths: state.deaths, unlocked: state.unlocked });

    case 'highlight': {
      if (state.phase !== 'highlight') throw new EngineError('Không ở bước đánh dấu từ khoá');
      const ids = [...new Set(action.ids)];
      if (ids.length > MAX_HIGHLIGHTS) throw new EngineError(`Chỉ được đánh dấu tối đa ${MAX_HIGHLIGHTS} cụm`);
      for (const id of ids) {
        if (!level.keywords.some((k) => k.id === id)) throw new EngineError(`Từ khoá không tồn tại: ${id}`);
      }
      return { ...state, highlights: ids, highlightDone: true, phase: 'scene', notices: [] };
    }

    case 'continue': {
      const exit = exits(level, state);
      if (exit.kind !== 'continue') throw new EngineError(`Không thể đi tiếp ở ${state.node}`);
      return enter(level, { ...state, notices: [] }, exit.to);
    }

    case 'choose': {
      const exit = exits(level, state);
      if (exit.kind !== 'choices' || !exit.choices.some((c) => c.index === action.index)) {
        throw new EngineError(`Lựa chọn ${action.index} không có ở ${state.node}`);
      }
      const node = nodeById(level, state.node) as SceneNode;
      const choice = node.choices![action.index]!;
      let s: GameState = { ...state, notices: [] };
      if (node.hub) s = { ...s, visited: addUnique(s.visited, choice.goto) }; // G1
      s = applyEffects(s, choice.effects as Effect[] | undefined, level);
      return enter(level, s, choice.goto);
    }
  }
}
