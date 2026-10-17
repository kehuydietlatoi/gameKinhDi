// Hiển thị Huyết tự: bóp méo (đổi chữ hoặc đổi mực), gạch chân cụm đã đánh dấu, tô cụm sinh lộ.
// Bóp méo chỉ đổi phần hiển thị; level và state luôn giữ bản gốc (AGENTS.md mục 5.7).
import type { Ink, Level } from '../content/types.ts';
import type { GameState } from './state.ts';

/** highlighted: cụm đã đánh dấu; solution: cụm sinh lộ; struck: dòng giả trong solution (G38). */
export type Mark = 'highlighted' | 'solution' | 'struck';
export type Segment = { text: string; mark?: Mark };
/** Không có trường "fake": người chơi chỉ phân biệt dòng giả qua mực (G36). */
export type BloodtextView = { id: string; ink: Ink; segments: Segment[] };

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

/** Chữ và mực của một dòng như người chơi đang thấy (có thể là bản méo). */
export function displayLine(level: Level, state: GameState, lineId: string): { text: string; ink: Ink } {
  const line = level.bloodtext.find((b) => b.id === lineId);
  if (!line) return { text: '', ink: 'do' };
  const shown = { text: line.text, ink: line.ink };
  if (state.sanity > 2) return shown;
  for (const d of level.distortions) {
    if (d.line !== lineId) continue;
    if ('ink' in d) shown.ink = d.ink; // G37: đổi mực, không bảo vệ được
    else if (!state.highlights.includes(d.unless_highlighted)) shown.text = d.text;
  }
  return shown;
}

/** Một dòng theo góc nhìn người chơi; bản méo không có dấu hiệu gì khác bản thật. */
export function viewLine(level: Level, state: GameState, lineId: string): BloodtextView {
  const { text, ink } = displayLine(level, state, lineId);
  const marked = level.keywords
    .filter((k) => k.line === lineId && state.highlights.includes(k.id))
    .map((k) => ({ text: k.text, mark: 'highlighted' as const }));
  return { id: lineId, ink, segments: segment(text, marked) };
}

export function viewAll(level: Level, state: GameState): BloodtextView[] {
  return level.bloodtext.map((b) => viewLine(level, state, b.id));
}

/**
 * Bản gốc, tô cụm sinh lộ (G17): id từ khoá tô cụm đó, id dòng tô cả dòng.
 * Dòng giả có trong solution thì gạch ngang (G38).
 */
export function viewSolution(level: Level, solution: string[]): BloodtextView[] {
  return level.bloodtext.map((b) => {
    if (solution.includes(b.id)) {
      return { id: b.id, ink: b.ink, segments: [{ text: b.text, mark: b.fake ? ('struck' as const) : ('solution' as const) }] };
    }
    const marked = level.keywords
      .filter((k) => k.line === b.id && solution.includes(k.id))
      .map((k) => ({ text: k.text, mark: 'solution' as const }));
    return { id: b.id, ink: b.ink, segments: segment(b.text, marked) };
  });
}
