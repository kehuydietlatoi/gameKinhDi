// Bảng tra kênh → component (AGENTS.md mục 7). Thêm kênh mới chỉ cần thêm một mục ở đây.
import type { ComponentType } from 'react';
import type { DisplayLine } from '../../engine/index.ts';
import { Bloodtext } from './Bloodtext.tsx';
import { Env } from './Env.tsx';
import { Narration } from './Narration.tsx';
import { Npc } from './Npc.tsx';
import { Sound } from './Sound.tsx';
import { System } from './System.tsx';
import { len, segmentsLength } from './text.ts';
import type { Channel, ChannelProps, LineOf } from './types.ts';

type Spec<C extends Channel> = {
  Component: ComponentType<ChannelProps<C>>;
  /** Tổng số ký tự sẽ gõ. */
  length: (line: LineOf<C>) => number;
  /** Hệ số thời gian mỗi ký tự; sound gõ chậm hơn (đặc tả mục 1). */
  pace: number;
};

const channels: { [C in Channel]: Spec<C> } = {
  narration: { Component: Narration, length: (l) => len(l.text), pace: 1 },
  env: { Component: Env, length: (l) => len(l.text), pace: 1 },
  sound: { Component: Sound, length: (l) => len(l.text), pace: 2 },
  npc: { Component: Npc, length: (l) => len(l.text) + (l.note ? len(l.note) : 0), pace: 1 },
  bloodtext: { Component: Bloodtext, length: (l) => l.lines.reduce((s, b) => s + segmentsLength(b.segments), 0), pace: 2 },
  system: { Component: System, length: (l) => len(l.text), pace: 1 },
};

const spec = (line: DisplayLine) => channels[line.ch] as unknown as Spec<Channel> & {
  Component: ComponentType<{ line: DisplayLine; visible: number }>;
  length: (l: DisplayLine) => number;
};

export const lineLength = (line: DisplayLine) => spec(line).length(line);
export const linePace = (line: DisplayLine) => spec(line).pace;

export function ChannelLine({ line, visible }: { line: DisplayLine; visible: number }) {
  const { Component } = spec(line);
  return <Component line={line} visible={visible} />;
}
