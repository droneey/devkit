import { describe, expect, test } from 'bun:test';

import { configs } from '../setup.ts';

describe('prettier configs', () => {
  test('exports base config', () => {
    expect(configs.base).toBeDefined();
  });

  test('base config has expected formatting rules', () => {
    expect(configs.base.singleQuote).toBe(true);
    expect(configs.base.tabWidth).toBe(2);
    expect(configs.base.semi).toBe(true);
    expect(configs.base.trailingComma).toBe('all');
    expect(configs.base.endOfLine).toBe('lf');
    expect(configs.base.printWidth).toBe(80);
    expect(configs.base.useTabs).toBe(false);
  });

  test('base config has JSX rules', () => {
    expect(configs.base.jsxSingleQuote).toBe(true);
    expect(configs.base.singleAttributePerLine).toBe(true);
    expect(configs.base.bracketSameLine).toBe(false);
  });
});
