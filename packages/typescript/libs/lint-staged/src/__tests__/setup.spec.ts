import { describe, expect, test } from 'bun:test';

import { configs } from '../setup';

describe('lint-staged configs', () => {
  test('exports base config', () => {
    expect(configs.base).toBeDefined();
  });

  test('base config runs prettier on supported files', () => {
    const pattern = '*.{ts,tsx,js,jsx,json,md,yaml,yml}';
    expect(configs.base[pattern]).toBeDefined();
    expect(configs.base[pattern]).toContain('prettier --write');
  });

  test('base config runs eslint on TypeScript files', () => {
    const pattern = '*.{ts,tsx}';
    expect(configs.base[pattern]).toBeDefined();
    expect(configs.base[pattern]).toContain('eslint --fix');
  });
});
