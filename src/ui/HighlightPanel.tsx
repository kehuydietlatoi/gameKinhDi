// Giao diện đánh dấu từ khoá (đặc tả mục 4.3, G14): chạm tối đa 3 cụm, có thể bỏ qua.
import { useState } from 'react';
import { MAX_HIGHLIGHTS } from '../engine/index.ts';
import { strings } from './strings.ts';

type Option = { line: string; text: string; ink: 'do' | 'nau' | 'kho'; keywords: { id: string; text: string }[] };

/** Tách dòng thành chữ thường và các cụm chọn được (theo vị trí trong dòng). */
function pieces(o: Option) {
  const found = o.keywords
    .map((k) => ({ ...k, at: o.text.indexOf(k.text) }))
    .filter((k) => k.at >= 0)
    .sort((a, b) => a.at - b.at);
  const out: ({ text: string } | { id: string; text: string })[] = [];
  let pos = 0;
  for (const k of found) {
    if (k.at < pos) continue;
    if (k.at > pos) out.push({ text: o.text.slice(pos, k.at) });
    out.push({ id: k.id, text: k.text });
    pos = k.at + k.text.length;
  }
  if (pos < o.text.length) out.push({ text: o.text.slice(pos) });
  return out;
}

export function HighlightPanel({ options, onDone }: { options: Option[]; onDone: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < MAX_HIGHLIGHTS ? [...s, id] : s));

  return (
    <section className="highlight" aria-label={strings.highlightTitle}>
      <h2>{strings.highlightTitle}</h2>
      <div className="bloodtext">
        {options.map((o) => (
          <p key={o.line} className={`blood-line ink-${o.ink}`}>
            {pieces(o).map((p, i) =>
              'id' in p ? (
                <button
                  key={i}
                  type="button"
                  className="kw"
                  aria-pressed={selected.includes(p.id)}
                  disabled={!selected.includes(p.id) && selected.length >= MAX_HIGHLIGHTS}
                  onClick={() => toggle(p.id)}
                >
                  {p.text}
                </button>
              ) : (
                <span key={i}>{p.text}</span>
              ),
            )}
          </p>
        ))}
      </div>
      <p className="hint">{strings.highlightCount(selected.length, MAX_HIGHLIGHTS)}</p>
      <div className="row">
        <button type="button" className="btn btn-primary" onClick={() => onDone(selected)}>
          {strings.highlightConfirm}
        </button>
        <button type="button" className="btn" onClick={() => onDone([])}>
          {strings.highlightSkip}
        </button>
      </div>
    </section>
  );
}
