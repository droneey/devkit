import fs from 'node:fs';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';

import { typescriptConfig } from './rules/index.ts';

const findGitignore = (): object[] => {
  let dir = process.cwd();

  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, '.gitignore');

    if (fs.existsSync(candidate)) {
      return [
        includeIgnoreFile(candidate),
      ];
    }

    dir = path.dirname(dir);
  }

  return [];
};

const baseConfig = (): object[] => [
  ...findGitignore(),
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  ...typescriptConfig,
];

export { baseConfig };
