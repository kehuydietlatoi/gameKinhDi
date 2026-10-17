import type { ChannelProps } from './types.ts';
import { cut } from './text.ts';

export function Narration({ line, visible }: ChannelProps<'narration'>) {
  return <p className="ch ch-narration">{cut(line.text, visible)}</p>;
}
