import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Đường dẫn tương đối: bản build chạy được ở mọi thư mục con,
  // ví dụ GitHub Pages https://<user>.github.io/gameKinhDi/.
  base: './',
  plugins: [react()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
