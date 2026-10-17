import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, stringify } from 'yaml';
import { parseLevel } from '../../src/content/loader.ts';
import type { Level } from '../../src/content/types.ts';

export const fixture = (name: string) =>
  readFileSync(join(import.meta.dirname, '..', 'fixtures', name), 'utf8');

/* eslint-disable @typescript-eslint/no-explicit-any -- fixture YAML được sửa tự do để thử lỗi */
export type RawLevel = Record<string, any> & { node: (id: string) => any };

function rawFixture(name: string): RawLevel {
  const raw = parse(fixture(name));
  Object.defineProperty(raw, 'node', {
    enumerable: false,
    value: (id: string) => raw.nodes.find((n: any) => n.id === id),
  });
  return raw;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Đọc fixture hợp lệ, sửa bằng `mutate`, parse lại; trả danh sách lỗi schema. */
export function errorsAfter(mutate: (raw: RawLevel) => void, name = 'minimal.yaml'): string[] {
  const raw = rawFixture(name);
  mutate(raw);
  const result = parseLevel(stringify(raw), 'm9.yaml');
  return result.ok ? [] : result.errors;
}

/** Như errorsAfter nhưng trả về Level đã parse (ném lỗi nếu schema hỏng). */
export function levelAfter(mutate: (raw: RawLevel) => void, name = 'minimal.yaml'): Level {
  const raw = rawFixture(name);
  mutate(raw);
  const result = parseLevel(stringify(raw), 'm9.yaml');
  if (!result.ok) throw new Error(result.errors.join('\n'));
  return result.value;
}

export function loadFixtureLevel(name = 'minimal.yaml'): Level {
  return levelAfter(() => {}, name);
}
