import { describe, expect, test } from 'vitest';
import { parseAssets, parseLevel } from '../src/content/loader.ts';
import { errorsAfter, fixture } from './helpers/fixtures.ts';

describe('schema màn', () => {
  test('fixture hợp lệ parse được và điền giá trị mặc định', () => {
    const result = parseLevel(fixture('minimal.yaml'), 'm9.yaml');
    if (!result.ok) throw new Error(result.errors.join('\n'));
    const level = result.value;
    expect(level.bloodtext[0]?.violable).toBe(true);
    expect(level.bloodtext[1]?.violable).toBe(false);
    const first = level.nodes[0];
    expect(first?.type === 'scene' && first.lines[4]).toMatchObject({ ch: 'npc', tone: 'normal' });
  });

  test('khoá điều kiện lạ báo lỗi kèm đường dẫn và id node', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n02').choices[2].if = { flg: 'co_c' };
    });
    expect(errors).toContain('m9.yaml: nodes[1] (m9_n02).choices[2].if.flg — khoá không xác định');
  });

  test('if rỗng là lỗi', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n02').choices[2].if = {};
    });
    expect(errors.join('\n')).toMatch(/nodes\[1\] \(m9_n02\)\.choices\[2\]\.if — `if` không được rỗng/);
  });

  test('khoá hiệu ứng lạ báo lỗi', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n03').effects.push({ sanityy: -1 });
    });
    expect(errors).toContain('m9.yaml: nodes[2] (m9_n03).effects[3].sanityy — khoá không xác định');
  });

  test('hiệu ứng có hai khoá là lỗi', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n03').effects = [{ sanity: -1, clue: 'c1' }];
    });
    expect(errors.join('\n')).toMatch(/effects\[0\] — mỗi hiệu ứng phải có đúng một khoá/);
  });

  test('id node sai quy ước', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n03b').id = 'm9_node3';
    });
    expect(errors.join('\n')).toMatch(/nodes\[3\] \(m9_node3\)\.id — id node phải có dạng/);
  });

  test('kết cục chết dùng id kết cục sống là lỗi', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_d2').id = 'm9_e2';
    });
    expect(errors.join('\n')).toMatch(/kết cục chết phải có id dạng m<màn>_d<số>/);
  });

  test('G44: kết cục chết được phép không gắn với dòng luật nào', () => {
    const errors = errorsAfter((raw) => {
      delete raw.node('m9_d2').consequence_of;
    });
    expect(errors).toEqual([]);
  });

  test('hub thiếu hub_exit', () => {
    const errors = errorsAfter((raw) => {
      delete raw.node('m9_n02').hub_exit;
    });
    expect(errors.join('\n')).toMatch(/hub_exit — hub phải có `hub_exit`/);
  });

  test('node scene không có choices lẫn next', () => {
    const errors = errorsAfter((raw) => {
      delete raw.node('m9_n04').next;
    });
    expect(errors.join('\n')).toMatch(/node scene phải có `choices` hoặc `next`/);
  });

  test('kênh lạ và vol ngoài 1–3', () => {
    const errors = errorsAfter((raw) => {
      const lines = raw.node('m9_n01').lines;
      lines[0].ch = 'music';
      lines[3].vol = 4;
    });
    expect(errors.some((e) => e.includes('lines[0].ch'))).toBe(true);
    expect(errors.some((e) => e.includes('lines[3].vol'))).toBe(true);
  });

  test('tone tiếng Việt không còn hợp lệ', () => {
    const errors = errorsAfter((raw) => {
      raw.node('m9_n01').lines[5].tone = 'thì thầm';
    });
    expect(errors.some((e) => e.includes('lines[5].tone'))).toBe(true);
  });

  test('khoá lạ ở cấp màn', () => {
    const errors = errorsAfter((raw) => {
      raw.endings = [];
    });
    expect(errors).toContain('m9.yaml: endings — khoá không xác định');
  });

  test('lỗi cú pháp YAML có số dòng', () => {
    const result = parseLevel('level: m9\nnodes: [\n', 'hong.yaml');
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors[0]).toMatch(/^hong\.yaml:\d+:\d+ — /);
  });
});

describe('schema assets', () => {
  test('fixture hợp lệ', () => {
    expect(parseAssets(fixture('assets.yaml'), 'assets.yaml').ok).toBe(true);
  });

  test('ảnh không phải placeholder phải có file', () => {
    const result = parseAssets('assets:\n  - {id: x, alt: "X."}\n', 'assets.yaml');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.join('\n')).toMatch(
        /assets\[0\] \(x\)\.file — ảnh không phải placeholder phải có `file`/,
      );
    }
  });
});
