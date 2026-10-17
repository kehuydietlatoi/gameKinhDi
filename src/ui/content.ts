// Nạp nội dung trong trình duyệt: YAML dạng chuỗi qua `?raw`, rồi kiểm tra bằng schema.
import assetsRaw from '../../content/assets.yaml?raw';
import m1Raw from '../../content/m1.yaml?raw';
import { parseAssets, parseLevel } from '../content/loader.ts';
import type { Asset, Level } from '../content/types.ts';

export type Loaded = { ok: true; level: Level; assets: Map<string, Asset> } | { ok: false; errors: string[] };

export function loadContent(): Loaded {
  const level = parseLevel(m1Raw, 'm1.yaml');
  const assets = parseAssets(assetsRaw, 'assets.yaml');
  const errors = [...(level.ok ? [] : level.errors), ...(assets.ok ? [] : assets.errors)];
  if (!level.ok || !assets.ok) return { ok: false, errors };
  return { ok: true, level: level.value, assets: new Map(assets.value.assets.map((a) => [a.id, a])) };
}
