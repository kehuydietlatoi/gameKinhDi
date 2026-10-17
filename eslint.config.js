import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['scripts/**/*.ts', 'tests/**/*.ts', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/ui/**/*.tsx', 'src/main.tsx'],
    extends: [reactHooks.configs.flat['recommended-latest']],
  },
  // AGENTS.md mục 5.1: engine là hàm thuần, không phụ thuộc React hay môi trường.
  {
    files: ['src/engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: ['react', 'react-dom', 'zod', 'yaml', 'pngjs'],
          patterns: [
            { group: ['**/ui/**', 'node:*'], message: 'Engine không được phụ thuộc UI hay Node.' },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Engine phải tất định.' },
        { object: 'Date', property: 'now', message: 'Engine phải tất định.' },
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "NewExpression[callee.name='Date']", message: 'Engine phải tất định.' },
      ],
      'no-restricted-globals': [
        'error',
        'window',
        'document',
        'localStorage',
        'sessionStorage',
        'fetch',
        'setTimeout',
        'setInterval',
      ],
    },
  },
]);
