// Đọc YAML và kiểm tra bằng schema. Hàm thuần: nhận chuỗi, trả kết quả.
// Trình duyệt nạp chuỗi qua `?raw`, còn scripts/validate.ts đọc bằng fs.
import { parse, YAMLParseError } from 'yaml';
import { z } from 'zod';
import * as S from './schema.ts';
import type { Assets, Level } from './types.ts';

z.config(z.locales.vi());

export type ParseResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

export function parseLevel(text: string, file: string): ParseResult<Level> {
  return parseWith(S.Level, text, file);
}

export function parseAssets(text: string, file: string): ParseResult<Assets> {
  return parseWith(S.Assets, text, file);
}

function parseWith<T>(schema: z.ZodType<T>, text: string, file: string): ParseResult<T> {
  let raw: unknown;
  try {
    raw = parse(text);
  } catch (e) {
    if (e instanceof YAMLParseError) {
      const pos = e.linePos?.[0];
      const where = pos ? `${file}:${pos.line}:${pos.col}` : file;
      return { ok: false, errors: [`${where} — ${e.message.split('\n')[0]}`] };
    }
    throw e;
  }
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, value: result.data };
  return { ok: false, errors: result.error.issues.flatMap((i) => formatIssue(i, raw, file)) };
}

/** Ví dụ: `m1.yaml: nodes[3] (m1_n04).choices[1].if.flg — khoá không xác định`. */
function formatIssue(issue: z.core.$ZodIssue, raw: unknown, file: string): string[] {
  const paths =
    issue.code === 'unrecognized_keys'
      ? issue.keys.map((k) => [...issue.path, k])
      : [issue.path];
  const message = issue.code === 'unrecognized_keys' ? 'khoá không xác định' : issue.message;
  return paths.map((p) => `${file}: ${formatPath(p, raw) || '(gốc)'} — ${message}`);
}

function formatPath(path: PropertyKey[], raw: unknown): string {
  let out = '';
  let cursor: unknown = raw;
  for (const seg of path) {
    if (typeof seg === 'number') {
      out += `[${seg}]`;
      cursor = Array.isArray(cursor) ? cursor[seg] : undefined;
      const id = isRecord(cursor) && typeof cursor.id === 'string' ? cursor.id : undefined;
      if (id) out += ` (${id})`;
    } else {
      out += `${out ? '.' : ''}${String(seg)}`;
      cursor = isRecord(cursor) ? cursor[String(seg)] : undefined;
    }
  }
  return out;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
