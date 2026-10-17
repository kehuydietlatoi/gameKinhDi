// play(levelId, choices[]): chạy một màn bằng danh sách lựa chọn (AGENTS.md mục 11).
// Mỗi lựa chọn là chữ hiển thị nguyên văn. Tự đi qua mọi nút "Tiếp" và bước đánh dấu.
// Dừng khi tới kết cục, hoặc khi hết lựa chọn mà màn còn đang chờ chọn.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseLevel } from '../../src/content/loader.ts';
import type { Level } from '../../src/content/types.ts';
import { initialState, step, view, type GameState, type View } from '../../src/engine/index.ts';

export type PlayOptions = {
  /** Từ khoá đánh dấu ở bước đánh dấu; mặc định bỏ qua. */
  highlights?: string[];
  /** Trạng thái bắt đầu (ví dụ để thử Chơi lại); mặc định initialState. */
  from?: GameState;
};

export type Trace = { state: GameState; path: string[]; views: View[] };

const cache = new Map<string, Level>();

export function loadLevel(levelId: string): Level {
  const cached = cache.get(levelId);
  if (cached) return cached;
  const file = join(import.meta.dirname, '..', '..', 'content', `${levelId}.yaml`);
  const parsed = parseLevel(readFileSync(file, 'utf8'), `${levelId}.yaml`);
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'));
  cache.set(levelId, parsed.value);
  return parsed.value;
}

export function run(level: Level, choices: string[], opts: PlayOptions = {}): Trace {
  let state = opts.from ?? initialState(level);
  const path = [state.node];
  const views: View[] = [view(level, state)];
  const remaining = [...choices];
  const advance = (next: GameState) => {
    state = next;
    if (path.at(-1) !== state.node) path.push(state.node);
    views.push(view(level, state));
  };

  for (;;) {
    if (state.phase === 'ending') {
      if (remaining.length) throw new Error(`Đã tới ${state.node} nhưng còn lựa chọn: ${remaining.join(' | ')}`);
      break;
    }
    if (state.phase === 'highlight') {
      advance(step(level, state, { type: 'highlight', ids: opts.highlights ?? [] }));
      continue;
    }
    const exit = view(level, state).exit;
    if (exit.kind === 'continue') {
      advance(step(level, state, { type: 'continue' }));
      continue;
    }
    if (exit.kind !== 'choices' || remaining.length === 0) break;
    const text = remaining.shift()!;
    const choice = exit.choices.find((c) => c.text === text);
    if (!choice) {
      throw new Error(
        `Ở ${state.node} không có lựa chọn "${text}". Đang hiện: ${exit.choices.map((c) => `"${c.text}"`).join(', ')}`,
      );
    }
    advance(step(level, state, { type: 'choose', index: choice.index }));
  }
  return { state, path, views };
}

export function play(levelId: string, choices: string[], opts: PlayOptions = {}): GameState {
  return run(loadLevel(levelId), choices, opts).state;
}
