// Đọc file kịch bản docs/man-*.md thành dữ liệu có cấu trúc để test đối chiếu
// với content/*.yaml (AGENTS.md mục 6.1: giữ nguyên văn).
// Chỉ hiểu đúng các ký hiệu mà file kịch bản dùng; dòng chỉ dẫn khác bị bỏ qua.

export type DocCondition = Record<string, string>;

export type DocLine = {
  ch: string;
  sense?: string;
  src?: string;
  vol?: number;
  who?: string;
  tone?: string;
  text: string;
  note?: string;
  /** Điều kiện ghi dạng "(nếu flag `x`)" trước chữ. */
  if?: DocCondition;
};

export type DocEffect = Record<string, string | number | boolean>;

export type DocChoice = { text: string; goto: string; effects: DocEffect[]; if?: DocCondition };

export type DocNode = {
  id: string;
  lines: DocLine[];
  effects: DocEffect[];
  choices: DocChoice[];
  next?: string;
  highlight?: boolean;
  hub?: { done?: string; exit?: string };
};

export type DocEnding = {
  id: string;
  cause: string;
  lines: DocLine[];
  reveal: string;
  violates?: string[];
  consequence_of?: string[];
  solution?: string[];
};

const CHANNEL = /`(narration|env|sound|npc|bloodtext|system)((?: · [^`]+)?)`\s*/g;
const TONE: Record<string, string> = { 'thì thầm': 'whisper', hét: 'shout' };
const WHO: Record<string, string> = { 'tất cả': 'tat_ca' };
const CONDITION = /^\(nếu ([a-z_]+) `?([^`)]+)`?\)\s*/;

/** M1-05 → m1_n05, M1-52b → m1_n52b, D3 → m1_d3, E1 → m1_e1. */
export function docIdToNodeId(level: string, ref: string): string {
  const scene = /^M(\d+)-(\d+[a-z]?)$/.exec(ref);
  if (scene) return `m${scene[1]}_n${scene[2]}`;
  const ending = /^([DE])(\d+)$/.exec(ref);
  if (ending) return `${level}_${ending[1]!.toLowerCase()}${ending[2]}`;
  throw new Error(`Không hiểu id trong kịch bản: ${ref}`);
}

/** "D1–D4" → [D1, D2, D3, D4]; "E1, E2" → [E1, E2]; "M2-10" → [M2-10]. */
export function expandRefs(cell: string): string[] {
  return cell.split(',').flatMap((part) => {
    const range = /^([DE])(\d+)–\1?(\d+)$/.exec(part.trim());
    if (!range) return [part.trim()];
    const out: string[] = [];
    for (let i = Number(range[2]); i <= Number(range[3]); i++) out.push(`${range[1]}${i}`);
    return out;
  });
}

/** Nội dung dưới một tiêu đề, tới tiêu đề kế tiếp cùng cấp hoặc cao hơn. */
export function section(md: string, heading: string): string {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === heading);
  if (start < 0) throw new Error(`Không thấy tiêu đề: ${heading}`);
  const level = heading.match(/^#+/)![0].length;
  const out: string[] = [];
  for (const line of lines.slice(start + 1)) {
    const h = line.match(/^(#+) /);
    if (h && h[1]!.length <= level) break;
    out.push(line);
  }
  return out.join('\n');
}

// Ô trong bảng kịch bản không chứa dấu |, nên tách thẳng theo | (giữ được ô trống).
const splitRow = (l: string) =>
  l
    .trim()
    .slice(1, -1)
    .split('|')
    .map((c) => c.trim());

/** Các hàng của bảng markdown (bỏ hàng tiêu đề và hàng ---). */
export function tableRows(md: string): string[][] {
  return md
    .split(/\r?\n/)
    .filter((l) => l.startsWith('|'))
    .map(splitRow)
    .slice(2);
}

/** Các hàng của bảng, theo tên cột (bỏ dấu ` trong tên cột). */
export function tableObjects(md: string): Record<string, string>[] {
  const rows = md
    .split(/\r?\n/)
    .filter((l) => l.startsWith('|'))
    .map(splitRow);
  const header = rows[0]!.map((h) => h.replace(/`/g, ''));
  return rows.slice(2).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ''])));
}

function takeCondition(text: string): { text: string; if?: DocCondition } {
  const m = CONDITION.exec(text);
  return m ? { text: text.slice(m[0].length), if: { [m[1]!]: m[2]! } } : { text };
}

/** Tách một chuỗi có thể chứa nhiều đoạn `kênh · tham số` text. */
export function parseChannelSegments(s: string): DocLine[] {
  const matches = [...s.matchAll(CHANNEL)];
  return matches.map((m, i) => {
    const end = i + 1 < matches.length ? matches[i + 1]!.index : s.length;
    const cond = takeCondition(s.slice(m.index + m[0].length, end).trim());
    const params = m[2] ? m[2].split(' · ').slice(1).map((p) => p.trim()) : [];
    const ch = m[1]!;
    const line: DocLine = { ch, text: cond.text };
    if (cond.if) line.if = cond.if;
    if (ch === 'env') {
      line.sense = params[0];
    } else if (ch === 'sound') {
      line.src = params[0];
      line.vol = Number(params[1]);
    } else if (ch === 'npc') {
      line.who = WHO[params[0]!] ?? params[0];
      line.tone = params[1] ? TONE[params[1]] ?? params[1] : 'normal';
      const note = /^(.*\S)\s+\(([^)]+)\)$/.exec(line.text);
      if (note) {
        line.text = note[1]!;
        line.note = note[2];
      }
    }
    return line;
  });
}

/** "clue c1, sanity −1" → [{clue: 'c1'}, {sanity: -1}]. */
export function parseEffects(s: string): DocEffect[] {
  return s
    .replace(/`/g, '')
    .replace(/\.$/, '')
    .split(', ')
    .map((token) => {
      const [key, ...rest] = token.trim().split(' ');
      const raw = rest.join(' ').replace(/^"(.*)"$/, '$1');
      let value: string | number | boolean = raw;
      if (raw === 'true' || raw === 'false') value = raw === 'true';
      else if (/^[−-]?\d+$/.test(raw)) value = Number(raw.replace('−', '-'));
      return { [key!]: value };
    });
}

export function parseNodes(md: string, level: string): DocNode[] {
  const body = section(md, '## Kịch bản theo node');
  const blocks = body.split(/^#### /m).slice(1);
  return blocks.map((block) => {
    const [header, ...rest] = block.split(/\r?\n/);
    const ref = header!.split(' · ')[0]!.trim();
    const node: DocNode = { id: docIdToNodeId(level, ref), lines: [], effects: [], choices: [] };
    for (const raw of rest) {
      const line = raw.trim();
      const choice = /^\d+\. (.+?) → (\S+)(?: · (.+))?$/.exec(line);
      if (choice) {
        const cond = takeCondition(choice[1]!);
        node.choices.push({
          text: cond.text,
          goto: docIdToNodeId(level, choice[2]!),
          effects: choice[3] ? parseEffects(choice[3]) : [],
          ...(cond.if ? { if: cond.if } : {}),
        });
        continue;
      }
      const effect = /^- Hiệu ứng(?: khi vào node)?: (.+)$/.exec(line);
      if (effect) {
        node.effects.push(...parseEffects(effect[1]!));
        continue;
      }
      const next = /^- Tiếp: (\S+)$/.exec(line);
      if (next) {
        node.next = docIdToNodeId(level, next[1]!);
        continue;
      }
      if (line.startsWith('- `highlight: true`')) {
        node.highlight = true;
        continue;
      }
      if (line.startsWith('`hub: true`')) {
        const done = /`hub_done: (\{[^`]+\})`/.exec(line);
        const exit = /`hub_exit: (\S+?)`/.exec(line);
        node.hub = {
          ...(done ? { done: done[1] } : {}),
          ...(exit ? { exit: docIdToNodeId(level, exit[1]!) } : {}),
        };
        continue;
      }
      if (line.startsWith('- ')) node.lines.push(...parseChannelSegments(line.slice(2)));
    }
    return node;
  });
}

const idList = (s: string | undefined) =>
  s && s !== '—' ? s.replace(/[[\]`]/g, '').split(',').map((x) => x.trim()) : undefined;

export function parseEndings(md: string, level: string): DocEnding[] {
  return tableObjects(section(md, '## Kết cục')).map((row) => {
    const [ref, cause] = row.id!.split(' · ');
    const rule = row['Luật'] ?? '';
    const violates = /violates: \[([^\]]+)\]/.exec(rule);
    const consequence = /consequence_of: \[([^\]]+)\]/.exec(rule);
    return {
      id: docIdToNodeId(level, ref!.trim()),
      cause: cause!.trim(),
      lines: parseChannelSegments(row['Dòng cuối']!),
      reveal: row['Hé lộ']!.replace(/\s*Nếu có clue [^:]+:.*$/, ''),
      ...(violates ? { violates: idList(violates[1]) } : {}),
      ...(consequence ? { consequence_of: idList(consequence[1]) } : {}),
      ...(row.solution ? { solution: idList(row.solution) } : {}),
    };
  });
}

/** Phần "Tổng quan": trạng thái đầu, on_sanity_zero, solution cấp màn. */
export function parseOverview(md: string) {
  const s = section(md, '## Tổng quan');
  const num = (key: string) => Number(new RegExp('`' + key + '` (\\d+)').exec(s)![1]);
  const zero = /\*\*`on_sanity_zero`:\*\* `([a-z0-9_]+)`/.exec(s);
  const solution = /\*\*`solution` cấp màn:\*\* `(\[[^\]]+\])`/.exec(s);
  return {
    init: { sanity: num('sanity'), actions_left: num('actions_left'), time: /`time` "(\d\d:\d\d)"/.exec(s)![1]! },
    on_sanity_zero: zero?.[1],
    solution: idList(solution?.[1]),
  };
}
