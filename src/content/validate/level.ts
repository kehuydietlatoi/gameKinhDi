// Kiểm tra một màn đã qua schema: tham chiếu, khai báo, đồ thị, chữ.
// AGENTS.md mục 6 và 11; docs/spec-changes.md G1–G22.
import { invalidPlaceholders } from '../../engine/interpolate.ts';
import type { Assets, Condition, Level, Node } from '../types.ts';
import { checkSceneClues } from './scenes.ts';
import { conditions, effects, lines, successors } from './walk.ts';

/**
 * `knownDossiers`: id hồ sơ khai báo ở mọi màn, để `has_dossier` tham chiếu được hồ sơ
 * của màn trước (G27).
 */
export function validateLevel(level: Level, assets: Assets | null, knownDossiers: Set<string> = new Set()): string[] {
  const errors: string[] = [];
  const err = (where: string, msg: string) => errors.push(`${level.level}: ${where} — ${msg}`);

  const nodes = new Map<string, Node>();
  for (const n of level.nodes) {
    if (nodes.has(n.id)) err(n.id, 'id node bị trùng');
    nodes.set(n.id, n);
    if (!n.id.startsWith(`${level.level}_`)) err(n.id, `id node phải bắt đầu bằng ${level.level}_`);
  }

  // ---------- Khai báo ----------
  const unique = (kind: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) err(kind, `id ${id} bị khai báo hai lần`);
      seen.add(id);
    }
    return seen;
  };
  const lineIds = unique('bloodtext', level.bloodtext.map((b) => b.id));
  const keywordIds = unique('keywords', level.keywords.map((k) => k.id));
  const npcIds = unique('npcs', level.npcs.map((n) => n.id));
  const groupNpcs = new Set(level.npcs.filter((n) => n.group).map((n) => n.id));
  const clueIds = unique('clues', level.clues);
  const dossierIds = unique('dossiers', level.dossiers.map((d) => d.id));
  const anyDossier = new Set([...dossierIds, ...knownDossiers]);
  const assetIds = new Set(assets?.assets.map((a) => a.id) ?? []);

  const need = (set: Set<string>, kind: string, id: string, where: string) => {
    if (!set.has(id)) err(where, `${kind} \`${id}\` chưa được khai báo`);
  };
  const lineText = new Map(level.bloodtext.map((b) => [b.id, b.text]));
  const keywordLine = new Map(level.keywords.map((k) => [k.id, k.line]));

  const fakeIds = new Set(level.bloodtext.filter((b) => b.fake).map((b) => b.id));
  /** G36: dòng giả không phải Huyết tự, nên không được làm từ khoá, violates hay consequence_of. */
  const needReal = (id: string, where: string, what: string) => {
    need(lineIds, 'dòng Huyết tự', id, where);
    if (fakeIds.has(id)) err(where, `dòng giả ${id} không dùng được cho ${what} (G36)`);
  };

  for (const [i, k] of level.keywords.entries()) {
    needReal(k.line, `keywords[${i}]`, 'từ khoá');
    const text = lineText.get(k.line);
    if (text !== undefined && !text.includes(k.text)) {
      err(`keywords[${i}] (${k.id})`, `"${k.text}" không có nguyên văn trong dòng ${k.line}`);
    }
  }
  for (const [i, d] of level.distortions.entries()) {
    need(lineIds, 'dòng Huyết tự', d.line, `distortions[${i}]`);
    if (!('unless_highlighted' in d)) continue; // G37: đổi mực, không cần từ khoá
    need(keywordIds, 'từ khoá', d.unless_highlighted, `distortions[${i}]`);
    const kLine = keywordLine.get(d.unless_highlighted);
    if (kLine && kLine !== d.line) {
      err(`distortions[${i}]`, `từ khoá ${d.unless_highlighted} thuộc dòng ${kLine}, không phải ${d.line}`);
    }
  }
  const distortionKinds = level.distortions.map((d) => `${d.line}:${'ink' in d ? 'ink' : 'text'}`);
  if (new Set(distortionKinds).size !== distortionKinds.length) {
    err('distortions', 'mỗi dòng chỉ có một bản méo đổi chữ và một bản méo đổi mực');
  }
  if (level.final === undefined && level.nodes.some((n) => n.type === 'ending' && n.open)) {
    err('nodes', '`open` chỉ dùng ở màn có `final: true` (G41)');
  }
  const solutionRef = (id: string, where: string) =>
    need(id.startsWith('k') ? keywordIds : lineIds, id.startsWith('k') ? 'từ khoá' : 'dòng Huyết tự', id, where);
  level.solution.forEach((id, i) => solutionRef(id, `solution[${i}]`));

  // ---------- Tham chiếu từ node ----------
  const needNode = (id: string, where: string) => {
    if (!nodes.has(id)) err(where, `node \`${id}\` không tồn tại`);
  };
  const startNode = nodes.get(level.start);
  if (!startNode) err('start', `node \`${level.start}\` không tồn tại`);
  if (level.on_sanity_zero) {
    const n = nodes.get(level.on_sanity_zero);
    if (!n) err('on_sanity_zero', `node \`${level.on_sanity_zero}\` không tồn tại`);
    else if (n.id === level.start) err('on_sanity_zero', 'không được trỏ về `start`');
  }
  for (const n of level.nodes) {
    for (const s of successors(n)) needNode(s.to, `${n.id}.${s.where}`);
    if (n.type === 'scene') {
      if (n.hub) {
        const gotos = n.choices!.map((c) => c.goto);
        if (new Set(gotos).size !== gotos.length) err(`${n.id}.choices`, 'lựa chọn của hub phải có `goto` khác nhau (G1)');
      }
      if (n.highlight && !n.lines.some((l) => l.ch === 'bloodtext')) {
        err(`${n.id}.highlight`, 'node mở giao diện đánh dấu phải có dòng bloodtext');
      }
    } else {
      n.violates?.forEach((id, i) => needReal(id, `${n.id}.violates[${i}]`, 'violates'));
      n.consequence_of?.forEach((id, i) => needReal(id, `${n.id}.consequence_of[${i}]`, 'consequence_of'));
      n.solution?.forEach((id, i) => solutionRef(id, `${n.id}.solution[${i}]`));
      n.unlock?.forEach((u, i) => need(dossierIds, 'hồ sơ', u.dossier, `${n.id}.unlock[${i}]`));
    }
    const scenes = n.scene === undefined ? [] : Array.isArray(n.scene) ? n.scene : [n.scene];
    for (const [i, s] of scenes.entries()) {
      if (s.bg && assets && !assetIds.has(s.bg)) err(`${n.id}.scene${Array.isArray(n.scene) ? `[${i}]` : ''}.bg`, `ảnh \`${s.bg}\` không có trong assets.yaml`);
    }
  }
  if (keywordIds.size > 0 && !level.nodes.some((n) => n.type === 'scene' && n.highlight)) {
    err('nodes', 'màn có từ khoá nhưng không node nào có `highlight: true` (G14)');
  }

  for (const { value, where } of lines(level)) {
    if (value.ch === 'npc') need(npcIds, 'NPC', value.who, `${where}.who`);
    if (value.ch === 'bloodtext') value.lines.forEach((id, i) => need(lineIds, 'dòng Huyết tự', id, `${where}.lines[${i}]`));
  }

  // Cờ và chỗ trốn không khai báo riêng, nên điều kiện phải dùng giá trị có hiệu ứng đặt ra.
  const flagsSet = new Set<string>();
  const spotsSet = new Set<string>();
  for (const { value, where } of effects(level)) {
    if (value.flag !== undefined) flagsSet.add(value.flag);
    if (value.spot !== undefined) spotsSet.add(value.spot);
    if (value.clue !== undefined) need(clueIds, 'manh mối', value.clue, where);
    if (value.found !== undefined) {
      need(npcIds, 'NPC', value.found, where);
      if (groupNpcs.has(value.found)) err(where, `NPC nhóm \`${value.found}\` không dùng được với found`);
    }
    if (value.visit !== undefined) needNode(value.visit, where);
  }

  const hubIds = new Set(level.nodes.filter((n) => n.type === 'scene' && n.hub).map((n) => n.id));
  for (const { value, where, node } of conditions(level)) {
    if (value.clue !== undefined) need(clueIds, 'manh mối', value.clue, where);
    if (value.not_highlighted !== undefined) need(keywordIds, 'từ khoá', value.not_highlighted, where);
    if (value.not_visited !== undefined) needNode(value.not_visited, where);
    if (value.has_dossier !== undefined) need(anyDossier, 'hồ sơ', value.has_dossier, where);
    for (const f of [value.flag, value.not_flag]) {
      if (f !== undefined && !flagsSet.has(f)) err(where, `cờ \`${f}\` không được hiệu ứng nào bật`);
    }
    if (value.spot !== undefined && !spotsSet.has(value.spot)) {
      err(where, `chỗ trốn \`${value.spot}\` không được hiệu ứng nào đặt`);
    }
    if (value.visited_count_gte !== undefined && !hubIds.has(node.id)) {
      err(where, '`visited_count_gte` chỉ dùng trong node hub (G1)');
    }
  }

  // ---------- Chữ ----------
  const checkText = (text: string, where: string) => {
    for (const bad of invalidPlaceholders(text)) err(where, `biểu thức không hợp lệ: ${bad} (G7)`);
  };
  for (const { value, where } of lines(level)) {
    if ('text' in value) checkText(value.text, `${where}.text`);
  }
  for (const n of level.nodes) {
    if (n.type === 'scene') (n.choices ?? []).forEach((c, i) => checkText(c.text, `${n.id}.choices[${i}].text`));
    else {
      checkText(n.reveal, `${n.id}.reveal`);
      checkText(n.cause, `${n.id}.cause`);
    }
  }

  // ---------- Luật tối thượng (AGENTS 6.5, G16) ----------
  for (const b of level.bloodtext) {
    if (!b.violable) continue;
    const covered = level.nodes.some((n) => n.type === 'ending' && n.result === 'death' && n.violates?.includes(b.id));
    if (!covered) err(`bloodtext ${b.id}`, 'dòng có thể bị vi phạm nhưng không có kết cục chết nào `violates` nó');
  }

  // ---------- Đồ thị ----------
  if (startNode) {
    // on_sanity_zero tới được từ bất kỳ node nào nên cũng là một điểm xuất phát (G26).
    const roots = [level.start, ...(level.on_sanity_zero && nodes.has(level.on_sanity_zero) ? [level.on_sanity_zero] : [])];
    const reachable = new Set<string>(roots);
    const queue = [...roots];
    while (queue.length) {
      const n = nodes.get(queue.shift()!);
      if (!n) continue;
      for (const s of successors(n)) {
        if (!reachable.has(s.to) && nodes.has(s.to)) {
          reachable.add(s.to);
          queue.push(s.to);
        }
      }
    }
    for (const n of level.nodes) if (!reachable.has(n.id)) err(n.id, 'không tới được từ `start`');

    // Từ mọi node phải tới được một ending (không có vòng kẹt).
    const preds = new Map<string, string[]>();
    for (const n of level.nodes) {
      for (const s of successors(n)) preds.set(s.to, [...(preds.get(s.to) ?? []), n.id]);
    }
    const canEnd = new Set(level.nodes.filter((n) => n.type === 'ending').map((n) => n.id));
    const back = [...canEnd];
    while (back.length) {
      for (const p of preds.get(back.shift()!) ?? []) {
        if (!canEnd.has(p)) {
          canEnd.add(p);
          back.push(p);
        }
      }
    }
    for (const n of level.nodes) {
      if (reachable.has(n.id) && !canEnd.has(n.id)) err(n.id, 'từ node này không đi tới được kết cục nào');
    }

    if (assets) errors.push(...checkSceneClues(level, assets, nodes).map((e) => `${level.level}: ${e}`));
  }

  return errors;
}

/**
 * Hai điều kiện chắc chắn không cùng đúng: cờ bật/tắt, chỗ trốn khác nhau, vai khác nhau.
 * Chỉ nhận ra những cặp đơn giản; không nhận ra thì coi như có thể cùng đúng.
 */
export function exclusive(a: Condition | undefined, b: Condition | undefined): boolean {
  if (!a || !b) return false;
  const flips = (x: Condition, y: Condition) =>
    (x.flag !== undefined && x.flag === y.not_flag) || (x.has_spot === false && y.spot !== undefined);
  if (flips(a, b) || flips(b, a)) return true;
  if (a.spot !== undefined && b.spot !== undefined && a.spot !== b.spot) return true;
  if (a.has_spot !== undefined && b.has_spot !== undefined && a.has_spot !== b.has_spot) return true;
  if (a.role !== undefined && b.role !== undefined && a.role !== b.role) return true;
  return false;
}

/** Cảnh báo, không chặn: hai lựa chọn cùng chữ có thể cùng hiện (G31). */
export function levelWarnings(level: Level): string[] {
  const warnings: string[] = [];
  for (const n of level.nodes) {
    if (n.type !== 'scene') continue;
    const choices = n.choices ?? [];
    choices.forEach((a, i) => {
      choices.slice(i + 1).forEach((b, k) => {
        if (a.text === b.text && !exclusive(a.if, b.if)) {
          warnings.push(
            `${level.level}: ${n.id}.choices[${i}] và [${i + 1 + k}] — hai lựa chọn cùng chữ "${a.text}" có thể cùng hiện (G31)`,
          );
        }
      });
    });
  }
  return warnings;
}
