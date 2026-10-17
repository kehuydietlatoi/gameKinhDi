// Kiểm tra mọi file trong content/. Bản tạm của bước 1: chỉ liệt kê file.
// Các kiểm tra thật được thêm ở bước 4 (AGENTS.md mục 8 và 11).
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const contentDir = join(import.meta.dirname, '..', 'content');
const files = existsSync(contentDir)
  ? readdirSync(contentDir).filter((f) => f.endsWith('.yaml'))
  : [];

console.log(`validate: ${files.length} file trong content/`);
