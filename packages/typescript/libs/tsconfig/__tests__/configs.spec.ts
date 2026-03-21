import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readConfig = (name: string): Record<string, unknown> =>
  JSON.parse(readFileSync(resolve(CONFIGS_DIR, name), 'utf8')) as Record<
    string,
    unknown
  >;

describe('tsconfig configs', () => {
  test('base.json is valid and has strict mode', () => {
    const config = readConfig('base.json');
    const options = config.compilerOptions as Record<string, unknown>;
    expect(options.strict).toBe(true);
    expect(options.target).toBe('ESNext');
    expect(options.module).toBe('ESNext');
  });

  test('node-cjs.json extends base', () => {
    const config = readConfig('node-cjs.json');
    expect(config.extends).toBe('./base.json');
  });

  test('node-esm.json extends base', () => {
    const config = readConfig('node-esm.json');
    expect(config.extends).toBe('./base.json');
  });

  test('browser.json extends base', () => {
    const config = readConfig('browser.json');
    expect(config.extends).toBe('./base.json');
  });

  test('react-native.json extends base', () => {
    const config = readConfig('react-native.json');
    expect(config.extends).toBe('./base.json');
  });
});
