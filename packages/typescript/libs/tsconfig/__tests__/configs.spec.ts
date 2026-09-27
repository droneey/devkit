import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readSource = (name: string): string =>
  readFileSync(resolve(CONFIGS_DIR, name), 'utf8');

describe('tsconfig configs', () => {
  test('should hold the strict ESNext baseline when a repository extends base.json', () => {
    // Arrange
    const source = readSource('base.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('compilerOptions.strict', true);
    expect(config).toHaveProperty('compilerOptions.target', 'ESNext');
    expect(config).toHaveProperty('compilerOptions.module', 'ESNext');
    expect(config).toHaveProperty('compilerOptions.verbatimModuleSyntax', true);
    expect(config).toHaveProperty(
      'compilerOptions.noUncheckedSideEffectImports',
      true,
    );
    expect(config).toHaveProperty(
      'compilerOptions.exactOptionalPropertyTypes',
      true,
    );
    expect(config).toHaveProperty('compilerOptions.skipLibCheck', true);
  });

  test.each([
    'node.json',
    'browser.json',
    'mobile.json',
  ])('should build on the base when a repository extends %s', (file) => {
    // Arrange
    const source = readSource(file);

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('extends', './base.json');
  });

  test('should add the DOM types and React JSX when a repository extends browser.json', () => {
    // Arrange
    const source = readSource('browser.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('compilerOptions.lib', [
      'ESNext',
      'DOM',
      'DOM.Iterable',
    ]);
    expect(config).toHaveProperty('compilerOptions.jsx', 'react-jsx');
  });

  test('should compile React Native JSX when a repository extends mobile.json', () => {
    // Arrange
    const source = readSource('mobile.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('compilerOptions.jsx', 'react-jsx');
  });
});

const TSC = resolve(
  import.meta.dirname,
  '../../../../../node_modules/.bin/tsc',
);

// A project of two files that extends one preset, checked by the real compiler.
const typeChecks = (input: { main: string; preset: string }): boolean => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-tsconfig-'));

  writeFileSync(
    join(folder, 'tsconfig.json'),
    JSON.stringify({
      extends: resolve(CONFIGS_DIR, input.preset),
      include: [
        '*.ts',
      ],
    }),
  );
  writeFileSync(
    join(folder, 'order.ts'),
    "export interface Order { id: string }\nexport const ORDER_KIND = 'order';\n",
  );
  writeFileSync(join(folder, 'main.ts'), input.main);

  const result = spawnSync(TSC, [
    '-p',
    folder,
  ]);

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  return result.status === 0;
};

const TYPE_IMPORTED_AS_VALUE =
  "import { Order } from './order';\nexport const orders: Order[] = [];\n";
const IMPORT_WITH_TS_EXTENSION =
  "import { ORDER_KIND } from './order.ts';\nexport const kind = ORDER_KIND;\n";

describe('the node and nestjs presets', () => {
  test.each([
    {
      condition: 'a type is imported without `import type`',
      main: TYPE_IMPORTED_AS_VALUE,
      preset: 'node.json',
    },
    {
      condition: 'an import names its .ts extension',
      main: IMPORT_WITH_TS_EXTENSION,
      preset: 'nestjs.json',
    },
  ])(
    'should fail the type check under $preset when $condition',
    ({ main, preset }) => {
      // Arrange
      const project = {
        main,
        preset,
      };

      // Act
      const isClean = typeChecks(project);

      // Assert
      expect(isClean).toBe(false);
    },
  );

  test.each([
    {
      condition: 'an import names its .ts extension',
      main: IMPORT_WITH_TS_EXTENSION,
      preset: 'node.json',
    },
    {
      condition: 'a type is imported without `import type`',
      main: TYPE_IMPORTED_AS_VALUE,
      preset: 'nestjs.json',
    },
  ])(
    'should pass the type check under $preset when $condition',
    ({ main, preset }) => {
      // Arrange
      const project = {
        main,
        preset,
      };

      // Act
      const isClean = typeChecks(project);

      // Assert
      expect(isClean).toBe(true);
    },
  );
});
