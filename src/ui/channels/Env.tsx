import { strings } from '../strings.ts';
import type { ChannelProps } from './types.ts';
import { cut } from './text.ts';

export function Env({ line, visible }: ChannelProps<'env'>) {
  return (
    <p className="ch ch-env">
      <span className="ch-prefix">{strings.senses[line.sense]} · </span>
      <em>{cut(line.text, visible)}</em>
    </p>
  );
}
