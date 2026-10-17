// Duyệt mọi điều kiện, hiệu ứng, dòng chữ và cạnh của một màn, kèm vị trí để báo lỗi.
import type { Condition, Effect, Level, Line, Node } from '../types.ts';

export type At<T> = { value: T; where: string; node: Node };

export function* lines(level: Level): Generator<At<Line>> {
  for (const node of level.nodes) {
    for (const [i, line] of node.lines.entries()) yield { value: line, where: `${node.id}.lines[${i}]`, node };
  }
}

export function* conditions(level: Level): Generator<At<Condition>> {
  for (const node of level.nodes) {
    const at = (value: Condition, where: string) => ({ value, where: `${node.id}.${where}`, node });
    for (const [i, line] of node.lines.entries()) if (line.if) yield at(line.if, `lines[${i}].if`);
    if (Array.isArray(node.scene)) {
      for (const [i, c] of node.scene.entries()) if (c.if) yield at(c.if, `scene[${i}].if`);
    }
    if (node.type === 'scene') {
      for (const [i, c] of (node.choices ?? []).entries()) {
        if (c.if) yield at(c.if, `choices[${i}].if`);
        for (const [j, e] of (c.effects ?? []).entries()) if (e.if) yield at(e.if, `choices[${i}].effects[${j}].if`);
      }
      for (const [i, e] of (node.effects ?? []).entries()) if (e.if) yield at(e.if, `effects[${i}].if`); // G40
      if (node.hub_done) yield at(node.hub_done, 'hub_done');
    } else {
      for (const [i, u] of (node.unlock ?? []).entries()) if (u.if) yield at(u.if, `unlock[${i}].if`);
    }
  }
}

export function* effects(level: Level): Generator<At<Effect>> {
  for (const node of level.nodes) {
    if (node.type !== 'scene') continue;
    for (const [i, e] of (node.effects ?? []).entries()) {
      yield { value: e, where: `${node.id}.effects[${i}]`, node };
    }
    for (const [i, c] of (node.choices ?? []).entries()) {
      for (const [j, e] of (c.effects ?? []).entries()) {
        yield { value: e, where: `${node.id}.choices[${i}].effects[${j}]`, node };
      }
    }
  }
}

/** Mọi node có thể đi tới trực tiếp từ `node`, bỏ qua điều kiện. */
export function successors(node: Node): { to: string; where: string }[] {
  if (node.type === 'ending') return [];
  const out: { to: string; where: string }[] = [];
  if (node.next) out.push({ to: node.next, where: 'next' });
  if (node.hub_exit) out.push({ to: node.hub_exit, where: 'hub_exit' });
  for (const [i, c] of (node.choices ?? []).entries()) out.push({ to: c.goto, where: `choices[${i}].goto` });
  return out;
}
