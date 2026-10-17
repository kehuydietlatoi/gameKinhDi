// Dữ liệu hiển thị suy ra từ (level, state). UI chỉ đọc các hàm này, không tự tính luật.
import type { EndingNode, Level, Light } from '../content/types.ts';
import { check } from './conditions.ts';
import { displayLine, viewAll, viewLine, viewSolution, type BloodtextView } from './bloodtext.ts';
import { interpolate } from './interpolate.ts';
import { displayedScene } from './scene.ts';
import { following, type GameState } from './state.ts';
import { exits, nodeById, type Exit } from './step.ts';

export type DisplayLine =
  | { ch: 'narration'; text: string }
  | { ch: 'env'; sense: 'nhìn' | 'ngửi' | 'chạm'; text: string }
  | { ch: 'sound'; src: string; vol: 1 | 2 | 3; text: string }
  | { ch: 'npc'; name: string; tone: 'normal' | 'whisper' | 'shout'; text: string; note?: string }
  | { ch: 'bloodtext'; lines: BloodtextView[]; glow: boolean }
  | { ch: 'system'; text: string };

export type View = {
  node: string;
  phase: GameState['phase'];
  lines: DisplayLine[];
  exit: Exit;
  scene: { bg: string | null; light: Light };
  sanity: number;
  /** null khi nhắm mắt: không nhìn được đồng hồ (G24). */
  time: string | null;
  eyesClosed: boolean;
  notices: GameState['notices'];
  bloodtextAvailable: boolean;
  /** Số lượt hành động còn lại, chỉ có ở hub tính theo lượt (G46); null ở chỗ khác. */
  actionsLeft: number | null;
  /** G59: ở node đánh dấu, sau khi xác nhận: chữ các cụm đã đánh dấu; null ở chỗ khác. */
  marked: string[] | null;
};

const fill = (state: GameState, text: string) =>
  interpolate(text, { following: following(state), sanity: state.sanity, actions_left: state.actions_left });

/** Các dòng của node hiện tại; khi nhắm mắt ẩn mọi dòng env nhìn (AGENTS.md mục 7). */
export function displayLines(level: Level, state: GameState): DisplayLine[] {
  const node = nodeById(level, state.node);
  return state.lines.flatMap((i): DisplayLine[] => {
    const line = node.lines[i]!;
    switch (line.ch) {
      case 'env':
        if (state.eyes_closed && line.sense === 'nhìn') return [];
        return [{ ch: 'env', sense: line.sense, text: fill(state, line.text) }];
      case 'sound':
        return [{ ch: 'sound', src: line.src, vol: line.vol, text: fill(state, line.text) }];
      case 'npc': {
        const name = level.npcs.find((n) => n.id === line.who)?.name ?? line.who;
        const out: DisplayLine = { ch: 'npc', name, tone: line.tone, text: fill(state, line.text) };
        return [line.note ? { ...out, note: line.note } : out];
      }
      case 'bloodtext':
        return [{ ch: 'bloodtext', lines: line.lines.map((id) => viewLine(level, state, id)), glow: line.style === 'glow' }];
      case 'narration':
      case 'system':
        return [{ ch: line.ch, text: fill(state, line.text) }];
    }
  });
}

export function view(level: Level, state: GameState): View {
  const exit = exits(level, state);
  return {
    node: state.node,
    phase: state.phase,
    lines: displayLines(level, state),
    exit:
      exit.kind === 'choices'
        ? { kind: 'choices', choices: exit.choices.map((c) => ({ ...c, text: fill(state, c.text) })) }
        : exit,
    scene: displayedScene(state),
    sanity: state.sanity,
    time: state.eyes_closed ? null : state.time,
    eyesClosed: state.eyes_closed,
    notices: state.notices,
    bloodtextAvailable: state.bloodtextSeen,
    actionsLeft: exit.kind === 'choices' && countsActions(level, state) ? state.actions_left : null,
    marked: markedAt(level, state),
  };
}

function markedAt(level: Level, state: GameState): string[] | null {
  const node = nodeById(level, state.node);
  if (node.type !== 'scene' || !node.highlight || state.phase !== 'scene' || !state.highlightDone) return null;
  return state.highlights.flatMap((id) => level.keywords.find((k) => k.id === id)?.text ?? []);
}

/** Hub có `hub_done` dựa trên `actions_left_lte` (G2) thì người chơi cần biết còn mấy lượt. */
function countsActions(level: Level, state: GameState): boolean {
  const node = nodeById(level, state.node);
  return node.type === 'scene' && !!node.hub && !!node.hub_done && 'actions_left_lte' in node.hub_done;
}

/** Nội dung nút "Huyết tự": bản gốc hoặc bản méo, gạch chân cụm đã đánh dấu. */
export function bloodtextPanel(level: Level, state: GameState): BloodtextView[] {
  return state.bloodtextSeen ? viewAll(level, state) : [];
}

/** Danh sách cụm được phép đánh dấu, nhóm theo dòng (luôn hiện bản gốc). */
export function highlightOptions(level: Level) {
  return level.bloodtext.map((b) => ({
    line: b.id,
    text: b.text,
    ink: b.ink,
    keywords: level.keywords.filter((k) => k.line === b.id).map((k) => ({ id: k.id, text: k.text })),
  }));
}

export type EndingView = {
  result: 'death' | 'survive';
  cause: string;
  reveal: string;
  solution: BloodtextView[];
  /** Id các dòng thật, hiện làm nhãn để phần hé lộ nhắc "L2", "L4" đọc được (G47). Dòng giả không có nhãn. */
  labels: string[];
  /** Dòng bị vi phạm ở kết cục chết (G16); rỗng ở kết cục sống. */
  violates: string[];
  /** Kết cục chết: những dòng người chơi đang đọc thấy khác bản gốc (bị bóp méo), như lúc chết (G47). */
  misread: BloodtextView[];
  /** G50: lần đầu chết ở kết cục này thì chưa hiện câu hé lộ, chỉ tô sinh lộ. */
  revealHidden: boolean;
  /** G51: đoạn kết của game, chỉ có ở kết cục trọn vẹn của màn cuối. */
  epilogue: string[];
  keywords: { id: string; text: string; correct: boolean }[];
  dossiers: string[];
  /**
   * G41: kết cục của màn cuối. `complete` = hết game; `open` = kết thúc mở, chơi lại màn
   * cuối để tìm kết cục trọn vẹn; `none` = không phải màn cuối hoặc là kết cục chết.
   */
  finale: 'none' | 'complete' | 'open';
};

/** Màn hình chết / kết quả (đặc tả mục 4.5, 4.7; G17, G18). */
export function endingView(level: Level, state: GameState): EndingView | null {
  if (state.phase !== 'ending') return null;
  const node = nodeById(level, state.node) as EndingNode;
  return {
    result: node.result,
    cause: node.cause,
    reveal: fill(state, node.reveal),
    solution: viewSolution(level, node.solution ?? level.solution),
    labels: level.bloodtext.filter((b) => !b.fake).map((b) => b.id),
    revealHidden: node.result === 'death' && (state.campaign.endings[node.id] ?? 0) < 2,
    epilogue: level.final && node.result === 'survive' && !node.open ? (level.epilogue ?? []) : [],
    violates: node.result === 'death' ? (node.violates ?? []) : [],
    misread:
      node.result === 'death'
        ? level.bloodtext
            .filter((b) => {
              const seen = displayLine(level, state, b.id);
              return seen.text !== b.text || seen.ink !== b.ink;
            })
            .map((b) => viewLine(level, state, b.id))
        : [],
    keywords: state.highlights.flatMap((id) => {
      const k = level.keywords.find((x) => x.id === id);
      return k ? [{ id: k.id, text: k.text, correct: k.correct }] : [];
    }),
    dossiers:
      node.result === 'survive'
        ? (node.unlock ?? [])
            .filter((u) => check(u.if, level, state))
            .map((u) => level.dossiers.find((d) => d.id === u.dossier)?.title ?? u.dossier)
        : [],
    finale: level.final && node.result === 'survive' ? (node.open ? 'open' : 'complete') : 'none',
  };
}
