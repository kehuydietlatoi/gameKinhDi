// Kiểm tra file ảnh nền: tồn tại, đúng 320×180, chỉ chứa màu của bảng màu, không trong suốt.
import { existsSync, readFileSync } from 'node:fs';
import { PNG } from 'pngjs';
import { BG_HEIGHT, BG_WIDTH, PALETTE } from '../../src/content/palette.ts';

const allowed = new Set(PALETTE.map((hex) => parseInt(hex.slice(1), 16)));
const hex = (rgb: number) => `#${rgb.toString(16).padStart(6, '0')}`;

export function checkBackground(path: string, label: string): string[] {
  if (!existsSync(path)) return [`${label} — không tìm thấy file ${path}`];
  let png: PNG;
  try {
    png = PNG.sync.read(readFileSync(path));
  } catch (e) {
    return [`${label} — không đọc được PNG: ${(e as Error).message}`];
  }
  if (png.width !== BG_WIDTH || png.height !== BG_HEIGHT) {
    return [`${label} — kích thước ${png.width}×${png.height}, phải là ${BG_WIDTH}×${BG_HEIGHT}`];
  }
  const stray = new Map<number, number>();
  let translucent = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const rgb = (png.data[i]! << 16) | (png.data[i + 1]! << 8) | png.data[i + 2]!;
    if (png.data[i + 3] !== 255) translucent++;
    if (!allowed.has(rgb)) stray.set(rgb, (stray.get(rgb) ?? 0) + 1);
  }
  const errors: string[] = [];
  if (translucent) errors.push(`${label} — ${translucent} điểm ảnh không đục hoàn toàn`);
  if (stray.size) {
    const sample = [...stray.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([c, n]) => `${hex(c)}×${n}`)
      .join(', ');
    errors.push(`${label} — ${stray.size} màu ngoài bảng màu (${sample})`);
  }
  return errors;
}
