// G22: ảnh có `clue` chỉ được dùng ở node thêm đúng clue đó, hoặc ở ending (AGENTS.md 8.5).
// Cảnh được kế thừa qua node, nên phải lan theo đồ thị để biết ảnh nào có thể đang hiện.
import type { Assets, Level, Node, Scene } from '../types.ts';
import { successors } from './walk.ts';

/** Tập ảnh nền có thể hiện ở node, khi đi vào với tập ảnh `incoming`. */
function bgsAfter(scene: Scene | undefined, incoming: Set<string>): Set<string> {
  if (scene === undefined) return incoming;
  if (!Array.isArray(scene)) return scene.bg ? new Set([scene.bg]) : incoming;
  const out = new Set<string>();
  for (const c of scene) {
    if (c.bg) out.add(c.bg);
    else incoming.forEach((b) => out.add(b));
  }
  // Không mục nào khớp thì giữ cảnh cũ, trừ khi có mục không điều kiện.
  if (!scene.some((c) => !c.if)) incoming.forEach((b) => out.add(b));
  return out;
}

export function checkSceneClues(level: Level, assets: Assets, nodes: Map<string, Node>): string[] {
  const clueOf = new Map(assets.assets.filter((a) => a.clue).map((a) => [a.id, a.clue!]));
  const incoming = new Map<string, Set<string>>([[level.start, new Set()]]);
  const shown = new Map<string, Set<string>>();
  const queue = [level.start];
  while (queue.length) {
    const id = queue.shift()!;
    const node = nodes.get(id);
    if (!node) continue;
    const here = bgsAfter(node.scene, incoming.get(id) ?? new Set());
    shown.set(id, here);
    for (const s of successors(node)) {
      const prev = incoming.get(s.to) ?? new Set<string>();
      const merged = new Set([...prev, ...here]);
      if (merged.size !== prev.size || !incoming.has(s.to)) {
        incoming.set(s.to, merged);
        queue.push(s.to);
      }
    }
  }

  const errors: string[] = [];
  for (const [id, bgs] of shown) {
    const node = nodes.get(id)!;
    if (node.type === 'ending') continue;
    const added = new Set((node.effects ?? []).flatMap((e) => (e.clue ? [e.clue] : [])));
    for (const bg of bgs) {
      const clue = clueOf.get(bg);
      if (clue && !added.has(clue)) {
        errors.push(`${id}.scene — ảnh \`${bg}\` chứa manh mối ${clue} nhưng node không thêm ${clue} (G22)`);
      }
    }
  }
  return errors;
}
