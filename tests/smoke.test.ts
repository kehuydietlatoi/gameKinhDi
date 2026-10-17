import { expect, test } from 'vitest';
import { strings } from '../src/ui/strings.ts';

test('chuỗi UI có dấu tiếng Việt ở dạng NFC', () => {
  expect(strings.gameTitle).toBe(strings.gameTitle.normalize('NFC'));
});
