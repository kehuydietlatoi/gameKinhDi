// Schema zod cho file màn và assets.yaml.
// Nguồn: docs/dac-ta-kich-ban.md mục 3, 5 và docs/spec-changes.md (G1–G44).
// Mọi object đều strict: khoá lạ là lỗi, không bị bỏ qua (AGENTS.md mục 5.5).
// Kiểm tra tham chiếu chéo (goto, id NPC, …) nằm ở validator, không nằm ở đây.
import { z } from 'zod';

// ---------- Id ----------

export const LevelId = z.string().regex(/^m\d+$/, 'id màn phải có dạng m<số>');
export const SceneNodeId = z.string().regex(/^m\d+_n\d+[a-z]?$/, 'id node phải có dạng m<màn>_n<số>');
export const SurviveId = z.string().regex(/^m\d+_e\d+$/, 'id kết cục sống phải có dạng m<màn>_e<số>');
export const DeathId = z.string().regex(/^m\d+_d\d+$/, 'id kết cục chết phải có dạng m<màn>_d<số>');
export const NodeId = z.union([SceneNodeId, SurviveId, DeathId], {
  error: 'id node phải có dạng m<màn>_n<số>, m<màn>_e<số> hoặc m<màn>_d<số>',
});
/** Dòng trên tường: L<số> là Huyết tự, F<số> là dòng giả (G36). */
export const LineId = z.string().regex(/^[LF]\d+$/, 'id dòng phải có dạng L<số> (Huyết tự) hoặc F<số> (dòng giả)');
export const KeywordId = z.string().regex(/^k\d+$/, 'id từ khoá phải có dạng k<số>');
export const ClueId = z.string().regex(/^c\d+$/, 'id manh mối phải có dạng c<số>');
/** Manh mối của một màn cụ thể, dùng trong assets.yaml: m3:c1 (G43). */
export const LevelClueId = z.string().regex(/^m\d+:c\d+$/, 'clue của ảnh phải có dạng m<màn>:c<số>, ví dụ m3:c1');
const SnakeId = z.string().regex(/^[a-z][a-z0-9_]*$/, 'id phải viết thường, nối bằng dấu _');
export const NpcId = SnakeId;
export const AssetId = SnakeId;
export const DossierId = SnakeId;
export const Time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'giờ phải có dạng HH:MM');

export const Role = z.enum(['none', 'seeker', 'hider']);
export const Light = z.enum(['normal', 'flicker', 'dark', 'dawn', 'candle']); // candle: G39
export const Sense = z.enum(['nhìn', 'ngửi', 'chạm']);
export const Tone = z.enum(['normal', 'whisper', 'shout']);
/** Kiểu mực (G36): do = Huyết tự, nau = mực nâu đen (dòng giả), kho = máu khô (Huyết tự cũ). */
export const Ink = z.enum(['do', 'nau', 'kho']);

// ---------- Điều kiện (if) ----------
// Mỗi khoá là một điều kiện; nhiều khoá trong một object nghĩa là AND (G10).
// Bộ đánh giá nằm ở src/engine/conditions.ts, khai báo theo ConditionKey nên
// thêm khoá ở đây mà quên engine sẽ lỗi typecheck.

export const conditionShape = {
  clue: ClueId,
  flag: z.string(),
  not_flag: z.string(),
  role: Role,
  sanity_lte: z.int(),
  visited_count_gte: z.int(), // G1: chỉ đếm goto của hub hiện tại
  not_visited: NodeId,
  not_highlighted: KeywordId,
  spot: z.string(), // đặc tả mục 5
  has_spot: z.boolean(), // G12
  actions_left_lte: z.int(), // G2
  following_lte: z.int(), // G2
  following_gte: z.int(), // G2
  has_dossier: DossierId, // G27: hồ sơ đã mở khoá, kể cả ở màn trước
};

export const Condition = z
  .strictObject(conditionShape)
  .partial()
  .refine((c) => Object.keys(c).length > 0, { error: '`if` không được rỗng' });

// ---------- Hiệu ứng (effects) ----------
// Mỗi phần tử có đúng một khoá hiệu ứng, áp theo thứ tự trong danh sách (G13).
// Phần tử có thể kèm `if` (G40): xét sau khi các hiệu ứng không điều kiện đã áp.
// Bộ áp dụng nằm ở src/engine/effects.ts, khai báo theo EffectKey.

export const effectShape = {
  sanity: z.int(), // cộng/trừ
  flag: z.string(),
  clue: ClueId,
  role: Role,
  spot: z.string(),
  found: NpcId, // G20
  actions_left: z.int(), // cộng/trừ (G6)
  time: Time, // đặt giá trị tuyệt đối
  time_add: z.int(), // số phút (G6)
  visit: NodeId,
  eyes_closed: z.boolean(),
};

export const Effect = z
  .strictObject({ ...effectShape, if: Condition })
  .partial()
  .refine((e) => Object.keys(e).filter((k) => k !== 'if').length === 1, {
    error: 'mỗi hiệu ứng phải có đúng một khoá, ví dụ {sanity: -1} (có thể kèm `if`)',
  });

// ---------- Cảnh (đặc tả mục 5) ----------

const SceneFields = z
  .strictObject({ bg: AssetId, light: Light })
  .partial()
  .refine((s) => s.bg !== undefined || s.light !== undefined, {
    error: '`scene` phải có `bg` hoặc `light`',
  });

const SceneCase = z
  .strictObject({ if: Condition, bg: AssetId, light: Light })
  .partial()
  .refine((s) => s.bg !== undefined || s.light !== undefined, {
    error: 'mỗi mục của `scene` phải có `bg` hoặc `light`',
  });

// Dạng danh sách: lấy mục đầu tiên có `if` đúng (hoặc không có `if`).
export const Scene = z.union([SceneFields, z.array(SceneCase).min(1)]);

// ---------- Dòng chữ (đặc tả mục 1) ----------

const lineBase = { if: Condition.optional() };

export const Line = z.discriminatedUnion('ch', [
  z.strictObject({ ...lineBase, ch: z.literal('narration'), text: z.string().min(1) }),
  z.strictObject({ ...lineBase, ch: z.literal('env'), sense: Sense, text: z.string().min(1) }),
  z.strictObject({
    ...lineBase,
    ch: z.literal('sound'),
    src: z.string().min(1),
    vol: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    text: z.string().min(1),
  }),
  z.strictObject({
    ...lineBase,
    ch: z.literal('npc'),
    who: NpcId,
    tone: Tone.default('normal'),
    text: z.string().min(1),
    note: z.string().min(1).optional(), // G8, G35
  }),
  z.strictObject({
    ...lineBase,
    ch: z.literal('bloodtext'),
    lines: z.array(LineId).min(1), // G9: id dòng, engine tự áp bản méo
    style: z.literal('glow').optional(), // G9
  }),
  z.strictObject({ ...lineBase, ch: z.literal('system'), text: z.string().min(1) }),
]);

// ---------- Node ----------

export const Choice = z.strictObject({
  text: z.string().min(1),
  goto: NodeId,
  if: Condition.optional(),
  effects: z.array(Effect).optional(),
});

export const SceneNode = z
  .strictObject({
    id: SceneNodeId,
    type: z.literal('scene'),
    scene: Scene.optional(),
    lines: z.array(Line).default([]),
    effects: z.array(Effect).optional(),
    choices: z.array(Choice).min(1).optional(),
    next: NodeId.optional(),
    hub: z.literal(true).optional(),
    hub_done: Condition.optional(), // G4
    hub_exit: NodeId.optional(), // G4
    highlight: z.literal(true).optional(), // G14
  })
  .superRefine((n, ctx) => {
    if (n.hub) {
      if (!n.hub_done) ctx.addIssue({ code: 'custom', path: ['hub_done'], message: 'hub phải có `hub_done`' });
      if (!n.hub_exit) ctx.addIssue({ code: 'custom', path: ['hub_exit'], message: 'hub phải có `hub_exit`' });
      if (!n.choices) ctx.addIssue({ code: 'custom', path: ['choices'], message: 'hub phải có `choices`' });
      if (n.next) ctx.addIssue({ code: 'custom', path: ['next'], message: 'hub không dùng `next`' });
    } else {
      if (n.hub_done) ctx.addIssue({ code: 'custom', path: ['hub_done'], message: '`hub_done` chỉ dùng cho node `hub: true`' });
      if (n.hub_exit) ctx.addIssue({ code: 'custom', path: ['hub_exit'], message: '`hub_exit` chỉ dùng cho node `hub: true`' });
      if (!n.choices && !n.next) {
        ctx.addIssue({ code: 'custom', path: [], message: 'node scene phải có `choices` hoặc `next`' });
      }
    }
  });

export const Unlock = z.strictObject({ dossier: DossierId, if: Condition.optional() });

export const EndingNode = z
  .strictObject({
    id: z.union([SurviveId, DeathId]),
    type: z.literal('ending'),
    result: z.enum(['death', 'survive']),
    cause: z.string().min(1),
    reveal: z.string().min(1),
    scene: Scene.optional(),
    lines: z.array(Line).default([]),
    violates: z.array(LineId).min(1).optional(), // G16
    consequence_of: z.array(LineId).min(1).optional(), // G16
    solution: z.array(z.union([KeywordId, LineId])).min(1).optional(), // G17
    unlock: z.array(Unlock).optional(), // G18
    open: z.literal(true).optional(), // G41: kết thúc mở của màn cuối
  })
  .superRefine((n, ctx) => {
    const isDeathId = DeathId.safeParse(n.id).success;
    if (n.result === 'death' && !isDeathId) {
      ctx.addIssue({ code: 'custom', path: ['id'], message: 'kết cục chết phải có id dạng m<màn>_d<số>' });
    }
    if (n.result === 'survive' && isDeathId) {
      ctx.addIssue({ code: 'custom', path: ['id'], message: 'kết cục sống phải có id dạng m<màn>_e<số>' });
    }
    // G29: kết cục sống được có consequence_of (có người chết thay), không có violates.
    if (n.result === 'survive' && n.violates) {
      ctx.addIssue({ code: 'custom', path: ['violates'], message: 'kết cục sống không có `violates`' });
    }
    if (n.open && n.result !== 'survive') {
      ctx.addIssue({ code: 'custom', path: ['open'], message: '`open` chỉ dùng cho kết cục sống (G41)' });
    }
  });

export const Node = z.discriminatedUnion('type', [SceneNode, EndingNode]);

// ---------- Màn ----------

export const BloodtextLine = z
  .strictObject({
    id: LineId,
    text: z.string().min(1),
    violable: z.boolean().optional(), // G16; mặc định true với Huyết tự
    fake: z.literal(true).optional(), // G36: dòng giả, không phải Huyết tự
    ink: Ink.default('do'), // G36
  })
  .superRefine((b, ctx) => {
    const fakeId = b.id.startsWith('F');
    if (fakeId && !b.fake) {
      ctx.addIssue({ code: 'custom', path: ['fake'], message: 'dòng F<số> phải có `fake: true` (G36)' });
    }
    if (!fakeId && b.fake) {
      ctx.addIssue({ code: 'custom', path: ['id'], message: 'dòng giả phải có id dạng F<số> (G36)' });
    }
    if (b.fake && b.violable !== undefined) {
      ctx.addIssue({ code: 'custom', path: ['violable'], message: 'dòng giả không có `violable` (G36)' });
    }
  })
  .transform((b) => ({ ...b, fake: b.fake === true, violable: b.violable ?? !b.fake }));

export const Keyword = z.strictObject({
  id: KeywordId,
  line: LineId,
  text: z.string().min(1),
  correct: z.boolean(),
});

/** Bản méo đổi chữ (bảo vệ được bằng từ khoá) hoặc đổi mực (không bảo vệ được, G37). */
export const Distortion = z.union([
  z.strictObject({ line: LineId, unless_highlighted: KeywordId, text: z.string().min(1) }),
  z.strictObject({ line: LineId, ink: Ink }),
]);

export const Npc = z.strictObject({
  id: NpcId,
  name: z.string().min(1),
  group: z.literal(true).optional(), // G8
});

export const Dossier = z.strictObject({ id: DossierId, title: z.string().min(1) });

export const Level = z.strictObject({
  level: LevelId,
  title: z.string().min(1),
  start: SceneNodeId,
  final: z.literal(true).optional(), // G41: màn cuối của game
  epilogue: z.array(z.string().min(1)).min(1).optional(), // G51: đoạn kết, chỉ ở màn final
  on_sanity_zero: NodeId.optional(), // G19, G26: node bất kỳ
  init: z.strictObject({
    sanity: z.int().min(0).max(5),
    actions_left: z.int().min(0),
    time: Time,
  }),
  bloodtext: z.array(BloodtextLine).min(1),
  keywords: z.array(Keyword).default([]),
  distortions: z.array(Distortion).default([]),
  solution: z.array(z.union([KeywordId, LineId])).min(1), // G17, G38
  npcs: z.array(Npc).default([]),
  clues: z.array(ClueId).default([]), // G15
  dossiers: z.array(Dossier).default([]), // G18
  nodes: z.array(Node).min(1),
});

// ---------- assets.yaml ----------

export const Asset = z
  .strictObject({
    id: AssetId,
    file: z.string().regex(/^bg\/[a-z0-9_]+\.png$/, 'file phải có dạng bg/<id>.png').optional(),
    alt: z.string().min(1),
    clue: LevelClueId.optional(), // G43: m<màn>:c<số>
    placeholder: z.literal(true).optional(),
  })
  .superRefine((a, ctx) => {
    if (!a.placeholder && !a.file) {
      ctx.addIssue({ code: 'custom', path: ['file'], message: 'ảnh không phải placeholder phải có `file` (G21)' });
    }
  });

export const Assets = z.strictObject({ assets: z.array(Asset) });

/** "m3:c1" → {level: "m3", clue: "c1"}. */
export function splitLevelClue(id: string): { level: string; clue: string } {
  const [level, clue] = id.split(':') as [string, string];
  return { level, clue };
}
