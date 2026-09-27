import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const COMMON = resolve(import.meta.dirname, '../..');
const ROOT = resolve(COMMON, '../..');
const PRESET = resolve(COMMON, 'ls-lint/base.yaml');

// mise pins ls-lint for this repository; its shim does not resolve in a
// temporary folder, so the check runs the binary it points to.
const LS_LINT = spawnSync(
  'mise',
  [
    'which',
    'ls-lint',
  ],
  {
    cwd: ROOT,
    encoding: 'utf8',
  },
).stdout.trim();

if (LS_LINT === '') {
  throw new Error(
    'ls-lint is not installed: run `mise install` in a trusted checkout',
  );
}

interface Project {
  paths: readonly string[];
}

const failedPaths = (project: Project): readonly string[] => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-ls-lint-'));

  for (const path of project.paths) {
    mkdirSync(dirname(join(folder, path)), {
      recursive: true,
    });
    writeFileSync(join(folder, path), '');
  }

  const linting = spawnSync(
    LS_LINT,
    [
      '--config',
      PRESET,
    ],
    {
      cwd: folder,
      encoding: 'utf8',
    },
  );

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  return `${linting.stdout}${linting.stderr}`
    .split('\n')
    .filter((line) => line.includes(' failed for '))
    .map((line) => line.slice(0, line.indexOf(' failed for ')));
};

describe('ls-lint base preset', () => {
  test.each([
    {
      condition: 'a folder is in snake_case',
      path: 'src/order_views/order-view.ts',
      reported: 'src/order_views',
    },
    {
      condition: 'a file is in camelCase',
      path: 'src/orderView.ts',
      reported: 'src/orderView.ts',
    },
    {
      condition: 'a document is in PascalCase',
      path: 'docs/Guide.md',
      reported: 'docs/Guide.md',
    },
    {
      condition: 'a component file is in PascalCase',
      path: 'src/components/OrderCard.tsx',
      reported: 'src/components/OrderCard.tsx',
    },
    {
      condition: 'a style sheet is in PascalCase',
      path: 'src/Theme.css',
      reported: 'src/Theme.css',
    },
  ])('should report the name when $condition', ({ path, reported }) => {
    // Arrange
    const project = {
      paths: [
        path,
      ],
    };

    // Act
    const failed = failedPaths(project);

    // Assert
    expect(failed).toContain(reported);
  });

  test('should report nothing when every name is kebab-case or one the ecosystem fixes', () => {
    // Arrange
    const project = {
      paths: [
        '.editorconfig',
        '.github/workflows/check.yaml',
        'LICENSE.md',
        'README.md',
        'dist/Bundle.js',
        'node_modules/SomePackage/Index.js',
        'src/__tests__/order-view.spec.ts',
        'docs/CODE_OF_CONDUCT.md',
        'src/components/order-card.tsx',
        'src/order-view.ts',
      ],
    };

    // Act
    const failed = failedPaths(project);

    // Assert
    expect(failed).toStrictEqual([]);
  });
});
