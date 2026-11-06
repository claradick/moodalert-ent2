// ConfiguraÃ§Ã£o ESM: todo o cÃ³digo da aplicaÃ§Ã£o continua em JavaScript.
import expo from 'eslint-config-expo/flat.js';

export default [
  ...expo,
  { ignores: ['dist/**', '.expo/**', 'node_modules/**'] },
  { files: ['backend/**/*.js', 'tests/**/*.js', 'scripts/**/*.js', 'playwright.config.js'],
    languageOptions: { globals: { process: 'readonly', Buffer: 'readonly' } } },
];
