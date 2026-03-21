import fs from 'node:fs';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';

import {
  importConfig,
  javascriptConfig,
  perfectionistConfig,
  prettierConfig,
  secretsConfig,
  typescriptConfig,
  unicornConfig,
} from './rules';

const gitignorePath = path.resolve(process.cwd(), '.gitignore');

const baseConfig = [
  ...(fs.existsSync(gitignorePath) ? [includeIgnoreFile(gitignorePath)] : []),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...javascriptConfig,
  ...typescriptConfig,
  ...unicornConfig,
  ...secretsConfig,
  ...importConfig,
  ...perfectionistConfig,
  {
    files: ['eslint.config.{js,ts}'],

    rules: {
      'import-x/no-default-export': 'off',
      'max-lines': 'off',
    },
  },
  {
    files: ['commitlint.config.{js,ts}'],

    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  ...prettierConfig,
];

export { baseConfig };
