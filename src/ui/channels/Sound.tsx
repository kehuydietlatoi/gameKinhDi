import { strings } from '../strings.ts';
import type { ChannelProps } from './types.ts';
import { cut } from './text.ts';

export function Sound({ line, visible }: ChannelProps<'sound'>) {
  return (
    <p className={`ch ch-sound vol-${line.vol}`}>
      <span className="ch-prefix">{strings.soundPrefix(line.src)}</span> {cut(line.text, visible)}
    </p>
  );
}
