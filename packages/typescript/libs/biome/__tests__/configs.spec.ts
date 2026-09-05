import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readConfig = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(CONFIGS_DIR, path), 'utf8')) as Record<
    string,
    unknown
  >;

const configFiles = [
  'base.json',
  'test.json',
  'environments/node.json',
  'environments/browser.json',
  'frameworks/nestjs.json',
  'frameworks/react.json',
  'frameworks/react-native.json',
];

describe('biome configs', () => {
  test.each(configFiles)('%s is valid JSON', (file) => {
    const config = readConfig(file);
    expect(config).toBeObject();
  });

  test('base.json has formatter, linter, and assist sections', () => {
    const config = readConfig('base.json');
    expect(config.formatter).toBeDefined();
    expect(config.linter).toBeDefined();
    expect(config.assist).toBeDefined();
  });

  test('base.json enables the recommended rule preset', () => {
    const linter = readConfig('base.json').linter as Record<string, unknown>;
    const rules = linter.rules as Record<string, unknown>;
    expect(rules.preset).toBe('recommended');
    expect(rules.recommended).toBeUndefined();
  });

  test.each([
    [
      'test.json',
      [
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    ],
    [
      'frameworks/react.json',
      [
        '**/*.tsx',
        '**/*.jsx',
      ],
    ],
    [
      'frameworks/nestjs.json',
      [
        '**/*.ts',
      ],
    ],
  ] as const)(
    '%s targets the correct file patterns',
    (file, expectedPatterns) => {
      const config = readConfig(file);
      const overrides = config.overrides as Record<string, unknown>[];
      expect(overrides.length).toBeGreaterThan(0);

      const includes = overrides[0]!.includes as string[];
      for (const pattern of expectedPatterns) {
        expect(includes).toContain(pattern);
      }
    },
  );
});
