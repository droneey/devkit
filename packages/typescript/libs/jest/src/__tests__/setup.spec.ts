import { describe, expect, test } from 'bun:test';

import endToEndPreset from '../../e2e/jest-preset.js';
import basePreset from '../../jest-preset.js';

describe('jest presets', () => {
  test('base preset has ts-jest transform', () => {
    expect(basePreset.transform).toBeDefined();
  });

  test('base preset targets spec files', () => {
    const regex = new RegExp(basePreset.testRegex, 'u');
    expect(regex.test('user.spec.ts')).toBe(true);
    expect(regex.test('user.test.ts')).toBe(false);
  });

  test('endToEnd preset targets e2e-spec files', () => {
    const regex = new RegExp(endToEndPreset.testRegex, 'u');
    expect(regex.test('app.e2e-spec.ts')).toBe(true);
    expect(regex.test('app.spec.ts')).toBe(false);
  });

  test('endToEnd preset has extended timeout', () => {
    expect(endToEndPreset.testTimeout).toBeGreaterThan(0);
  });
});
