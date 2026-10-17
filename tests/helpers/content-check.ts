// Đối chiếu content/<màn>.yaml với docs/man-<số>-*.md (AGENTS.md mục 6.1), dùng chung cho mọi màn.
// Mỗi màn gọi checkLevelContent rồi tự thêm kiểm tra riêng (bloodtext trong node, cảnh theo spot…).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { parseLevel } from '../../src/content/loader.ts';
import type { EndingNode, Level, Line, SceneNode } from '../../src/content/types.ts';
import {
  expandRefs,
  parseEndings,
  parseNodes,
  parseOverview,
  section,
  tableObjects,
  tableRows,
  type DocLine,
} from './script-doc.ts';

const root = join(import.meta.dirname, '..', '..');

export function loadDoc(docFile: string): string {
  return readFileSync(join(root, 'docs', docFile), 'utf8');
}

export function loadContentLevel(levelId: string): Level {
  const parsed = parseLevel(readFileSync(join(root, 'content', `${levelId}.yaml`), 'utf8'), `${levelId}.yaml`);
  if (!parsed.ok) throw new Error(parsed.errors.join('\n'));
  return parsed.value;
}

export function nodeAccess(level: Level) {
  const byId = new Map(level.nodes.map((n) => [n.id, n]));
  return {
    scene: (id: string) => {
      const n = byId.get(id);
      if (n?.type !== 'scene') throw new Error(`Không có node scene ${id}`);
      return n as SceneNode;
    },
    ending: (id: string) => {
      const n = byId.get(id);
      if (n?.type !== 'ending') throw new Error(`Không có ending ${id}`);
      return n as EndingNode;
    },
    any: (id: string) => byId.get(id),
  };
}

/** Dòng YAML ở dạng so được với dòng kịch bản; `withIf[i]` = so cả điều kiện của dòng i. */
function comparable(lines: Line[], withIf: boolean[]): DocLine[] {
  return lines
    .filter((l) => l.ch !== 'bloodtext')
    .map((l, i): DocLine => {
      const cond = withIf[i] && l.if ? { if: l.if as Record<string, string> } : {};
      switch (l.ch) {
        case 'env':
          return { ch: l.ch, sense: l.sense, text: l.text, ...cond };
        case 'sound':
          return { ch: l.ch, src: l.src, vol: l.vol, text: l.text, ...cond };
        case 'npc':
          return { ch: l.ch, who: l.who, tone: l.tone, text: l.text, ...(l.note ? { note: l.note } : {}), ...cond };
        default:
          return { ch: l.ch, text: l.text, ...cond };
      }
    });
}

const docLines = (lines: DocLine[]) => lines.filter((l) => l.ch !== 'bloodtext');

/** Các node không có trong bảng gán cảnh phải không khai báo scene; trả về các hàng đặc biệt để màn tự kiểm. */
function checkSceneTable(md: string, level: Level, special: string[]) {
  const nodes = nodeAccess(level);
  const strip = (s: string) => s.replace(/`/g, '');
  const listed = new Set<string>();
  for (const row of tableObjects(section(md, '### Gán cảnh cho node'))) {
    const refs = expandRefs(row.Node!);
    const ids = refs.map((r) => (/^[DE]\d+$/.test(r) ? `${level.level}_${r.toLowerCase()}` : `m${r.slice(1).replace('-', '_n')}`));
    ids.forEach((id) => listed.add(id));
    if (refs.some((r) => special.includes(r))) continue;
    const bg = strip(row.bg ?? '');
    const light = strip(row.light ?? '');
    for (const id of ids) {
      const scene = nodes.any(id)!.scene;
      if (!bg && !light) expect(scene, id).toBeUndefined();
      else if (bg === 'giữ nguyên') expect(scene, id).toEqual({ light });
      else expect(scene, id).toEqual({ bg, light });
    }
  }
  for (const n of level.nodes) {
    if (!listed.has(n.id)) expect(n.scene, n.id).toBeUndefined();
  }
}

export type CheckOptions = {
  /** Các hàng của bảng gán cảnh mà màn tự kiểm (ví dụ M1-31 "theo spot"). */
  specialSceneRows?: string[];
};

export function checkLevelContent(levelId: string, docFile: string, opts: CheckOptions = {}) {
  const md = loadDoc(docFile);
  const level = loadContentLevel(levelId);
  const nodes = nodeAccess(level);
  const docNodes = parseNodes(md, levelId);
  const docEndings = parseEndings(md, levelId);
  const overview = parseOverview(md);

  describe(`${levelId}.yaml khớp ${docFile}`, () => {
    test('tổng quan: trạng thái đầu, on_sanity_zero, solution cấp màn', () => {
      expect(level.init).toEqual(overview.init);
      expect(level.on_sanity_zero).toBe(overview.on_sanity_zero);
      if (overview.solution) expect(level.solution).toEqual(overview.solution);
    });

    test('Huyết tự nguyên văn (và violable nếu bảng có cột này)', () => {
      const rows = tableObjects(section(md, '### Huyết tự (nguyên văn)'));
      expect(level.bloodtext.map((b) => [b.id, b.text])).toEqual(rows.map((r) => [r['Dòng'], r['Nội dung']]));
      if (rows[0] && 'violable' in rows[0]) {
        expect(level.bloodtext.map((b) => b.violable)).toEqual(rows.map((r) => r.violable === 'true'));
      }
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
      expect(level.clues).toEqual(tableRows(section(md, '## Manh mối')).map((r) => r[0]));
    });

    test('đủ node và kết cục, không thừa', () => {
      const expected = [...docNodes.map((n) => n.id), ...docEndings.map((e) => e.id)].sort();
      expect(level.nodes.map((n) => n.id).sort()).toEqual(expected);
    });

    describe.each(docNodes)('$id', (doc) => {
      const node = nodes.scene(doc.id);
      const withIf = docLines(doc.lines).map((l) => l.if !== undefined);

      test('dòng chữ nguyên văn, đúng thứ tự, tham số và điều kiện ghi trong kịch bản', () => {
        expect(comparable(node.lines, withIf)).toEqual(docLines(doc.lines));
      });

      test('hiệu ứng của node', () => {
        expect(node.effects ?? []).toEqual(doc.effects);
      });

      test('lựa chọn', () => {
        // actions_left và time_add của hub đến từ mô tả hub, không nằm trong từng lựa chọn.
        const hubOnly = (e: object) => !('actions_left' in e) && !('time_add' in e);
        const actual = (node.choices ?? []).map((c, i) => ({
          text: c.text,
          goto: c.goto,
          effects: (c.effects ?? []).filter(hubOnly),
          ...(doc.choices[i]?.if ? { if: c.if } : {}),
        }));
        expect(actual).toEqual(doc.choices);
      });

      if (doc.next) test('tiếp', () => expect(node.next).toBe(doc.next));
      if (doc.highlight) test('highlight', () => expect(node.highlight).toBe(true));
      if (doc.hub) {
        test('hub', () => {
          expect(node.hub).toBe(true);
          if (doc.hub!.exit) expect(node.hub_exit).toBe(doc.hub!.exit);
          if (doc.hub!.done) expect(node.hub_done).toEqual(JSON.parse(doc.hub!.done.replace(/(\w+):/g, '"$1":')));
        });
      }
    });

    describe.each(docEndings)('$id', (doc) => {
      const node = nodes.ending(doc.id);
      test('nguyên nhân, dòng cuối, hé lộ, luật, solution', () => {
        expect(node.cause).toBe(doc.cause);
        expect(comparable(node.lines, docLines(doc.lines).map(() => false))).toEqual(docLines(doc.lines));
        expect(node.reveal).toBe(doc.reveal);
        expect(node.result).toBe(doc.id.includes('_e') ? 'survive' : 'death');
        if ('violates' in doc || 'consequence_of' in doc) {
          expect(node.violates).toEqual(doc.violates);
          expect(node.consequence_of).toEqual(doc.consequence_of);
        }
        if (doc.solution) expect(node.solution ?? level.solution).toEqual(doc.solution);
      });
    });

    test('gán cảnh khớp bảng', () => {
      checkSceneTable(md, level, opts.specialSceneRows ?? []);
    });
  });

  return { md, level, nodes, docNodes, docEndings };
}
