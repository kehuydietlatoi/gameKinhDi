import type { Segment } from '../../engine/index.ts';

/** Số ký tự (theo code point) dùng cho hiệu ứng gõ chữ. */
export const len = (text: string) => Array.from(text).length;

/** `n` ký tự đầu của chuỗi; n = Infinity thì giữ nguyên. */
export const cut = (text: string, n: number) => (n >= len(text) ? text : Array.from(text).slice(0, n).join(''));

/** Cắt một dãy đoạn chữ, giữ nguyên dấu gạch chân/tô sáng của từng đoạn. */
export function cutSegments(segments: Segment[], n: number): Segment[] {
  const out: Segment[] = [];
  let left = n;
  for (const s of segments) {
    if (left <= 0) break;
    out.push({ ...s, text: cut(s.text, left) });
    left -= len(s.text);
  }
  return out;
}

export const segmentsLength = (segments: Segment[]) => segments.reduce((sum, s) => sum + len(s.text), 0);
