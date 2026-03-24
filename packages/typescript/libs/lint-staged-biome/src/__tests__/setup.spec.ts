import { describe, expect, test } from 'bun:test';

import { configs } from '../setup.ts';

describe('@droneey/devkit-ts-lint-staged-biome', () => {
  test('exports base config', () => {
    expect(configs.base).toBeDefined();
  });

  test('base config runs biome on supported files', () => {
    const pattern = '*.{ts,tsx,js,jsx,json,md,yaml,yml}';
    expect(configs.base[pattern]).toBeDefined();
    expect(configs.base[pattern]).toContain(
      'biome check --write --no-errors-on-unmatched',
    );
  });

  test('base config runs eslint on TypeScript files', () => {
    const pattern = '*.{ts,tsx}';
    expect(configs.base[pattern]).toBeDefined();
    expect(configs.base[pattern]).toContain('eslint --fix');
  });
});
