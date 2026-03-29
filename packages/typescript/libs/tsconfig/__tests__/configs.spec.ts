import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readConfig = (name: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(CONFIGS_DIR, name), 'utf8')) as Record<
    string,
    unknown
  >;

const getOptions = (name: string): Record<string, unknown> =>
  readConfig(name).compilerOptions as Record<string, unknown>;

describe('tsconfig base', () => {
  test('has strict mode with ESNext target and module', () => {
    const options = getOptions('base.json');
    expect(options.strict).toBe(true);
    expect(options.target).toBe('ESNext');
    expect(options.module).toBe('ESNext');
    expect(options.verbatimModuleSyntax).toBe(true);
    expect(options.noUncheckedSideEffectImports).toBe(true);
    expect(options.skipLibCheck).toBe(true);
  });
});

describe('tsconfig variants', () => {
  test('node-cjs.json uses CommonJS module and node resolution', () => {
    const config = readConfig('node-cjs.json');
    expect(config.extends).toBe('./base.json');

    const options = getOptions('node-cjs.json');
    expect(options.module).toBe('commonjs');
    expect(options.moduleResolution).toBe('node');
    expect(options.esModuleInterop).toBe(true);
  });

  test('node-esm.json uses NodeNext module and resolution', () => {
    const config = readConfig('node-esm.json');
    expect(config.extends).toBe('./base.json');

    const options = getOptions('node-esm.json');
    expect(options.module).toBe('NodeNext');
    expect(options.moduleResolution).toBe('NodeNext');
  });

  test('browser.json includes DOM types and JSX', () => {
    const config = readConfig('browser.json');
    expect(config.extends).toBe('./base.json');

    const options = getOptions('browser.json');
    const lib = options.lib as string[];
    expect(lib).toContain('DOM');
    expect(lib).toContain('DOM.Iterable');
    expect(options.jsx).toBe('react-jsx');
  });

  test('mobile.json has JSX for React Native', () => {
    const config = readConfig('mobile.json');
    expect(config.extends).toBe('./base.json');

    const options = getOptions('mobile.json');
    expect(options.jsx).toBe('react-jsx');
  });
});
