import type { BloodtextView } from '../../engine/index.ts';
import { strings } from '../strings.ts';
import type { ChannelProps } from './types.ts';
import { cutSegments, segmentsLength } from './text.ts';

/** Các dòng Huyết tự; dùng chung cho kênh bloodtext, bảng Huyết tự và màn hình chết. */
export function BloodLines({ lines, visible = Infinity, glow = false }: { lines: BloodtextView[]; visible?: number; glow?: boolean }) {
  // Số ký tự đã gõ trước mỗi dòng.
  const starts = lines.map((_, i) => lines.slice(0, i).reduce((sum, l) => sum + segmentsLength(l.segments), 0));
  return (
    <div className={`bloodtext${glow ? ' glow' : ''}`}>
      {lines.map((l, i) => {
        const segments = cutSegments(l.segments, visible - starts[i]!);
        if (!segments.length) return null;
        return (
          <p key={l.id} className={`blood-line ink-${l.ink}`}>
            {segments.map((s, i) =>
              s.mark ? (
                <span key={i} className={`mark-${s.mark}`}>
                  {s.text}
                </span>
              ) : (
                <span key={i}>{s.text}</span>
              ),
            )}
            {l.ink !== 'do' && <span className="sr-only">{strings.inkLabel[l.ink]}</span>}
          </p>
        );
      })}
    </div>
  );
}

export function Bloodtext({ line, visible }: ChannelProps<'bloodtext'>) {
  return <BloodLines lines={line.lines} visible={visible} glow={line.glow} />;
}
