// Kiểm tra assets.yaml không cần đọc file ảnh (phần đọc PNG nằm ở scripts/lib/png.ts).
import type { Assets, Level } from '../types.ts';

export function validateAssets(assets: Assets, levels: Level[]): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  const clues = new Set(levels.flatMap((l) => l.clues));
  const used = new Set(
    levels.flatMap((l) =>
      l.nodes.flatMap((n) => {
        if (n.scene === undefined) return [];
        const list = Array.isArray(n.scene) ? n.scene : [n.scene];
        return list.flatMap((s) => (s.bg ? [s.bg] : []));
      }),
    ),
  );

  for (const [i, a] of assets.assets.entries()) {
    const where = `assets: assets[${i}] (${a.id})`;
    if (seen.has(a.id)) errors.push(`${where} — id bị trùng`);
    seen.add(a.id);
    if (a.file && a.file !== `bg/${a.id}.png`) errors.push(`${where}.file — phải là bg/${a.id}.png`);
    if (a.clue && !clues.has(a.clue)) errors.push(`${where}.clue — manh mối ${a.clue} không được màn nào khai báo`);
    if (!used.has(a.id)) warnings.push(`${where} — chưa node nào dùng ảnh này`);
  }
  return { errors, warnings };
}
