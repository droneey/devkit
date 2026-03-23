import { describe, expect, test } from 'bun:test';

import { configs } from '../setup.ts';

const flatConfigs = (arr: unknown[]): Record<string, unknown>[] =>
  arr.flat(10) as Record<string, unknown>[];

describe('@droneey/devkit-ts-biome-eslint', () => {
  test('exports all config layers', () => {
    expect(configs.base).toBeDefined();
    expect(configs.node).toBeDefined();
    expect(configs.browser).toBeDefined();
    expect(configs.test).toBeDefined();
    expect(configs.nestjs).toBeDefined();
    expect(configs.react).toBeDefined();
    expect(configs.reactNative).toBeDefined();
  });

  test('base config is an array', () => {
    expect(Array.isArray(configs.base)).toBe(true);
  });

  test('base config includes type-checked rules', () => {
    const allRules = flatConfigs(configs.base)
      .filter((c) => c['rules'])
      .flatMap((c) => Object.keys(c['rules'] as Record<string, unknown>));

    expect(allRules).toContain('@typescript-eslint/no-floating-promises');
    expect(allRules).toContain('@typescript-eslint/no-unnecessary-condition');
    expect(allRules).toContain(
      '@typescript-eslint/switch-exhaustiveness-check',
    );
  });

  test('base config does NOT include any plugins (Biome handles everything except type-checked rules)', () => {
    const allPlugins = flatConfigs(configs.base)
      .filter((c) => c['plugins'])
      .flatMap((c) => Object.keys(c['plugins'] as Record<string, unknown>));

    expect(allPlugins).not.toContain('perfectionist');
    expect(allPlugins).not.toContain('unicorn');
    expect(allPlugins).not.toContain('import-x');
    expect(allPlugins).not.toContain('no-secrets');
  });
});
