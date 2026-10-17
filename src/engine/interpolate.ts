// Chèn biến trạng thái vào chữ (G7): chỉ `{var}` và `{var + n}` / `{var - n}`.

export const INTERPOLATION_VARS = ['following', 'sanity', 'actions_left'] as const;
export type InterpolationVar = (typeof INTERPOLATION_VARS)[number];
export type InterpolationValues = Record<InterpolationVar, number>;

const PLACEHOLDER = /\{([^{}]*)\}/g;
const EXPRESSION = /^\s*([a-z_]+)\s*(?:([+-])\s*(\d+)\s*)?$/;

type Parsed = { name: InterpolationVar; offset: number };

function parseExpression(expr: string): Parsed | null {
  const m = EXPRESSION.exec(expr);
  if (!m || !(INTERPOLATION_VARS as readonly string[]).includes(m[1]!)) return null;
  const n = m[3] ? Number(m[3]) : 0;
  return { name: m[1] as InterpolationVar, offset: m[2] === '-' ? -n : n };
}

/** Các chỗ `{…}` không hợp lệ trong chuỗi (dùng cho validator). */
export function invalidPlaceholders(text: string): string[] {
  const bad: string[] = [];
  for (const m of text.matchAll(PLACEHOLDER)) {
    if (!parseExpression(m[1]!)) bad.push(m[0]);
  }
  if (/[{}]/.test(text.replace(PLACEHOLDER, ''))) bad.push('dấu ngoặc nhọn lẻ');
  return bad;
}

export function interpolate(text: string, values: InterpolationValues): string {
  return text.replace(PLACEHOLDER, (whole, expr: string) => {
    const p = parseExpression(expr);
    return p ? String(values[p.name] + p.offset) : whole;
  });
}
