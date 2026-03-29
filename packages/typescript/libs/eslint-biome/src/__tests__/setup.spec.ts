import { describe, expect, test } from 'bun:test';

import { configs } from '../setup.ts';

const flatConfigs = (arr: unknown[]): Record<string, unknown>[] =>
  arr.flat(10) as Record<string, unknown>[];

describe('@droneey/devkit-ts-eslint-biome', () => {
  test('exports all config layers as functions', () => {
    expect(typeof configs.base).toBe('function');
    expect(typeof configs.node).toBe('function');
    expect(typeof configs.browser).toBe('function');
    expect(typeof configs.test).toBe('function');
    expect(typeof configs.nestjs).toBe('function');
    expect(typeof configs.react).toBe('function');
    expect(typeof configs.reactNative).toBe('function');
  });

  test('base config returns an array', () => {
    expect(Array.isArray(configs.base())).toBe(true);
  });

  test('base config finds .gitignore from nested directory', () => {
    const originalCwd = process.cwd.bind(process);
    process.cwd = () =>
      `${originalCwd()}/packages/typescript/libs/eslint-biome`;
    const result = configs.base();
    process.cwd = originalCwd;
    expect(result.length).toBeGreaterThan(0);
  });

  test('base config works without .gitignore', () => {
    const originalCwd = process.cwd.bind(process);
    process.cwd = () => '/';
    const result = configs.base();
    process.cwd = originalCwd;
    expect(result.length).toBeGreaterThan(0);
  });

  test('base config includes type-checked rules', () => {
    const allRules = flatConfigs(configs.base())
      .filter((c) => c['rules'] != null)
      .flatMap((c) => Object.keys(c['rules'] as Record<string, unknown>));

    expect(allRules).toContain('@typescript-eslint/no-floating-promises');
    expect(allRules).toContain('@typescript-eslint/no-unnecessary-condition');
    expect(allRules).toContain(
      '@typescript-eslint/switch-exhaustiveness-check',
    );
  });

  test('all configs return arrays', () => {
    expect(Array.isArray(configs.node())).toBe(true);
    expect(Array.isArray(configs.browser())).toBe(true);
    expect(Array.isArray(configs.test())).toBe(true);
    expect(Array.isArray(configs.nestjs())).toBe(true);
    expect(Array.isArray(configs.react())).toBe(true);
    expect(Array.isArray(configs.reactNative())).toBe(true);
  });

  test('base config does NOT include any plugins (Biome handles everything except type-checked rules)', () => {
    const allPlugins = flatConfigs(configs.base())
      .filter((c) => c['plugins'] != null)
      .flatMap((c) => Object.keys(c['plugins'] as Record<string, unknown>));

    expect(allPlugins).not.toContain('perfectionist');
    expect(allPlugins).not.toContain('unicorn');
    expect(allPlugins).not.toContain('import-x');
    expect(allPlugins).not.toContain('no-secrets');
  });
});
