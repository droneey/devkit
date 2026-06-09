import { describe, expect, test } from 'bun:test';

import { configs } from '../index.ts';

describe('jest configs', () => {
  test('exposes base and endToEnd presets', () => {
    expect(configs.base).toBeDefined();
    expect(configs.endToEnd).toBeDefined();
  });

  test('base preset: node env, .spec.ts regex, ts-jest transform', () => {
    expect(configs.base.testEnvironment).toBe('node');
    expect(configs.base.testRegex).toContain('spec');
    expect(configs.base.moduleFileExtensions).toContain('ts');
    expect(configs.base.collectCoverageFrom.length).toBeGreaterThan(0);
    expect(Object.values(configs.base.transform)).toContain('ts-jest');
  });

  test('endToEnd preset: node env, .e2e-spec.ts regex, 30s timeout', () => {
    expect(configs.endToEnd.rootDir).toBe('.');
    expect(configs.endToEnd.testEnvironment).toBe('node');
    expect(configs.endToEnd.testRegex).toContain('e2e-spec');
    expect(configs.endToEnd.testTimeout).toBe(30_000);
    expect(Object.values(configs.endToEnd.transform)).toContain('ts-jest');
  });
});
