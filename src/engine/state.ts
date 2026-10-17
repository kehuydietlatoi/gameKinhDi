// Trạng thái game (docs/dac-ta-kich-ban.md mục 2, 5; G1–G22).
// Chỉ dùng kiểu JSON thuần (mảng thay cho Set) để lưu được vào localStorage.
import type { Light, Role } from '../content/types.ts';

export type NpcState = { alive: boolean; found: boolean; following: boolean };

/** Thông báo cơ chế sinh ra trong lần chuyển node gần nhất; UI tự viết chữ. */
export type Notice = { kind: 'sanity'; delta: number };

export type Phase = 'scene' | 'highlight' | 'ending';

export type GameState = {
  level: string;
  node: string;
  phase: Phase;
  /** Chỉ số các dòng của node hiện tại có `if` đúng lúc vào node. */
  lines: number[];
  notices: Notice[];

  sanity: number;
  flags: string[];
  clues: string[];
  actions_left: number;
  role: Role;
  npc: Record<string, NpcState>;
  visited: string[];
  time: string;
  highlights: string[];
  highlightDone: boolean;
  eyes_closed: boolean;
  /** Chuỗi rỗng khi chưa chọn chỗ trốn. */
  spot: string;
  scene: { bg: string | null; light: Light };
  /** Nút "Huyết tự" bị khoá cho tới khi dòng bloodtext đầu tiên xuất hiện (G14). */
  bloodtextSeen: boolean;

  /** Tỉnh táo khi vào màn, dùng khi Chơi lại. */
  entrySanity: number;
  /** Số lần chết trong màn này, giữ qua Chơi lại (xoay vòng biến thể). */
  deaths: number;
  /** Hồ sơ đã mở khoá, giữ qua các màn (G18). */
  unlocked: string[];
};

export class EngineError extends Error {
  override name = 'EngineError';
}

export const following = (s: GameState) => Object.values(s.npc).filter((n) => n.following).length;

export const addUnique = (list: string[], item: string) => (list.includes(item) ? list : [...list, item]);
