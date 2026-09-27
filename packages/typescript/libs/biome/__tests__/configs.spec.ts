import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { lintFindings, PACKAGE_DIR } from './lint.fixtures';

const EXPORTS = (
  JSON.parse(readFileSync(resolve(PACKAGE_DIR, 'package.json'), 'utf8')) as {
    exports: Readonly<Record<string, string>>;
  }
).exports;

const presetPath = (name: string): string =>
  resolve(PACKAGE_DIR, EXPORTS[`./${name}`] ?? `missing-${name}`);

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

const TWO_PARAMETERS =
  'export const join = (head: string, tail: string): string => head + tail;\n';

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
        'src/main.ts': functionWithBodyOf(101),
      },
      rule: 'noExcessiveLinesPerFunction',
    },
    {
      condition: 'a file passes 500 lines',
      files: {
        'src/main.ts': fileOfLines(501),
      },
      rule: 'noExcessiveLinesPerFile',
    },
    {
      condition: 'null is compared loosely',
      files: {
        'src/main.ts':
          'export const isAbsent = (value: string | null): boolean => value == null;\n',
      },
      rule: 'noDoubleEquals',
    },
    {
      condition: 'shipped code writes to the console',
      files: {
        'src/main.ts': "console.info('ready');\n",
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
    const { rules } = lintFindings(project);

    // Assert
    expect(rules).toContain(rule);
  });

  test.each([
    {
      condition: 'a function body holds 100 lines',
      files: {
        'src/main.ts': functionWithBodyOf(100),
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
      condition: 'a function takes a second positional argument',
      files: {
        'src/main.ts': TWO_PARAMETERS,
      },
      rule: 'useMaxParams',
    },
    {
      condition: 'a *.test.ts spec passes 500 lines',
      files: {
        'src/main.test.ts': fileOfLines(600),
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
    const { rules } = lintFindings(project);

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
          'src/main.ts':
            "import { readFile } from 'fs';\n\nexport { readFile };\n",
        },
        presets: [
          'base',
          environment,
        ],
      };

      // Act
      const { rules } = lintFindings(project);

      // Assert
      expect(rules).toContain('useNodejsImportProtocol');
    },
  );

  test('should hold no rule at warn when a repository extends any preset', () => {
    // Arrange
    const sources = Object.keys(EXPORTS).map((key) =>
      readFileSync(presetPath(key.slice(2)), 'utf8'),
    );

    // Act
    const warnings = sources.filter((source) => /"warn"/.test(source));

    // Assert
    expect(warnings).toStrictEqual([]);
  });

  test.each([
    {
      condition: 'a function is named by an empty verb',
      files: {
        'src/features/orders/order.ts':
          'export const process = (): number => 1;\n',
      },
      message: 'Name what the function does',
    },
    {
      condition: 'a response body is cast with .json<T>()',
      files: {
        'src/features/orders/order.ts':
          'interface Order {\n  id: string;\n}\n\nexport const read = (response: Response): Promise<Order> =>\n  response.json<Order>();\n',
      },
      message: 'A response body is unknown until a schema parses it',
    },
    {
      condition: 'an interface carries the I prefix',
      files: {
        'src/features/orders/order.ts':
          'export interface IOrder {\n  id: string;\n}\n',
      },
      message: 'A type is a noun, undecorated',
    },
    {
      condition: 'a spec compares with toEqual',
      files: {
        'src/order.test.ts':
          "import { expect, test } from 'bun:test';\n\ntest('adds totals', () => {\n  expect(1).toEqual(1);\n});\n",
      },
      message: 'Compare with toStrictEqual',
    },
  ])('should report a plugin finding when $condition', ({ files, message }) => {
    // Arrange
    const project = {
      files,
      presets: [
        'base',
        'test',
      ],
    };

    // Act
    const { plugins } = lintFindings(project);

    // Assert
    expect(plugins.some((finding) => finding.startsWith(message))).toBe(true);
  });
});
