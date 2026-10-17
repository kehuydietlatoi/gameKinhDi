// Màn 4 – Trạm y tế: đối chiếu kịch bản và mục "Kiểm tra nhanh" của docs/man-4-tram-y-te.md.
import { describe, expect, test } from 'vitest';
import { bloodtextPanel, endingView, view, type GameState } from '../src/engine/index.ts';
import { checkLevelContent } from './helpers/content-check.ts';
import { loadLevel, play, run, type PlayOptions } from './helpers/play.ts';

checkLevelContent('m4', 'man-4-tram-y-te.md');

const level = loadLevel('m4');
const reached = new Set<string>();
function playM4(choices: string[], opts?: PlayOptions): GameState {
  const s = play('m4', choices, opts);
  if (s.phase === 'ending') reached.add(s.node);
  return s;
}
const panelText = (s: GameState, id: string) =>
  bloodtextPanel(level, s).find((l) => l.id === id)!.segments.map((x) => x.text).join('');
const bloodIn = (s: GameState) =>
  view(level, s).lines.flatMap((l) => (l.ch === 'bloodtext' ? l.lines.map((b) => b.segments.map((x) => x.text).join('')) : []));

const BOARD = 'Đọc bảng phân công trực đêm';
const CUONG = 'Hỏi ông Cường giường bên';
const CARD = 'Đọc thẻ bệnh nhân treo ở cuối giường bên';
const CHART = 'Đọc bệnh án ở cuối giường mình';
const NURSE = 'Hỏi y tá Hồng';
const QUIET = [BOARD, CHART, NURSE];
const LOSS = [CUONG, CARD, BOARD]; // mất 2 Tỉnh táo (c2, c3)
const WAIT = '"Tôi đợi bác sĩ."';
const TO_N20 = [WAIT, 'Uống thuốc'];

describe('đường sống', () => {
  test.each([
    ['qua M4-31', [...QUIET, ...TO_N20, 'Nằm yên', 'Hỏi: "Anh tên gì?"', 'Rút tay lại, nằm yên']],
    ['qua M4-32 trực tiếp', [...QUIET, ...TO_N20, 'Nằm yên', 'Rút tay lại, nằm yên']],
    ['qua M4-20b', [...QUIET, ...TO_N20, 'Gọi to: "Bác sĩ ơi!"', 'Rút tay lại, nằm yên']],
    ['hỏi thuốc có độc không rồi uống', [...QUIET, WAIT, 'Hỏi: "Thuốc này có độc không?"', 'Uống thuốc', 'Nằm yên', 'Rút tay lại, nằm yên']],
  ])('%s', (_name, choices) => {
    const t = run(level, choices);
    reached.add(t.state.node);
    expect(t.state).toMatchObject({ node: 'm4_e1', time: '05:30', scene: { bg: 'phong_luu_benh', light: 'dawn' } });
    expect(endingView(level, t.state)!.cause).toBe('Sống sót');
  });

  test('M4-20b: chú thích "từ cuối hành lang" (G35)', () => {
    const t = run(level, [...QUIET, ...TO_N20, 'Gọi to: "Bác sĩ ơi!"']);
    expect(t.views.find((v) => v.node === 'm4_n20b')!.lines[0]).toEqual({
      ch: 'npc',
      name: 'Bác sĩ Thanh',
      tone: 'normal',
      text: 'Không có cháy. Nằm yên.',
      note: 'từ cuối hành lang',
    });
  });

  test('M4-31: chỉ có lời người mặc áo blouse, không có lời dẫn suy luận hộ', () => {
    for (const choices of [QUIET, [CHART, NURSE, CUONG]]) {
      const lines = run(level, [...choices, ...TO_N20, 'Nằm yên', 'Hỏi: "Anh tên gì?"']).views.find((v) => v.node === 'm4_n31')!
        .lines;
      expect(lines).toEqual([{ ch: 'npc', name: 'Người mặc áo blouse', tone: 'normal', text: 'Bác sĩ Thanh. Tôi trực đêm nay.' }]);
    }
  });

  test('đèn tắt từ M4-20, sáng lại ở M4-40', () => {
    const t = run(level, [...QUIET, ...TO_N20, 'Nằm yên', 'Rút tay lại, nằm yên']);
    for (const id of ['m4_n20', 'm4_n21', 'm4_n30', 'm4_n32']) {
      expect(t.views.find((v) => v.node === id)!.scene.light, id).toBe('dark');
    }
  });
});

describe('dòng có điều kiện giau_thuoc ở M4-12', () => {
  const PINK = 'Viên hồng dưới gối là ai đưa? Trạm này không có thuốc màu hồng.';
  test('giấu thuốc thì bác sĩ hỏi về viên hồng', () => {
    const s = play('m4', [...QUIET, 'Cầm lấy viên thuốc, giấu xuống gối']);
    expect(s).toMatchObject({ node: 'm4_n12', flags: ['giau_thuoc'], time: '21:00' });
    expect(view(level, s).lines).toContainEqual({ ch: 'npc', name: 'Bác sĩ Thanh', tone: 'normal', text: PINK });
  });
  test('không giấu thì không có dòng đó', () => {
    const s = play('m4', [...QUIET, WAIT]);
    expect(view(level, s).lines.some((l) => 'text' in l && l.text === PINK)).toBe(false);
  });
});

describe('kết cục chết', () => {
  test('D1 · Ngủ quên giờ thuốc', () => {
    const s = playM4([...QUIET, 'Uống viên thuốc của y tá']);
    expect(s.node).toBe('m4_d1');
  });

  test.each([
    ['M4-12', [...QUIET, WAIT, 'Đợi bác sĩ quay đi, đổ thuốc xuống gầm giường']],
    ['M4-12b', [...QUIET, WAIT, 'Hỏi: "Thuốc này có độc không?"', 'Đợi bác sĩ quay đi, đổ thuốc xuống gầm giường']],
  ])('D2 · Đổ thuốc từ %s', (_from, choices) => {
    expect(playM4(choices).node).toBe('m4_d2');
  });

  test.each([
    ['M4-20', [...QUIET, ...TO_N20, 'Rời giường, chạy theo']],
    ['M4-30', [...QUIET, ...TO_N20, 'Nằm yên', 'Dậy đi theo']],
    ['M4-31', [...QUIET, ...TO_N20, 'Nằm yên', 'Hỏi: "Anh tên gì?"', 'Dậy đi theo']],
  ])('D3 · Rời giường từ %s', (_from, choices) => {
    const s = playM4(choices);
    expect(s.node).toBe('m4_d3');
    expect(endingView(level, s)!.solution[2]!.segments).toEqual([
      { text: 'Sau khi đèn tắt, bệnh nhân ' },
      { text: 'không được rời giường', mark: 'solution' },
      { text: '.' },
    ]);
  });
});

describe('Tỉnh táo và bản méo', () => {
  test('mức mất tối đa là 4 (c2, c3, M4-10, M4-13), còn 1', () => {
    const s = playM4([...LOSS, ...TO_N20, 'Nằm yên', 'Rút tay lại, nằm yên']);
    expect(s).toMatchObject({ node: 'm4_e1', sanity: 1 });
  });

  test('bản méo L2 ở M4-10 khi đã chọn c2 và c3, chưa đánh dấu k3', () => {
    const s = play('m4', LOSS);
    expect(s).toMatchObject({ node: 'm4_n10', sanity: 2 });
    expect(bloodIn(s)).toEqual(['Y tá luôn nói thật.']);
    expect(panelText(s, 'L2')).toBe('Y tá luôn nói thật.');
    const marked = play('m4', LOSS, { highlights: ['k3'] });
    expect(bloodIn(marked)).toEqual([]);
    expect(panelText(marked, 'L2')).toBe('Bác sĩ luôn nói thật.');
  });

  test('chỉ một trong c2, c3 thì M4-10 chưa méo', () => {
    const s = play('m4', [CUONG, BOARD, CHART]);
    expect(s).toMatchObject({ node: 'm4_n10', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
  });

  test('bản méo L3 ở M4-20 khi đã chọn c2 và c3, chưa đánh dấu k4', () => {
    const s = play('m4', [...LOSS, ...TO_N20]);
    expect(s).toMatchObject({ node: 'm4_n20', sanity: 1 });
    expect(bloodIn(s)).toEqual(['Sau khi đèn tắt, bệnh nhân không được ở lại giường.']);
    const marked = play('m4', [...LOSS, ...TO_N20], { highlights: ['k4'] });
    expect(bloodIn(marked)).toEqual([]);
    expect(panelText(marked, 'L3')).toBe('Sau khi đèn tắt, bệnh nhân không được rời giường.');
  });

  test('không chọn c2, c3 thì tới M4-20 còn 3, chưa méo', () => {
    const s = play('m4', [...QUIET, ...TO_N20]);
    expect(s).toMatchObject({ node: 'm4_n20', sanity: 3 });
    expect(bloodIn(s)).toEqual([]);
  });
});

test('mọi kết cục của màn 4 đều có test đi tới', () => {
  const endings = level.nodes.filter((n) => n.type === 'ending').map((n) => n.id).sort();
  expect([...reached].sort()).toEqual(endings);
});
