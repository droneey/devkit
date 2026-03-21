import { describe, expect, test } from 'bun:test';

import { configs } from '../setup';

describe('eslint configs', () => {
  test('exports all config layers', () => {
    expect(configs.base).toBeDefined();
    expect(configs.node).toBeDefined();
    expect(configs.browser).toBeDefined();
    expect(configs.test).toBeDefined();
    expect(configs.nestjs).toBeDefined();
    expect(configs.react).toBeDefined();
    expect(configs.reactNative).toBeDefined();
  });

  test('base config is an array of config objects', () => {
    expect(Array.isArray(configs.base)).toBe(true);
    expect(configs.base.length).toBeGreaterThan(0);
  });

  test('environment configs are arrays', () => {
    expect(Array.isArray(configs.node)).toBe(true);
    expect(Array.isArray(configs.browser)).toBe(true);
  });

  test('framework configs are arrays', () => {
    expect(Array.isArray(configs.nestjs)).toBe(true);
    expect(Array.isArray(configs.react)).toBe(true);
    expect(Array.isArray(configs.reactNative)).toBe(true);
  });

  test('test config is an array', () => {
    expect(Array.isArray(configs.test)).toBe(true);
  });

  test('base config includes rules', () => {
    const configWithRules = configs.base.find(
      (c: Record<string, unknown>) => c.rules,
    );
    expect(configWithRules).toBeDefined();
  });
});
