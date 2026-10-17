import type { DisplayLine } from '../../engine/index.ts';

export type Channel = DisplayLine['ch'];
export type LineOf<C extends Channel> = Extract<DisplayLine, { ch: C }>;
/** `visible`: số ký tự đã hiện (Infinity = hiện hết). */
export type ChannelProps<C extends Channel> = { line: LineOf<C>; visible: number };
