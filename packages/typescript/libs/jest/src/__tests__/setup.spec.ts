import { describe, expect, test } from 'bun:test';

import { configs } from '../setup';

describe('jest configs', () => {
  test('exports base config', () => {
    expect(configs.base).toBeDefined();
  });

  test('exports endToEnd config', () => {
    expect(configs.endToEnd).toBeDefined();
  });

  test('base config uses ts-jest transform', () => {
    expect(configs.base.transform).toBeDefined();
  });

  test('base config targets spec files', () => {
    const regex = new RegExp(configs.base.testRegex, 'u');
    expect(regex.test('user.spec.ts')).toBe(true);
    expect(regex.test('user.test.ts')).toBe(false);
  });

  test('endToEnd config targets e2e-spec files', () => {
    const regex = new RegExp(configs.endToEnd.testRegex, 'u');
    expect(regex.test('app.e2e-spec.ts')).toBe(true);
    expect(regex.test('app.spec.ts')).toBe(false);
  });

  test('endToEnd config has extended timeout', () => {
    expect(configs.endToEnd.testTimeout).toBeGreaterThan(0);
  });
});
