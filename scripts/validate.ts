// Kiểm tra mọi file trong content/ (AGENTS.md mục 8 và 11).
// Dùng: npm run validate [-- --content <thư mục> --public <thư mục>]
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { runValidate } from './lib/run.ts';

const root = join(import.meta.dirname, '..');
const { values } = parseArgs({
  options: {
    content: { type: 'string', default: join(root, 'content') },
    public: { type: 'string', default: join(root, 'public') },
  },
});

const report = runValidate(resolve(values.content), resolve(values.public));
for (const line of report.summary) console.log(line);
for (const w of report.warnings) console.warn(`cảnh báo: ${w}`);
for (const e of report.errors) console.error(`lỗi: ${e}`);

if (report.errors.length) {
  console.error(`validate: ${report.errors.length} lỗi`);
  process.exit(1);
}
console.log('validate: OK');
