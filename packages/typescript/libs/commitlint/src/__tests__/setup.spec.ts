import { describe, expect, test } from 'bun:test';

import { configs } from '../setup';

const ALLOWED_TYPES = [
  'feat',
  'fix',
  'perf',
  'refactor',
  'style',
  'test',
  'docs',
  'build',
  'ci',
  'chore',
];

describe('commitlint configs', () => {
  test('exports base config', () => {
    expect(configs.base).toBeDefined();
  });

  test('extends conventional commits', () => {
    expect(configs.base.extends).toContain('@commitlint/config-conventional');
  });

  test('enforces empty body and footer', () => {
    const rules = configs.base.rules!;
    expect(rules['body-empty']).toBeDefined();
    expect(rules['footer-empty']).toBeDefined();
  });

  test('disables header-case', () => {
    const rules = configs.base.rules!;
    const [severity] = rules['header-case'] as [number];
    expect(severity).toBe(0);
  });

  test('enforces sentence-case on subject', () => {
    const rules = configs.base.rules!;
    const rule = rules['subject-case'] as [number, string, string];
    expect(rule[2]).toBe('sentence-case');
  });

  test('allows all expected commit types', () => {
    const rules = configs.base.rules!;
    const rule = rules['type-enum'] as [number, string, string[]];
    expect(rule[2]).toEqual(ALLOWED_TYPES);
  });
});
