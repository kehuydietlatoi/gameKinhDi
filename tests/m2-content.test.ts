// Đối chiếu content/m2.yaml với docs/man-2-canh-linh-cuu.md (AGENTS.md mục 6.1).
import { describe, expect, test } from 'vitest';
import type { Line } from '../src/content/types.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { section } from './helpers/script-doc.ts';

const { md, level, nodes } = checkLevelContent('m2', 'man-2-canh-linh-cuu.md');

describe('m2: kiểm tra riêng', () => {
  test('Huyết tự đặt đúng chỗ', () => {
    const blood = (lines: Line[]) => lines.filter((l) => l.ch === 'bloodtext');
    expect(blood(nodes.scene('m2_n02').lines)).toEqual([{ ch: 'bloodtext', lines: ['L1', 'L2', 'L3', 'L4'] }]);
    // M2-40: "Nếu sanity ≤ 2: Huyết tự L2 (chưa đánh dấu k2) và L4 (chưa đánh dấu k6) hiện bản méo."
    expect(section(md, '#### M2-40 · Tiếng gà trong phòng')).toContain(
      'Nếu sanity ≤ 2: Huyết tự L2 (chưa đánh dấu k2) và L4 (chưa đánh dấu k6) hiện bản méo.',
    );
    expect(blood(nodes.scene('m2_n40').lines)).toEqual([
      { ch: 'bloodtext', lines: ['L2'], if: { sanity_lte: 2, not_highlighted: 'k2' } },
      { ch: 'bloodtext', lines: ['L4'], if: { sanity_lte: 2, not_highlighted: 'k6' } },
    ]);
    for (const n of level.nodes) {
      if (!['m2_n02', 'm2_n40'].includes(n.id)) expect(blood(n.lines), n.id).toEqual([]);
    }
  });

  test('hub căn hộ: mỗi lựa chọn tốn 1 lượt, xong quay về M2-03', () => {
    const hub = nodes.scene('m2_n03');
    for (const c of hub.choices!) {
      expect(c.effects).toEqual([{ actions_left: -1 }]);
      expect(nodes.scene(c.goto).next).toBe('m2_n03');
    }
  });

  test('anh_phong và phong_gia cùng tên hiển thị (G25)', () => {
    const names = Object.fromEntries(level.npcs.map((n) => [n.id, n.name]));
    expect(names.anh_phong).toBe('Anh Phong');
    expect(names.phong_gia).toBe('Anh Phong');
  });
});
