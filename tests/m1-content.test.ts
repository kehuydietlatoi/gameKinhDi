// Đối chiếu content/m1.yaml với docs/man-1-tron-tim.md (AGENTS.md mục 6.1).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { parseLevel } from '../src/content/loader.ts';
import type { EndingNode, Line, SceneNode } from '../src/content/types.ts';
import {
  parseEndings,
  parseNodes,
  section,
  tableRows,
  type DocLine,
} from './helpers/script-doc.ts';

const root = join(import.meta.dirname, '..');
const md = readFileSync(join(root, 'docs', 'man-1-tron-tim.md'), 'utf8');
const parsed = parseLevel(readFileSync(join(root, 'content', 'm1.yaml'), 'utf8'), 'm1.yaml');
if (!parsed.ok) throw new Error(parsed.errors.join('\n'));
const level = parsed.value;

const byId = new Map(level.nodes.map((n) => [n.id, n]));
const sceneNode = (id: string) => {
  const n = byId.get(id);
  if (n?.type !== 'scene') throw new Error(`Không có node scene ${id}`);
  return n as SceneNode;
};
const endingNode = (id: string) => {
  const n = byId.get(id);
  if (n?.type !== 'ending') throw new Error(`Không có ending ${id}`);
  return n as EndingNode;
};

/** Dòng YAML ở dạng so được với dòng kịch bản (bỏ `if`, bỏ bloodtext). */
function comparable(lines: Line[]): DocLine[] {
  return lines.flatMap((l): DocLine[] => {
    switch (l.ch) {
      case 'bloodtext':
        return [];
      case 'env':
        return [{ ch: l.ch, sense: l.sense, text: l.text }];
      case 'sound':
        return [{ ch: l.ch, src: l.src, vol: l.vol, text: l.text }];
      case 'npc':
        return [{ ch: l.ch, who: l.who, tone: l.tone, text: l.text, ...(l.note ? { note: l.note } : {}) }];
      default:
        return [{ ch: l.ch, text: l.text }];
    }
  });
}
const docLines = (lines: DocLine[]) => lines.filter((l) => l.ch !== 'bloodtext');

describe('m1.yaml khớp kịch bản', () => {
  test('trạng thái đầu', () => {
    const overview = section(md, '## Tổng quan');
    expect(overview).toContain('`sanity` 5, `actions_left` 3, `role` none, `time` "23:59"');
    expect(level.init).toEqual({ sanity: 5, actions_left: 3, time: '23:59' });
  });

  test('Huyết tự nguyên văn', () => {
    const rows = tableRows(section(md, '### Huyết tự (nguyên văn)'));
    expect(level.bloodtext.map((b) => [b.id, b.text])).toEqual(rows);
  });

  test('từ khoá', () => {
    const rows = tableRows(section(md, '### Từ khoá đánh dấu'));
    expect(level.keywords.map((k) => [k.id, k.line, k.text, k.correct ? 'có' : 'không'])).toEqual(rows);
  });

  test('bóp méo', () => {
    const rows = tableRows(section(md, '### Bóp méo (khi `sanity` ≤ 2)'));
    expect(level.distortions.map((d) => [d.line, d.unless_highlighted, d.text])).toEqual(rows);
  });

  test('nhân vật', () => {
    const rows = tableRows(section(md, '## Nhân vật')).map(([id, name]) => [id!.replace(/`/g, ''), name]);
    expect(level.npcs.filter((n) => !n.group).map((n) => [n.id, n.name])).toEqual(rows);
  });

  test('manh mối', () => {
    const rows = tableRows(section(md, '## Manh mối'));
    expect(level.clues).toEqual(rows.map((r) => r[0]));
  });

  const docNodes = parseNodes(md, 'm1');
  const docEndings = parseEndings(md, 'm1');

  test('đủ node và kết cục, không thừa', () => {
    const expected = [...docNodes.map((n) => n.id), ...docEndings.map((e) => e.id)].sort();
    expect(level.nodes.map((n) => n.id).sort()).toEqual(expected);
  });

  describe.each(docNodes)('$id', (doc) => {
    const node = sceneNode(doc.id);

    test('dòng chữ nguyên văn, đúng thứ tự và tham số', () => {
      expect(comparable(node.lines)).toEqual(docLines(doc.lines));
    });

    test('hiệu ứng của node', () => {
      expect(node.effects ?? []).toEqual(doc.effects);
    });

    test('lựa chọn', () => {
      // actions_left và time_add của hub đến từ mô tả hub, không nằm trong từng lựa chọn.
      const hubOnly = (e: object) => !('actions_left' in e) && !('time_add' in e);
      const actual = (node.choices ?? []).map((c) => ({
        text: c.text,
        goto: c.goto,
        effects: (c.effects ?? []).filter(hubOnly),
      }));
      expect(actual).toEqual(doc.choices);
    });

    if (doc.next) {
      test('tiếp', () => {
        expect(node.next).toBe(doc.next);
      });
    }
  });

  describe.each(docEndings)('$id', (doc) => {
    const node = endingNode(doc.id);
    test('nguyên nhân, dòng cuối, hé lộ', () => {
      expect(node.cause).toBe(doc.cause);
      expect(comparable(node.lines)).toEqual(docLines(doc.lines));
      expect(node.reveal).toBe(doc.reveal);
    });
  });

  test('kết quả và loại kết cục', () => {
    for (const e of docEndings) {
      expect(endingNode(e.id).result).toBe(e.id.includes('_e') ? 'survive' : 'death');
    }
  });

  test('Huyết tự đặt đúng chỗ', () => {
    const blood = (lines: Line[]) => lines.filter((l) => l.ch === 'bloodtext');
    expect(blood(sceneNode('m1_n02').lines)).toEqual([{ ch: 'bloodtext', lines: ['L1', 'L2', 'L3', 'L4', 'L5'] }]);
    expect(blood(sceneNode('m1_n41').lines)).toEqual([
      { ch: 'bloodtext', lines: ['L3'], if: { sanity_lte: 2, not_highlighted: 'k3' } },
    ]);
    expect(blood(sceneNode('m1_n53').lines)).toEqual([
      { ch: 'bloodtext', lines: ['L4'], if: { sanity_lte: 2, not_highlighted: 'k4' } },
    ]);
    expect(blood(endingNode('m1_d1').lines)).toEqual([{ ch: 'bloodtext', lines: ['L1'], style: 'glow' }]);
    // Kịch bản: "Dòng L1 đỏ rực lên." là chỉ dẫn hiển thị, được thay bằng style: glow (G9).
    const d1 = docEndings.find((e) => e.id === 'm1_d1')!;
    expect(d1.lines[0]).toEqual({ ch: 'bloodtext', text: 'Dòng L1 đỏ rực lên.' });
  });

  test('điều kiện ghi trong kịch bản', () => {
    expect(sceneNode('m1_n20').lines.find((l) => l.ch === 'narration')?.if).toEqual({ clue: 'c1' });
    expect(sceneNode('m1_n20').choices?.[3]?.if).toEqual({ flag: 'na_moi_tron' });
    const n31 = sceneNode('m1_n31').lines.map((l) => l.if?.spot ?? null);
    expect(n31).toEqual(['tu_go', 'wc', 'wc', 'san_phoi', null, null, null]);
    expect(sceneNode('m1_n50').lines.map((l) => l.if)).toEqual([{ following_lte: 0 }, { following_gte: 1 }]);
  });

  test('hub', () => {
    const n04 = sceneNode('m1_n04');
    expect(n04).toMatchObject({ hub: true, hub_done: { actions_left_lte: 0 }, hub_exit: 'm1_n20' });
    for (const c of n04.choices!) {
      expect(c.effects).toContainEqual({ actions_left: -1 });
      expect(sceneNode(c.goto).next).toBe('m1_n04');
    }
    const n50 = sceneNode('m1_n50');
    expect(n50).toMatchObject({ hub: true, hub_done: { visited_count_gte: 4 }, hub_exit: 'm1_n60' });
    for (const c of n50.choices!) expect(c.effects).toContainEqual({ time_add: 60 });
  });

  test('kết cục: violates, consequence_of, solution, unlock (G16–G18)', () => {
    expect(level.solution).toEqual(['k4']);
    expect(endingNode('m1_d1')).toMatchObject({ violates: ['L1'], solution: ['L1'] });
    expect(endingNode('m1_d3')).toMatchObject({ violates: ['L3'], solution: ['k3'] });
    for (const id of ['m1_d2', 'm1_d4', 'm1_d5']) {
      expect(endingNode(id).consequence_of).toEqual(['L4']);
    }
    expect(level.bloodtext.filter((b) => !b.violable).map((b) => b.id)).toEqual(['L2', 'L4', 'L5']);
    expect(endingNode('m1_e1').unlock).toEqual([{ dossier: 'hs_chay_c4_1986', if: { clue: 'c1' } }]);
    expect(level.dossiers).toEqual([{ id: 'hs_chay_c4_1986', title: 'Vụ cháy nhà C4, 1986' }]);
    expect(md).toContain('mở khoá hồ sơ "Vụ cháy nhà C4, 1986"');
  });

  test('gán cảnh khớp bảng', () => {
    const rows = tableRows(section(md, '### Gán cảnh cho node'));
    const strip = (s: string) => s.replace(/`/g, '');
    const listed = new Set<string>();
    for (const [ref, bg, light] of rows) {
      if (ref === 'D1–D5') {
        for (const id of ['m1_d1', 'm1_d2', 'm1_d3', 'm1_d4', 'm1_d5']) {
          expect(endingNode(id).scene).toBeUndefined();
          listed.add(id);
        }
        continue;
      }
      const id = ref === 'E1' ? 'm1_e1' : `m1_n${ref!.slice(3)}`;
      listed.add(id);
      const scene = byId.get(id)!.scene;
      if (ref === 'M1-31') {
        expect(scene).toEqual([
          { if: { spot: 'tu_go' }, light: 'dark' },
          { if: { spot: 'wc' }, bg: 'nha_ve_sinh_chung', light: 'flicker' },
          { if: { spot: 'san_phoi' }, bg: 'san_phoi', light: 'normal' },
        ]);
      } else if (bg === 'giữ nguyên') {
        expect(scene).toEqual({ light: strip(light!) });
      } else {
        expect(scene).toEqual({ bg: strip(bg!), light: strip(light!) });
      }
    }
    for (const n of level.nodes) {
      if (!listed.has(n.id)) expect(n.scene, n.id).toBeUndefined();
    }
  });
});
