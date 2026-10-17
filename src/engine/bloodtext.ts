// Hiển thị Huyết tự: bóp méo, gạch chân cụm đã đánh dấu, tô cụm sinh lộ.
// Bóp méo chỉ đổi phần hiển thị; level và state luôn giữ bản gốc (AGENTS.md mục 5.7).
import type { Level } from '../content/types.ts';
import type { GameState } from './state.ts';

export type Mark = 'highlighted' | 'solution';
export type Segment = { text: string; mark?: Mark };
export type BloodtextView = { id: string; segments: Segment[] };

/** Tách `text` thành đoạn, đánh dấu các cụm cho trước (bỏ cụm chồng lên cụm trước). */
function segment(text: string, phrases: { text: string; mark: Mark }[]): Segment[] {
  const ranges = phrases
    .map((p) => ({ start: text.indexOf(p.text), end: text.indexOf(p.text) + p.text.length, mark: p.mark }))
    .filter((r) => r.start >= 0)
    .sort((a, b) => a.start - b.start);
  const out: Segment[] = [];
  let pos = 0;
  for (const r of ranges) {
    if (r.start < pos) continue;
    if (r.start > pos) out.push({ text: text.slice(pos, r.start) });
    out.push({ text: text.slice(r.start, r.end), mark: r.mark });
    pos = r.end;
  }
  if (pos < text.length) out.push({ text: text.slice(pos) });
  return out;
}

/** Chữ của một dòng như người chơi đang thấy (có thể là bản méo). */
export function displayLineText(level: Level, state: GameState, lineId: string): string {
  const line = level.bloodtext.find((b) => b.id === lineId);
  if (!line) return '';
  if (state.sanity > 2) return line.text;
  const d = level.distortions.find((x) => x.line === lineId);
  if (!d || state.highlights.includes(d.unless_highlighted)) return line.text;
  return d.text;
}

/** Một dòng Huyết tự theo góc nhìn người chơi; bản méo không có dấu hiệu gì khác. */
export function viewLine(level: Level, state: GameState, lineId: string): BloodtextView {
  const text = displayLineText(level, state, lineId);
  const marked = level.keywords
    .filter((k) => k.line === lineId && state.highlights.includes(k.id))
    .map((k) => ({ text: k.text, mark: 'highlighted' as const }));
  return { id: lineId, segments: segment(text, marked) };
}

export function viewAll(level: Level, state: GameState): BloodtextView[] {
  return level.bloodtext.map((b) => viewLine(level, state, b.id));
}

/** Bản gốc, tô cụm sinh lộ (G17): id từ khoá tô cụm đó, id dòng tô cả dòng. */
export function viewSolution(level: Level, solution: string[]): BloodtextView[] {
  return level.bloodtext.map((b) => {
    if (solution.includes(b.id)) return { id: b.id, segments: [{ text: b.text, mark: 'solution' as const }] };
    const marked = level.keywords
      .filter((k) => k.line === b.id && solution.includes(k.id))
      .map((k) => ({ text: k.text, mark: 'solution' as const }));
    return { id: b.id, segments: segment(b.text, marked) };
  });
}
