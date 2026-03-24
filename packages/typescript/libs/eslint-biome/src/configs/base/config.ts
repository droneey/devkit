import fs from 'node:fs';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';

import { typescriptConfig } from './rules/index.ts';

const gitignorePath = path.resolve(process.cwd(), '.gitignore');

const baseConfig = [
  ...(fs.existsSync(gitignorePath)
    ? [
        includeIgnoreFile(gitignorePath),
      ]
    : []),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...typescriptConfig,
];

export { baseConfig };
