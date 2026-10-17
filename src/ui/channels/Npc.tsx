import type { ChannelProps } from './types.ts';
import { cut, len } from './text.ts';

export function Npc({ line, visible }: ChannelProps<'npc'>) {
  const textLen = len(line.text);
  return (
    <p className={`ch ch-npc tone-${line.tone}`}>
      <strong className="npc-name">{line.name}:</strong> <span className="npc-text">{cut(line.text, visible)}</span>
      {line.note && visible > textLen && <span className="npc-note"> ({cut(line.note, visible - textLen)})</span>}
    </p>
  );
}
