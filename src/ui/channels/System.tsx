import type { ChannelProps } from './types.ts';
import { cut } from './text.ts';

export function System({ line, visible }: ChannelProps<'system'>) {
  return <p className="ch ch-system">{cut(line.text, visible)}</p>;
}
