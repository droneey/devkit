import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readConfig = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(CONFIGS_DIR, path), 'utf8')) as Record<
    string,
    unknown
  >;

describe('biome base config', () => {
  test('formatter uses single quotes, 2-space indent, 80 char width, LF', () => {
    const config = readConfig('base.json');
    const formatter = config.formatter as Record<string, unknown>;
    const jsFormatter = (config.javascript as Record<string, unknown>)
      .formatter as Record<string, unknown>;

    expect(formatter.indentStyle).toBe('space');
    expect(formatter.indentWidth).toBe(2);
    expect(formatter.lineWidth).toBe(80);
    expect(formatter.lineEnding).toBe('lf');
    expect(jsFormatter.quoteStyle).toBe('single');
    expect(jsFormatter.semicolons).toBe('always');
    expect(jsFormatter.trailingCommas).toBe('all');
  });

  test('linter has recommended rules enabled', () => {
    const config = readConfig('base.json');
    const linter = config.linter as Record<string, unknown>;
    const rules = linter.rules as Record<string, unknown>;

    expect(rules.recommended).toBe(true);
  });

  test('assist has import sorting and interface member sorting', () => {
    const config = readConfig('base.json');
    const assist = config.assist as Record<string, unknown>;
    const actions = assist.actions as Record<string, unknown>;
    const source = actions.source as Record<string, unknown>;

    expect(source.organizeImports).toEqual({
      level: 'on',
    });
    expect(source.useSortedInterfaceMembers).toEqual({
      level: 'on',
    });
  });
});

describe('biome environment configs', () => {
  test('node.json enforces nodejs import protocol', () => {
    const config = readConfig('environments/node.json');
    const linter = config.linter as Record<string, unknown>;
    const rules = linter.rules as Record<string, unknown>;
    const style = rules.style as Record<string, unknown>;

    expect(style.useNodejsImportProtocol).toBe('warn');
  });

  test('browser.json is a valid config', () => {
    const config = readConfig('environments/browser.json');
    expect(config.$schema).toContain('biomejs.dev');
  });
});

describe('biome framework configs', () => {
  test('react.json has hooks and a11y rules for JSX files', () => {
    const config = readConfig('frameworks/react.json');
    const overrides = config.overrides as Record<string, unknown>[];
    const includes = overrides[0]!.includes as string[];
    expect(includes).toContain('**/*.tsx');

    const linter = overrides[0]!.linter as Record<string, unknown>;
    const rules = linter.rules as Record<string, unknown>;
    const correctness = rules.correctness as Record<string, unknown>;
    expect(correctness.useHookAtTopLevel).toBe('error');
    expect(correctness.useExhaustiveDependencies).toBe('error');

    const a11y = rules.a11y as Record<string, unknown>;
    expect(a11y.useButtonType).toBe('error');
    expect(a11y.useAltText).toBe('error');
  });

  test('nestjs.json relaxes DI-related rules', () => {
    const config = readConfig('frameworks/nestjs.json');
    const overrides = config.overrides as Record<string, unknown>[];
    const linter = overrides[0]!.linter as Record<string, unknown>;
    const rules = linter.rules as Record<string, unknown>;
    const style = rules.style as Record<string, unknown>;

    expect(style.noParameterProperties).toBe('off');
  });

  test('react-native.json is a valid config', () => {
    const config = readConfig('frameworks/react-native.json');
    expect(config.$schema).toContain('biomejs.dev');
  });
});

describe('biome test config', () => {
  test('relaxes rules for test files', () => {
    const config = readConfig('test.json');
    const overrides = config.overrides as Record<string, unknown>[];

    expect(overrides).toHaveLength(1);
    const includes = overrides[0]!.includes as string[];
    expect(includes).toContain('**/*.spec.ts');
    expect(includes).toContain('**/*.test.ts');

    const linter = overrides[0]!.linter as Record<string, unknown>;
    const rules = linter.rules as Record<string, unknown>;
    const style = rules.style as Record<string, unknown>;
    expect(style.noNonNullAssertion).toBe('off');
  });
});

describe('biome schema consistency', () => {
  test('all configs use the same schema version', () => {
    const files = [
      'base.json',
      'test.json',
      'environments/node.json',
      'environments/browser.json',
      'frameworks/nestjs.json',
      'frameworks/react.json',
      'frameworks/react-native.json',
    ];

    const schemas = files.map((f) => readConfig(f).$schema);
    const versions = new Set(schemas);
    expect(versions.size).toBe(1);
  });
});
