// Đối chiếu content/m1.yaml với docs/man-1-tron-tim.md (AGENTS.md mục 6.1).
import { describe, expect, test } from 'vitest';
import type { Line } from '../src/content/types.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { section } from './helpers/script-doc.ts';

const { md, level, nodes, docEndings } = checkLevelContent('m1', 'man-1-tron-tim.md', { specialSceneRows: ['M1-31'] });

describe('m1: kiểm tra riêng', () => {
  test('trạng thái đầu ghi trong Tổng quan', () => {
    expect(section(md, '## Tổng quan')).toContain('`sanity` 5, `actions_left` 3, `role` none, `time` "23:59"');
  });

  test('Huyết tự đặt đúng chỗ', () => {
    const blood = (lines: Line[]) => lines.filter((l) => l.ch === 'bloodtext');
    expect(blood(nodes.scene('m1_n02').lines)).toEqual([{ ch: 'bloodtext', lines: ['L1', 'L2', 'L3', 'L4', 'L5'] }]);
    expect(blood(nodes.scene('m1_n41').lines)).toEqual([
      { ch: 'bloodtext', lines: ['L3'], if: { sanity_lte: 2, not_highlighted: 'k3' } },
    ]);
    expect(blood(nodes.scene('m1_n53').lines)).toEqual([
      { ch: 'bloodtext', lines: ['L4'], if: { sanity_lte: 2, not_highlighted: 'k4' } },
    ]);
    expect(blood(nodes.ending('m1_d1').lines)).toEqual([{ ch: 'bloodtext', lines: ['L1'], style: 'glow' }]);
    // Kịch bản: "Dòng L1 đỏ rực lên." là chỉ dẫn hiển thị, được thay bằng style: glow (G9).
    const d1 = docEndings.find((e) => e.id === 'm1_d1')!;
    expect(d1.lines[0]).toEqual({ ch: 'bloodtext', text: 'Dòng L1 đỏ rực lên.' });
  });

  test('điều kiện không ghi dạng "(nếu …)" trong kịch bản', () => {
    const n31 = nodes.scene('m1_n31').lines.map((l) => l.if?.spot ?? null);
    expect(n31).toEqual(['tu_go', 'wc', 'wc', 'san_phoi', null, null, null]);
    expect(nodes.scene('m1_n50').lines.map((l) => l.if)).toEqual([{ following_lte: 0 }, { following_gte: 1 }]);
    expect(nodes.scene('m1_n30').choices!.map((c) => c.if)).toEqual(Array(3).fill({ has_spot: false }));
    expect(nodes.scene('m1_n30').next).toBe('m1_n31');
  });

  test('hub', () => {
    const n04 = nodes.scene('m1_n04');
    expect(n04).toMatchObject({ hub: true, hub_done: { actions_left_lte: 0 }, hub_exit: 'm1_n20' });
    for (const c of n04.choices!) {
      expect(c.effects).toContainEqual({ actions_left: -1 });
      expect(nodes.scene(c.goto).next).toBe('m1_n04');
    }
    const n50 = nodes.scene('m1_n50');
    expect(n50).toMatchObject({ hub: true, hub_done: { visited_count_gte: 4 }, hub_exit: 'm1_n60' });
    for (const c of n50.choices!) expect(c.effects).toContainEqual({ time_add: 60 });
  });

  test('kết cục: violates, consequence_of, solution, unlock (G16–G18)', () => {
    expect(level.solution).toEqual(['k4']);
    expect(nodes.ending('m1_d1')).toMatchObject({ violates: ['L1'], solution: ['L1'] });
    expect(nodes.ending('m1_d3')).toMatchObject({ violates: ['L3'], solution: ['k3'] });
    for (const id of ['m1_d2', 'm1_d4', 'm1_d5']) expect(nodes.ending(id).consequence_of).toEqual(['L4']);
    expect(level.bloodtext.filter((b) => !b.violable).map((b) => b.id)).toEqual(['L2', 'L4', 'L5']);
    expect(nodes.ending('m1_e1').unlock).toEqual([{ dossier: 'hs_chay_c4_1986', if: { clue: 'c1' } }]);
    expect(level.dossiers).toEqual([{ id: 'hs_chay_c4_1986', title: 'Vụ cháy nhà C4, 1986' }]);
    expect(md).toContain('mở khoá hồ sơ "Vụ cháy nhà C4, 1986"');
  });

  test('cảnh M1-31 theo spot', () => {
    expect(nodes.scene('m1_n31').scene).toEqual([
      { if: { spot: 'tu_go' }, light: 'dark' },
      { if: { spot: 'wc' }, bg: 'nha_ve_sinh_chung', light: 'flicker' },
      { if: { spot: 'san_phoi' }, bg: 'san_phoi', light: 'normal' },
    ]);
  });
});
