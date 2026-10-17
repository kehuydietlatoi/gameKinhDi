// Kiểu dữ liệu nội dung, suy ra từ schema. Engine và UI chỉ import kiểu từ đây.
import type { z } from 'zod';
import type * as S from './schema.ts';

export type Level = z.infer<typeof S.Level>;
export type Node = z.infer<typeof S.Node>;
export type SceneNode = z.infer<typeof S.SceneNode>;
export type EndingNode = z.infer<typeof S.EndingNode>;
export type Line = z.infer<typeof S.Line>;
export type Channel = Line['ch'];
export type Choice = z.infer<typeof S.Choice>;
export type Scene = z.infer<typeof S.Scene>;
export type Light = z.infer<typeof S.Light>;
export type Role = z.infer<typeof S.Role>;
export type Ink = z.infer<typeof S.Ink>;
export type BloodtextLine = z.infer<typeof S.BloodtextLine>;
export type Keyword = z.infer<typeof S.Keyword>;
export type Distortion = z.infer<typeof S.Distortion>;
export type Npc = z.infer<typeof S.Npc>;
export type Dossier = z.infer<typeof S.Dossier>;
export type Unlock = z.infer<typeof S.Unlock>;
export type Asset = z.infer<typeof S.Asset>;
export type Assets = z.infer<typeof S.Assets>;

export type Condition = z.infer<typeof S.Condition>;
export type ConditionKey = keyof typeof S.conditionShape;
/** Giá trị của từng khoá điều kiện, dùng cho bảng đánh giá trong engine. */
export type ConditionValues = { [K in ConditionKey]: z.infer<(typeof S.conditionShape)[K]> };

export type Effect = z.infer<typeof S.Effect>;
export type EffectKey = keyof typeof S.effectShape;
/** Giá trị của từng khoá hiệu ứng, dùng cho bảng áp dụng trong engine. */
export type EffectValues = { [K in EffectKey]: z.infer<(typeof S.effectShape)[K]> };
