import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const BIOME = resolve(PACKAGE_DIR, '../../../../node_modules/.bin/biome');

const EXPORTS = (
  JSON.parse(readFileSync(resolve(PACKAGE_DIR, 'package.json'), 'utf8')) as {
    exports: Readonly<Record<string, string>>;
  }
).exports;

const presetPath = (name: string): string =>
  resolve(PACKAGE_DIR, EXPORTS[`./${name}`] ?? `missing-${name}`);

interface Project {
  files: Readonly<Record<string, string>>;
  presets: readonly string[];
}

interface Report {
  diagnostics: readonly {
    category: string;
  }[];
}

// The rules the real Biome reports over a small project extending the presets.
const reportedRules = (project: Project): readonly string[] => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-biome-'));

  writeFileSync(
    join(folder, 'biome.json'),
    JSON.stringify({
      extends: project.presets.map(presetPath),
      vcs: {
        enabled: false,
      },
    }),
  );

  for (const [path, source] of Object.entries(project.files)) {
    mkdirSync(dirname(join(folder, path)), {
      recursive: true,
    });
    writeFileSync(join(folder, path), source);
  }

  const result = spawnSync(
    BIOME,
    [
      'lint',
      '--reporter=json',
      '.',
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

  const report = JSON.parse(result.stdout) as Report;

  return [
    ...new Set(
      report.diagnostics.map(({ category }) =>
        category.slice(category.lastIndexOf('/') + 1),
      ),
    ),
  ];
};

const indexes = (count: number): readonly number[] => [
  ...new Array<undefined>(count).keys(),
];

const statements = (count: number): string =>
  indexes(count)
    .map((index) => `  total += '${String(index)}'.length;`)
    .join('\n');

// Biome counts a function's body, the lines between its braces.
const functionWithBodyOf = (lines: number): string =>
  `export const measure = (): number => {\n  let total = 0;\n${statements(lines - 2)}\n  return total;\n};\n`;

const fileOfLines = (lines: number): string =>
  `${indexes(lines)
    .map((index) => `export const label${String(index)} = 'label';`)
    .join('\n')}\n`;

describe('biome presets', () => {
  test.each(Object.keys(EXPORTS).map((key) => key.slice(2)))(
    'should parse when a repository extends %s',
    (preset) => {
      // Arrange
      const path = presetPath(preset);

      // Act
      const config: unknown = Bun.JSONC.parse(readFileSync(path, 'utf8'));

      // Assert
      expect(config).toBeObject();
    },
  );

  test.each([
    {
      condition: 'a function body passes 100 lines',
      files: {
        'main.ts': functionWithBodyOf(101),
      },
      rule: 'noExcessiveLinesPerFunction',
    },
    {
      condition: 'a file passes 500 lines',
      files: {
        'main.ts': fileOfLines(501),
      },
      rule: 'noExcessiveLinesPerFile',
    },
    {
      condition: 'null is compared loosely',
      files: {
        'main.ts':
          'export const isAbsent = (value: string | null): boolean => value == null;\n',
      },
      rule: 'noDoubleEquals',
    },
    {
      condition: 'a function takes a second positional argument',
      files: {
        'main.ts':
          'export const join = (head: string, tail: string): string => head + tail;\n',
      },
      rule: 'useMaxParams',
    },
    {
      condition: 'shipped code writes to the console',
      files: {
        'main.ts': "console.info('ready');\n",
      },
      rule: 'noConsole',
    },
    {
      condition: 'a spec types a value as any',
      files: {
        'src/__tests__/main.spec.ts':
          "import { expect, test } from 'bun:test';\n\ntest('should keep any out when a spec types a value', () => {\n  const value: any = 1;\n  expect(value).toBe(1);\n});\n",
      },
      rule: 'noExplicitAny',
    },
    {
      condition: 'a helper in __tests__ asserts non-null',
      files: {
        'src/__tests__/order.fixtures.ts':
          'export const first = (items: readonly string[]): string => items[0]!;\n',
      },
      rule: 'noNonNullAssertion',
    },
    {
      condition: 'a spec is focused',
      files: {
        'src/__tests__/main.spec.ts':
          "import { expect, test } from 'bun:test';\n\ntest.only('should run alone when focused', () => {\n  expect(true).toBe(true);\n});\n",
      },
      rule: 'noFocusedTests',
    },
  ])('should report $rule when $condition', ({ files, rule }) => {
    // Arrange
    const project = {
      files,
      presets: [
        'base',
        'test',
      ],
    };

    // Act
    const rules = reportedRules(project);

    // Assert
    expect(rules).toContain(rule);
  });

  test.each([
    {
      condition: 'a function body holds 100 lines',
      files: {
        'main.ts': functionWithBodyOf(100),
      },
      rule: 'noExcessiveLinesPerFunction',
    },
    {
      condition: 'a spec passes 500 lines',
      files: {
        'src/__tests__/main.spec.ts': fileOfLines(600),
      },
      rule: 'noExcessiveLinesPerFile',
    },
    {
      condition: 'a spec holds a function of more than 100 lines',
      files: {
        'src/__tests__/main.spec.ts': functionWithBodyOf(150),
      },
      rule: 'noExcessiveLinesPerFunction',
    },
  ])('should not report $rule when $condition', ({ files, rule }) => {
    // Arrange
    const project = {
      files,
      presets: [
        'base',
        'test',
      ],
    };

    // Act
    const rules = reportedRules(project);

    // Assert
    expect(rules).not.toContain(rule);
  });

  test.each([
    'node',
    'bun',
  ])(
    'should report a built-in module imported without its node: prefix when a repository extends %s',
    (environment) => {
      // Arrange
      const project = {
        files: {
          'main.ts': "import { readFile } from 'fs';\n\nexport { readFile };\n",
        },
        presets: [
          'base',
          environment,
        ],
      };

      // Act
      const rules = reportedRules(project);

      // Assert
      expect(rules).toContain('useNodejsImportProtocol');
    },
  );

  test('should hold every preset at error, so a warning never passes the check', () => {
    // Arrange
    const sources = Object.keys(EXPORTS).map((key) =>
      readFileSync(presetPath(key.slice(2)), 'utf8'),
    );

    // Act
    const warnings = sources.filter((source) => /"warn"/.test(source));

    // Assert
    expect(warnings).toStrictEqual([]);
  });
});
