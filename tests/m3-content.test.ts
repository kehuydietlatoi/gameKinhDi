// Đối chiếu content/m3.yaml với docs/man-3-hinh-nhan-the-mang.md (AGENTS.md mục 6.1).
import { describe, expect, test } from 'vitest';
import { levelWarnings } from '../src/content/validate/level.ts';
import { checkLevelContent } from './helpers/content-check.ts';

const { level, nodes } = checkLevelContent('m3', 'man-3-hinh-nhan-the-mang.md');

describe('m3: kiểm tra riêng', () => {
  test('Huyết tự chỉ xuất hiện ở M3-02; bản méo chỉ hiện qua nút Huyết tự', () => {
    for (const n of level.nodes) {
      const blood = n.lines.filter((l) => l.ch === 'bloodtext');
      if (n.id === 'm3_n02') expect(blood).toEqual([{ ch: 'bloodtext', lines: ['L1', 'L2', 'L3', 'L4'] }]);
      else expect(blood, n.id).toEqual([]);
    }
  });

  test('hub tầng 4: mỗi lựa chọn tốn 1 lượt, cộng 1 giờ, xong quay về M3-10', () => {
    for (const c of nodes.scene('m3_n10').choices!) {
      expect(c.effects).toEqual([{ actions_left: -1 }, { time_add: 60 }]);
      expect(nodes.scene(c.goto).next).toBe('m3_n10');
    }
  });

  test('lựa chọn cùng chữ có điều kiện loại trừ nhau, validator không cảnh báo (G31)', () => {
    expect(levelWarnings(level)).toEqual([]);
    const texts = (id: string) => nodes.scene(id).choices!.map((c) => c.text);
    expect(texts('m3_n31').filter((t) => t === 'Đặt hình nhân ở ngưỡng cửa rồi buông tay')).toHaveLength(2);
    expect(texts('m3_n33')).toEqual(['Chờ đến sáng', 'Chờ đến sáng']);
    expect(texts('m3_n40')).toEqual(['Tiếp', 'Tiếp']);
  });

  test('NPC đã khuất dùng lại id của màn 1 (G30)', () => {
    expect(level.npcs.filter((n) => ['bac_tam', 'be_na'].includes(n.id)).map((n) => n.name)).toEqual(['Bác Tâm', 'Bé Na']);
  });

  test('E2 là kết cục sống có consequence_of (G29)', () => {
    expect(nodes.ending('m3_e2')).toMatchObject({ result: 'survive', consequence_of: ['L4'] });
    expect(nodes.ending('m3_e2').violates).toBeUndefined();
  });
});
