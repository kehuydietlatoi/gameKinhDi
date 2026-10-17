// Nạp nội dung trong trình duyệt: mọi content/m*.yaml dạng chuỗi, rồi kiểm tra bằng schema.
// Thứ tự chơi theo số màn: m1, m2, m3, … (G33).
import assetsRaw from '../../content/assets.yaml?raw';
import { parseAssets, parseLevel } from '../content/loader.ts';
import type { Asset, Level } from '../content/types.ts';

const levelRaws = import.meta.glob('../../content/m*.yaml', { query: '?raw', import: 'default', eager: true }) as Record<
  string,
  string
>;

export type Loaded = { ok: true; levels: Level[]; assets: Map<string, Asset> } | { ok: false; errors: string[] };

const levelNumber = (l: Level) => Number(l.level.slice(1));

export function loadContent(): Loaded {
  const errors: string[] = [];
  const levels: Level[] = [];
  for (const [path, raw] of Object.entries(levelRaws)) {
    const parsed = parseLevel(raw, path.split('/').pop()!);
    if (parsed.ok) levels.push(parsed.value);
    else errors.push(...parsed.errors);
  }
  const assets = parseAssets(assetsRaw, 'assets.yaml');
  if (!assets.ok) errors.push(...assets.errors);
  if (errors.length || !assets.ok || levels.length === 0) return { ok: false, errors };
  levels.sort((a, b) => levelNumber(a) - levelNumber(b));
  return { ok: true, levels, assets: new Map(assets.value.assets.map((a) => [a.id, a])) };
}
