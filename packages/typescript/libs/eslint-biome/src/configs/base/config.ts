import fs from 'node:fs';
import path from 'node:path';

import { includeIgnoreFile } from '@eslint/compat';

import { typescriptConfig } from './rules/index.ts';

const findGitignore = (): string | null => {
  let dir = process.cwd();

  while (dir !== path.dirname(dir)) {
    const candidate = path.join(dir, '.gitignore');

    if (fs.existsSync(candidate)) {
      return candidate;
    }

    dir = path.dirname(dir);
  }

  return null;
};

const baseConfig = (): object[] => {
  const gitignorePath = findGitignore();

  return [
    ...(gitignorePath === null
      ? []
      : [
          includeIgnoreFile(gitignorePath),
        ]),
    {
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
      },
    },
    ...typescriptConfig,
  ];
};

export { baseConfig };
