import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const COMMON = resolve(import.meta.dirname, '../..');
const ROOT = resolve(COMMON, '../..');

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
  parts: readonly string[];
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
    project.parts.flatMap((part) => [
      '--config',
      resolve(COMMON, `ls-lint/${part}.yaml`),
    ]),
    {
      cwd: folder,
      encoding: 'utf8',
    },
  );

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  const output = `${linting.stdout}${linting.stderr}`;
  const failed = output
    .split('\n')
    .filter((line) => line.includes(' failed for '))
    .map((line) => line.slice(0, line.indexOf(' failed for ')));

  if (linting.status !== 0 && failed.length === 0) {
    throw new Error(`ls-lint did not run: ${output}`);
  }

  return failed;
};

describe('ls-lint presets', () => {
  test.each([
    {
      condition: 'a folder is in snake_case',
      parts: [
        'base',
      ],
      path: 'assets/order_icons/order-icon.svg',
      reported: 'assets/order_icons',
    },
    {
      condition: 'a file is in camelCase',
      parts: [
        'base',
      ],
      path: 'assets/orderIcon.svg',
      reported: 'assets/orderIcon.svg',
    },
    {
      condition: 'a style module is in PascalCase',
      parts: [
        'base',
      ],
      path: 'assets/Theme.module.css',
      reported: 'assets/Theme.module.css',
    },
    {
      condition: 'an end-to-end spec is in PascalCase',
      parts: [
        'base',
      ],
      path: 'e2e/Checkout.e2e.spec.js',
      reported: 'e2e/Checkout.e2e.spec.js',
    },
    {
      condition: 'a document is in upper case without the markdown part',
      parts: [
        'base',
      ],
      path: 'README.md',
      reported: 'README.md',
    },
    {
      condition: 'a document is in PascalCase',
      parts: [
        'base',
        'markdown',
      ],
      path: 'docs/Guide.md',
      reported: 'docs/Guide.md',
    },
    {
      condition: 'a test folder has no typescript part',
      parts: [
        'base',
      ],
      path: 'src/__tests__/order-view.spec.ts',
      reported: 'src/__tests__',
    },
    {
      condition: 'a component file is in PascalCase',
      parts: [
        'base',
        'typescript',
      ],
      path: 'src/components/OrderCard.tsx',
      reported: 'src/components/OrderCard.tsx',
    },
    {
      condition: 'a spec file is in PascalCase',
      parts: [
        'base',
        'typescript',
      ],
      path: 'src/__tests__/OrderView.spec.ts',
      reported: 'src/__tests__/OrderView.spec.ts',
    },
    {
      condition: 'a typescript folder is in snake_case',
      parts: [
        'base',
        'typescript',
      ],
      path: 'src/order_views/order-view.ts',
      reported: 'src/order_views',
    },
    {
      condition: 'a python module is in PascalCase',
      parts: [
        'base',
        'python',
      ],
      path: 'orders/OrderRepository.py',
      reported: 'orders/OrderRepository.py',
    },
    {
      condition: 'a python module is in kebab-case',
      parts: [
        'base',
        'python',
      ],
      path: 'orders/order-repository.py',
      reported: 'orders/order-repository.py',
    },
  ])('should report the name when $condition', ({ parts, path, reported }) => {
    // Arrange
    const project = {
      parts,
      paths: [
        path,
      ],
    };

    // Act
    const failed = failedPaths(project);

    // Assert
    expect(failed).toContain(reported);
  });

  test.each([
    {
      condition: 'every name is kebab-case, hidden or ignored',
      parts: [
        'base',
      ],
      paths: [
        '.dependency-cruiser.mjs',
        '.editorconfig',
        '.env.local',
        '.github/workflows/check.yaml',
        'assets/order-icon.svg',
        'assets/theme.module.css',
        'e2e/checkout.e2e.spec.js',
        'dist/Bundle.js',
        'node_modules/SomePackage/Index.js',
      ],
    },
    {
      condition: 'documents are kebab-case or in upper case',
      parts: [
        'base',
        'markdown',
      ],
      paths: [
        'LICENSE.md',
        'README.md',
        'docs/CODE_OF_CONDUCT.md',
        'docs/order-guide.md',
      ],
    },
    {
      condition: 'typescript names are kebab-case beside a test folder',
      parts: [
        'base',
        'typescript',
      ],
      paths: [
        'src/__tests__/order-view.spec.ts',
        'src/components/order-card.stories.tsx',
        'src/components/order-card.tsx',
        'src/order-view.ts',
      ],
    },
    {
      condition: 'python names are snake_case or the dunder modules',
      parts: [
        'base',
        'python',
      ],
      paths: [
        '.venv/lib/SomePackage/Module.py',
        'order_domain/__init__.py',
        'order_domain/__pycache__/order_repository.cpython-313.pyc',
        'order_domain/__main__.py',
        'order_domain/order_repository.py',
        'order_domain/order_repository.pyi',
        'order-service/app.py',
      ],
    },
  ])('should report nothing when $condition', ({ parts, paths }) => {
    // Arrange
    const project = {
      parts,
      paths,
    };

    // Act
    const failed = failedPaths(project);

    // Assert
    expect(failed).toStrictEqual([]);
  });
});
