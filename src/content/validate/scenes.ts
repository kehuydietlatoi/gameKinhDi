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
  const clueImages = new Map(assets.assets.filter((a) => a.clue).map((a) => [a.id, a]));
  const incoming = new Map<string, Set<string>>();
  const shown = new Map<string, Set<string>>();
  const queue: string[] = [];
  const feed = (to: string, bgs: Set<string>) => {
    const prev = incoming.get(to) ?? new Set<string>();
    const merged = new Set([...prev, ...bgs]);
    if (merged.size !== prev.size || !incoming.has(to)) {
      incoming.set(to, merged);
      queue.push(to);
    }
  };
  const drain = () => {
    while (queue.length) {
      const id = queue.shift()!;
      const node = nodes.get(id);
      if (!node) continue;
      const here = bgsAfter(node.scene, incoming.get(id) ?? new Set());
      shown.set(id, here);
      for (const s of successors(node)) feed(s.to, here);
    }
  };
  feed(level.start, new Set());
  drain();
  // G26: on_sanity_zero tới được từ bất kỳ node nào, nên nhận mọi ảnh có thể đang hiện.
  if (level.on_sanity_zero) {
    feed(level.on_sanity_zero, new Set([...shown.values()].flatMap((b) => [...b])));
    drain();
  }

  const errors: string[] = [];
  for (const [id, bgs] of shown) {
    const node = nodes.get(id)!;
    if (node.type === 'ending') continue;
    const added = new Set((node.effects ?? []).flatMap((e) => (e.clue ? [e.clue] : [])));
    for (const bg of bgs) {
      const asset = clueImages.get(bg);
      if (!asset) continue;
      if (asset.level !== level.level) {
        errors.push(`${id}.scene — ảnh \`${bg}\` chứa manh mối của màn ${asset.level}, ở màn khác chỉ được dùng ở ending (G32)`);
      } else if (!added.has(asset.clue!)) {
        errors.push(`${id}.scene — ảnh \`${bg}\` chứa manh mối ${asset.clue} nhưng node không thêm ${asset.clue} (G22)`);
      }
    }
  }
  return errors;
}
