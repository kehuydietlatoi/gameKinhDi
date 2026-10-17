// Cảnh nền và ánh sáng (docs/dac-ta-kich-ban.md mục 5).
import type { Level, Scene } from '../content/types.ts';
import { check } from './conditions.ts';
import type { GameState } from './state.ts';

/** Áp `scene` của node lên cảnh hiện tại: chỉ ghi đè trường được nêu. */
export function resolveScene(scene: Scene | undefined, level: Level, state: GameState): GameState['scene'] {
  if (scene === undefined) return state.scene;
  const pick = Array.isArray(scene) ? scene.find((c) => check(c.if, level, state)) : scene;
  if (!pick) return state.scene;
  return { bg: pick.bg ?? state.scene.bg, light: pick.light ?? state.scene.light };
}

/** Cảnh thực sự hiển thị: nhắm mắt thì luôn đen. */
export function displayedScene(state: GameState): GameState['scene'] {
  return state.eyes_closed ? { bg: state.scene.bg, light: 'dark' } : state.scene;
}
