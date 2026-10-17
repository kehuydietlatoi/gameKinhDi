import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { describe, expect, test } from 'vitest';
import { parseAssets } from '../src/content/loader.ts';
import type { Assets } from '../src/content/types.ts';
import { validateAssets } from '../src/content/validate/assets.ts';
import { validateLevel } from '../src/content/validate/level.ts';
import { checkBackground } from '../scripts/lib/png.ts';
import { runValidate } from '../scripts/lib/run.ts';
import { fixture, levelAfter, loadFixtureLevel, type RawLevel } from './helpers/fixtures.ts';

const assetsResult = parseAssets(fixture('assets.yaml'), 'assets.yaml');
if (!assetsResult.ok) throw new Error(assetsResult.errors.join('\n'));
const assets: Assets = assetsResult.value;

const errorsOf = (mutate: (raw: RawLevel) => void) => validateLevel(levelAfter(mutate), assets);

describe('validateLevel', () => {
  test('fixture hợp lệ không có lỗi', () => {
    expect(validateLevel(loadFixtureLevel(), assets)).toEqual([]);
  });

  test('goto tới node không tồn tại', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n06').choices[0].goto = 'm9_d9';
    });
    expect(errors).toContain('m9: m9_n06.choices[0].goto — node `m9_d9` không tồn tại');
  });

  test('node không tới được từ start', () => {
    const errors = errorsOf((raw) => {
      raw.nodes.push({ id: 'm9_n90', type: 'scene', next: 'm9_e1' });
    });
    expect(errors).toContain('m9: m9_n90 — không tới được từ `start`');
  });

  test('vòng lặp không thoát ra kết cục', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n03b').next = 'm9_n03b';
    });
    expect(errors).toContain('m9: m9_n03b — từ node này không đi tới được kết cục nào');
  });

  test('id node không mang tiền tố của màn', () => {
    const errors = errorsOf((raw) => {
      raw.level = 'm8';
    });
    expect(errors).toContain('m8: m9_n01 — id node phải bắt đầu bằng m8_');
  });

  test.each([
    ['NPC', (raw: RawLevel) => (raw.node('m9_n01').lines[4].who = 'npc_x'), 'm9_n01.lines[4].who — NPC `npc_x` chưa được khai báo'],
    ['manh mối trong if', (raw: RawLevel) => (raw.node('m9_n05').lines[2].if = { clue: 'c7' }), 'm9_n05.lines[2].if — manh mối `c7` chưa được khai báo'],
    ['manh mối trong hiệu ứng', (raw: RawLevel) => raw.node('m9_n03').effects.push({ clue: 'c8' }), 'm9_n03.effects[3] — manh mối `c8` chưa được khai báo'],
    ['từ khoá', (raw: RawLevel) => (raw.node('m9_n05').lines[1].if.not_highlighted = 'k9'), 'm9_n05.lines[1].if — từ khoá `k9` chưa được khai báo'],
    ['dòng Huyết tự', (raw: RawLevel) => (raw.node('m9_n01').lines[6].lines = ['L1', 'L7']), 'm9_n01.lines[6].lines[1] — dòng Huyết tự `L7` chưa được khai báo'],
    ['hồ sơ', (raw: RawLevel) => (raw.node('m9_e1').unlock[0].dossier = 'hs_khac'), 'm9_e1.unlock[0] — hồ sơ `hs_khac` chưa được khai báo'],
    ['solution', (raw: RawLevel) => (raw.solution = ['k7']), 'solution[0] — từ khoá `k7` chưa được khai báo'],
  ])('tham chiếu chưa khai báo: %s', (_name, mutate, expected) => {
    expect(errorsOf(mutate)).toContain(`m9: ${expected}`);
  });

  test('từ khoá không có nguyên văn trong dòng', () => {
    const errors = errorsOf((raw) => {
      raw.keywords[0].text = 'phải tuân thủ';
    });
    expect(errors).toContain('m9: keywords[0] (k1) — "phải tuân thủ" không có nguyên văn trong dòng L1');
  });

  test('bản méo dùng từ khoá của dòng khác', () => {
    const errors = errorsOf((raw) => {
      raw.distortions[0].unless_highlighted = 'k2';
    });
    expect(errors).toContain('m9: distortions[0] — từ khoá k2 thuộc dòng L2, không phải L1');
  });

  test('dòng violable không có kết cục chết violates nó', () => {
    const errors = errorsOf((raw) => {
      const d1 = raw.node('m9_d1');
      delete d1.violates;
      d1.consequence_of = ['L1'];
    });
    expect(errors).toContain(
      'm9: bloodtext L1 — dòng có thể bị vi phạm nhưng không có kết cục chết nào `violates` nó',
    );
  });

  test('biểu thức chèn biến không hợp lệ', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n02').lines[1].text = 'Có {follow + 2} người, {following * 2}.';
    });
    expect(errors).toContain('m9: m9_n02.lines[1].text — biểu thức không hợp lệ: {follow + 2} (G7)');
    expect(errors).toContain('m9: m9_n02.lines[1].text — biểu thức không hợp lệ: {following * 2} (G7)');
  });

  test('cờ trong điều kiện không được bật ở đâu', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n02').choices[2].if = { flag: 'co_d' };
    });
    expect(errors).toContain('m9: m9_n02.choices[2].if — cờ `co_d` không được hiệu ứng nào bật');
  });

  test('chỗ trốn trong điều kiện không được đặt ở đâu', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n06').lines[0].if = { spot: 'gam' };
    });
    expect(errors).toContain('m9: m9_n06.lines[0].if — chỗ trốn `gam` không được hiệu ứng nào đặt');
  });

  test('visited_count_gte ngoài hub', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n05').lines[2].if = { visited_count_gte: 1 };
    });
    expect(errors).toContain('m9: m9_n05.lines[2].if — `visited_count_gte` chỉ dùng trong node hub (G1)');
  });

  test('found dùng NPC nhóm', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n04').effects.push({ found: 'tat_ca' });
    });
    expect(errors).toContain('m9: m9_n04.effects[2] — NPC nhóm `tat_ca` không dùng được với found');
  });

  test('ảnh nền không có trong assets.yaml', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n01').scene.bg = 'nen_x';
    });
    expect(errors).toContain('m9: m9_n01.scene.bg — ảnh `nen_x` không có trong assets.yaml');
  });

  test('ảnh có clue bị kế thừa sang node không thêm clue (G22)', () => {
    const errors = errorsOf((raw) => {
      delete raw.node('m9_n02').scene;
    });
    expect(errors).toContain(
      'm9: m9_n02.scene — ảnh `nen_b` chứa manh mối c1 nhưng node không thêm c1 (G22)',
    );
  });

  test('ending được dùng ảnh có clue', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_d2').scene = { bg: 'nen_b' };
    });
    expect(errors).toEqual([]);
  });

  test('hub có hai lựa chọn cùng goto', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n02').choices[1].goto = 'm9_n03';
    });
    expect(errors).toContain('m9: m9_n02.choices — lựa chọn của hub phải có `goto` khác nhau (G1)');
  });

  test('node highlight không có bloodtext', () => {
    const errors = errorsOf((raw) => {
      raw.node('m9_n01').lines.splice(6, 1);
    });
    expect(errors).toContain('m9: m9_n01.highlight — node mở giao diện đánh dấu phải có dòng bloodtext');
  });
});

describe('validateAssets', () => {
  test('file sai tên và clue không ai khai báo', () => {
    const bad = parseAssets(
      'assets:\n  - {id: nen_c, file: bg/khac.png, alt: "C.", clue: c9, level: m9}\n',
      'assets.yaml',
    );
    if (!bad.ok) throw new Error(bad.errors.join('\n'));
    const { errors, warnings } = validateAssets(bad.value, [loadFixtureLevel()]);
    expect(errors).toEqual([
      'assets: assets[0] (nen_c).file — phải là bg/nen_c.png',
      'assets: assets[0] (nen_c).clue — màn m9 không khai báo manh mối c9',
    ]);
    expect(warnings).toEqual(['assets: assets[0] (nen_c) — chưa node nào dùng ảnh này']);
  });
});

describe('checkBackground', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sinhlo-png-'));
  const write = (name: string, w: number, h: number, paint: (x: number, y: number) => number[]) => {
    const png = new PNG({ width: w, height: h });
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const [r, g, b, a] = paint(x, y);
        const i = (y * w + x) * 4;
        png.data[i] = r!;
        png.data[i + 1] = g!;
        png.data[i + 2] = b!;
        png.data[i + 3] = a!;
      }
    }
    const path = join(dir, name);
    writeFileSync(path, PNG.sync.write(png));
    return path;
  };
  const deepBlack = [0x0b, 0x0b, 0x0d, 255];

  test('ảnh đúng quy cách', () => {
    const path = write('ok.png', 320, 180, (x) => (x < 160 ? deepBlack : [0x8a, 0x0b, 0x0b, 255]));
    expect(checkBackground(path, 'ok')).toEqual([]);
  });

  test('sai kích thước', () => {
    const path = write('size.png', 160, 90, () => deepBlack);
    expect(checkBackground(path, 'size')).toEqual(['size — kích thước 160×90, phải là 320×180']);
  });

  test('màu ngoài bảng màu (khử răng cưa)', () => {
    const path = write('color.png', 320, 180, (x, y) => (x === 0 && y < 3 ? [0x8b, 0x0b, 0x0b, 255] : deepBlack));
    expect(checkBackground(path, 'color')).toEqual(['color — 1 màu ngoài bảng màu (#8b0b0b×3)']);
  });

  test('điểm ảnh trong suốt', () => {
    const path = write('alpha.png', 320, 180, (x) => (x === 5 ? [0x0b, 0x0b, 0x0d, 128] : deepBlack));
    expect(checkBackground(path, 'alpha')).toEqual(['alpha — 180 điểm ảnh không đục hoàn toàn']);
  });

  test('thiếu file', () => {
    expect(checkBackground(join(dir, 'khong-co.png'), 'x')[0]).toMatch(/^x — không tìm thấy file/);
  });
});

test('content/ thật qua được validate', () => {
  const root = join(import.meta.dirname, '..');
  const report = runValidate(join(root, 'content'), join(root, 'public'));
  expect(report.errors).toEqual([]);
});
