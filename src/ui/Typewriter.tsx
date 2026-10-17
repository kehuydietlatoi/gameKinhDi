// Hiệu ứng gõ chữ (AGENTS.md mục 9): chạm/nhấp để hiện hết; msPerChar = 0 thì hiện ngay.
// Remount bằng `key` mỗi lần vào node mới để gõ lại từ đầu.
import { useEffect, useState, type ReactNode } from 'react';
import type { DisplayLine } from '../engine/index.ts';
import { ChannelLine, lineLength, linePace } from './channels/index.tsx';
import { strings } from './strings.ts';

type Props = { lines: DisplayLine[]; msPerChar: number; footer: ReactNode };

export function Typewriter({ lines, msPerChar, footer }: Props) {
  const [pos, setPos] = useState({ line: 0, char: 0 });
  const done = msPerChar === 0 || pos.line >= lines.length;

  useEffect(() => {
    if (done) return;
    const line = lines[pos.line]!;
    const total = lineLength(line);
    const delay = pos.char === 0 && pos.line > 0 ? msPerChar * 10 : msPerChar * linePace(line);
    const t = setTimeout(() => {
      setPos((p) => (p.char + 1 >= total ? { line: p.line + 1, char: 0 } : { line: p.line, char: p.char + 1 }));
    }, delay);
    return () => clearTimeout(t);
  }, [done, lines, msPerChar, pos]);

  const finish = () => setPos({ line: lines.length, char: 0 });

  return (
    <>
      <div
        className="lines"
        onClick={done ? undefined : finish}
        onKeyDown={(e) => {
          if (!done && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            finish();
          }
        }}
        role={done ? undefined : 'button'}
        tabIndex={done ? undefined : 0}
        aria-label={done ? undefined : strings.revealAll}
      >
        {lines.map((line, i) => {
          if (!done && i > pos.line) return null;
          const visible = done || i < pos.line ? Infinity : pos.char;
          return <ChannelLine key={i} line={line} visible={visible} />;
        })}
        {!done && <p className="hint">{strings.revealAll}</p>}
      </div>
      {done && footer}
    </>
  );
}
