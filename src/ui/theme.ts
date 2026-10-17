// Màu của UI. styles.css đọc qua biến CSS do App gắn vào gốc, nên đây là nguồn duy nhất.
// Mọi màu chữ phải đạt ≥ 4.5:1 trên `bg` (tests/ui-theme.test.ts kiểm tra).
// Chữ Huyết tự dùng #ff5a52, không dùng #8a0b0b (màu đó chỉ dành cho ảnh; AGENTS.md mục 9).
export const theme = {
  bg: '#0b0b0d', // nền tối nhất, nền của khung chữ
  surface: '#1c1b22', // khung system, nút, bảng Huyết tự
  border: '#4a4651',
  text: '#e8e6dc',
  muted: '#a8a196', // env, tiền tố, chữ phụ
  whisper: '#9d978c', // npc thì thầm
  blood: '#ff5a52', // chữ Huyết tự
  accent: '#d9cfa8', // nút đang chọn, gạch chân
  dawn: '#a9b8c4', // lớp phủ bình minh (độ mờ 25%)
} as const;

export type ThemeColor = keyof typeof theme;

/** Màu chữ cần đạt tương phản ≥ 4.5:1 với `bg` và `surface`. */
export const TEXT_COLORS: ThemeColor[] = ['text', 'muted', 'whisper', 'blood', 'accent'];

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}
