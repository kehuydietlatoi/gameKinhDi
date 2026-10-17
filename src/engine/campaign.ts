// Số liệu cả chuyến chơi (G50, G51, G53): mang qua Chơi lại và qua các màn, như `unlocked`.
// Chỉ dùng kiểu JSON thuần để lưu được vào localStorage.
import type { Level } from '../content/types.ts';

export type Campaign = {
  /** Số lần tới từng kết cục, theo id node ending (id có tiền tố màn nên không trùng giữa các màn). */
  endings: Record<string, number>;
  /** Tổng số lần chết cả chuyến chơi. */
  deaths: number;
  /** Lần qua màn gần nhất của mỗi màn: số từ khoá đánh dấu là chìa khoá / số đã đánh dấu. */
  keywords: Record<string, { hit: number; marked: number }>;
  /** Các màn đã tới, theo thứ tự tới (G53). */
  reached: string[];
};

export const emptyCampaign = (): Campaign => ({ endings: {}, deaths: 0, keywords: {}, reached: [] });

export type CampaignSummary = {
  deaths: number;
  keywordsHit: number;
  keywordsMarked: number;
  endingsOpened: number;
  endingsTotal: number;
};

/** Màn tổng kết sau đoạn kết (G51). */
export function campaignSummary(levels: Level[], c: Campaign): CampaignSummary {
  const endingIds = levels.flatMap((l) => l.nodes.filter((n) => n.type === 'ending').map((n) => n.id));
  const scores = Object.values(c.keywords);
  return {
    deaths: c.deaths,
    keywordsHit: scores.reduce((sum, k) => sum + k.hit, 0),
    keywordsMarked: scores.reduce((sum, k) => sum + k.marked, 0),
    endingsOpened: endingIds.filter((id) => (c.endings[id] ?? 0) > 0).length,
    endingsTotal: endingIds.length,
  };
}
