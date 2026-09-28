import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { z } from 'zod';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const ROOT = resolve(PACKAGE_DIR, '../../../..');
const TSC = resolve(ROOT, 'node_modules/.bin/tsc');

const EXPORTS = z
  .object({
    exports: z.record(z.string(), z.string()),
  })
  .parse(
    JSON.parse(readFileSync(resolve(PACKAGE_DIR, 'package.json'), 'utf8')),
  ).exports;

const presetPath = (name: string): string =>
  resolve(PACKAGE_DIR, EXPORTS[`./${name}`] ?? `missing-${name}`);

// The project's types resolve from devkit's own node_modules.
const typeChecks = (input: {
  main: string;
  presets: readonly string[];
}): boolean => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-tsconfig-'));

  writeFileSync(
    join(folder, 'tsconfig.json'),
    JSON.stringify({
      extends: input.presets.map(presetPath),
      compilerOptions: {
        typeRoots: [
          resolve(ROOT, 'node_modules/@types'),
        ],
      },
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

  const compilation = spawnSync(TSC, [
    '-p',
    folder,
  ]);

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  return compilation.status === 0;
};

const EMPTY = 'export {};\n';
const TYPE_IMPORTED_AS_VALUE =
  "import { Order } from './order';\nexport const orders: Order[] = [];\n";
const IMPORT_WITH_TS_EXTENSION =
  "import { ORDER_KIND } from './order.ts';\nexport const kind = ORDER_KIND;\n";
const FIELD_WITHOUT_INITIALIZER =
  'export class CreateOrderInput {\n  id: string;\n}\n';
const READS_THE_DOCUMENT = 'export const title = document.title;\n';
const READS_BUN = 'export const version = Bun.version;\n';
const READS_THE_PROCESS = 'export const home = process.env.HOME;\n';

describe('tsconfig presets', () => {
  test.each(Object.keys(EXPORTS).map((key) => key.slice(2)))(
    'should resolve and check an empty project when a repository extends %s',
    (preset) => {
      // Arrange
      const project = {
        main: EMPTY,
        presets:
          preset === 'react' || preset === 'nestjs'
            ? [
                'base',
                preset,
              ]
            : [
                preset,
              ],
      };

      // Act
      const isClean = typeChecks(project);

      // Assert
      expect(isClean).toBe(true);
    },
  );

  test.each([
    {
      condition: 'a type is imported without `import type`',
      main: TYPE_IMPORTED_AS_VALUE,
      presets: [
        'node',
      ],
    },
    {
      condition: 'a class field has no initializer',
      main: FIELD_WITHOUT_INITIALIZER,
      presets: [
        'node',
      ],
    },
    {
      condition: 'an import names its .ts extension',
      main: IMPORT_WITH_TS_EXTENSION,
      presets: [
        'node',
        'nestjs',
      ],
    },
    {
      condition: 'code outside a browser reads the document',
      main: READS_THE_DOCUMENT,
      presets: [
        'bun',
      ],
    },
    {
      condition: 'browser code reads Bun',
      main: READS_BUN,
      presets: [
        'browser',
      ],
    },
    {
      condition: 'browser code reads the process',
      main: READS_THE_PROCESS,
      presets: [
        'browser',
        'react',
      ],
    },
  ])(
    'should fail the type check of $presets when $condition',
    ({ main, presets }) => {
      // Arrange
      const project = {
        main,
        presets,
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
      presets: [
        'bun',
      ],
    },
    {
      condition: 'a type is imported without `import type`',
      main: TYPE_IMPORTED_AS_VALUE,
      presets: [
        'node',
        'nestjs',
      ],
    },
    {
      condition: 'a class field has no initializer, as the framework fills it',
      main: FIELD_WITHOUT_INITIALIZER,
      presets: [
        'node',
        'nestjs',
      ],
    },
    {
      condition: 'browser code reads the document',
      main: READS_THE_DOCUMENT,
      presets: [
        'browser',
        'react',
      ],
    },
    {
      condition: 'code on Bun reads Bun',
      main: READS_BUN,
      presets: [
        'bun',
      ],
    },
    {
      condition: 'code on Node reads the process',
      main: READS_THE_PROCESS,
      presets: [
        'node',
        'nestjs',
      ],
    },
  ])(
    'should pass the type check of $presets when $condition',
    ({ main, presets }) => {
      // Arrange
      const project = {
        main,
        presets,
      };

      // Act
      const isClean = typeChecks(project);

      // Assert
      expect(isClean).toBe(true);
    },
  );
});
