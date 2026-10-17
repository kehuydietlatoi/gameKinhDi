// Chạy toàn bộ kiểm tra cho một thư mục content/ (dùng chung cho CLI và test).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseAssets, parseLevel } from '../../src/content/loader.ts';
import type { Assets, Level } from '../../src/content/types.ts';
import { validateAssets } from '../../src/content/validate/assets.ts';
import { levelWarnings, validateLevel } from '../../src/content/validate/level.ts';
import { checkBackground } from './png.ts';

export type Report = { errors: string[]; warnings: string[]; summary: string[] };

export function runValidate(contentDir: string, publicDir: string): Report {
  const report: Report = { errors: [], warnings: [], summary: [] };
  if (!existsSync(contentDir)) {
    report.errors.push(`không có thư mục ${contentDir}`);
    return report;
  }
  const files = readdirSync(contentDir).filter((f) => f.endsWith('.yaml')).sort();

  let assets: Assets | null = null;
  if (files.includes('assets.yaml')) {
    const parsed = parseAssets(readFileSync(join(contentDir, 'assets.yaml'), 'utf8'), 'assets.yaml');
    if (parsed.ok) assets = parsed.value;
    else report.errors.push(...parsed.errors);
  } else {
    report.errors.push('thiếu content/assets.yaml');
  }

  const parsedLevels: { file: string; level: Level }[] = [];
  for (const file of files.filter((f) => f !== 'assets.yaml')) {
    const parsed = parseLevel(readFileSync(join(contentDir, file), 'utf8'), file);
    if (!parsed.ok) {
      report.errors.push(...parsed.errors);
      continue;
    }
    if (file !== `${parsed.value.level}.yaml`) {
      report.errors.push(`${file}: level — tên file phải là ${parsed.value.level}.yaml`);
    }
    parsedLevels.push({ file, level: parsed.value });
  }
  const levels = parsedLevels.map((p) => p.level);

  // G41: chỉ một màn final, và đó phải là màn có số lớn nhất.
  const finals = levels.filter((l) => l.final);
  const last = [...levels].sort((a, b) => Number(b.level.slice(1)) - Number(a.level.slice(1)))[0];
  if (finals.length > 1) report.errors.push(`final — có ${finals.length} màn final: ${finals.map((l) => l.level).join(', ')}`);
  for (const f of finals) {
    if (f !== last) report.errors.push(`${f.level}.yaml: final — màn final phải là màn cuối (màn cuối hiện là ${last!.level})`);
  }

  // Hồ sơ của mọi màn, để has_dossier tham chiếu được hồ sơ ở màn trước (G27).
  const dossiers = new Set(levels.flatMap((l) => l.dossiers.map((d) => d.id)));
  for (const { file, level } of parsedLevels) {
    const errors = validateLevel(level, assets, dossiers);
    report.errors.push(...errors);
    report.warnings.push(...levelWarnings(level));
    report.summary.push(`${file}: ${errors.length ? `${errors.length} lỗi` : 'OK'} (${level.nodes.length} node)`);
  }

  if (assets) {
    const { errors, warnings } = validateAssets(assets, levels);
    report.errors.push(...errors);
    report.warnings.push(...warnings);
    let placeholders = 0;
    for (const a of assets.assets) {
      if (a.placeholder) placeholders++;
      else report.errors.push(...checkBackground(join(publicDir, a.file!), `assets: ${a.id}`));
    }
    report.summary.push(`assets.yaml: ${assets.assets.length} ảnh, ${placeholders} placeholder`);
  }
  return report;
}
