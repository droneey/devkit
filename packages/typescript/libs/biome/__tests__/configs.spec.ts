import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

interface BiomeConfig {
  assist: Record<string, unknown>;
  formatter: {
    indentStyle: string;
    indentWidth: number;
  };
  javascript: {
    formatter: {
      quoteStyle: string;
    };
  };
  linter: Record<string, unknown>;
}

const readConfig = (name: string): BiomeConfig =>
  JSON.parse(readFileSync(resolve(CONFIGS_DIR, name), 'utf8')) as BiomeConfig;

describe('biome configs', () => {
  test('base.json is valid and has formatter settings', () => {
    const config = readConfig('base.json');
    expect(config.formatter).toBeDefined();
    expect(config.javascript).toBeDefined();
    expect(config.linter).toBeDefined();
  });

  test('base.json has import sorting enabled', () => {
    const config = readConfig('base.json');
    expect(config.assist).toBeDefined();
  });

  test('base.json formatter uses single quotes and 2-space indent', () => {
    const config = readConfig('base.json');
    expect(config.javascript.formatter.quoteStyle).toBe('single');
    expect(config.formatter.indentWidth).toBe(2);
    expect(config.formatter.indentStyle).toBe('space');
  });
});
