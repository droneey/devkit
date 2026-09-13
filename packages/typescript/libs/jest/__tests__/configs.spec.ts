import { describe, expect, test } from 'bun:test';

import { configs } from '../index.ts';

const TS_JEST_TRANSFORM = {
  '^.+\\.[tj]sx?$': 'ts-jest',
};

describe('jest configs', () => {
  test('should expose the base and end-to-end presets when a repository imports the package', () => {
    // Arrange
    const presets = [
      'base',
      'endToEnd',
    ];

    // Act
    const exposed = Object.keys(configs);

    // Assert
    expect(exposed).toStrictEqual(presets);
  });

  test('should run the unit specs in node through ts-jest when a repository uses the base preset', () => {
    // Arrange
    const extensions = [
      'js',
      'json',
      'ts',
      'tsx',
    ];

    // Act
    const preset = configs.base;

    // Assert
    expect(preset.testEnvironment).toBe('node');
    expect(preset.testRegex).toBe(String.raw`.*\.spec\.ts$`);
    expect(preset.moduleFileExtensions).toStrictEqual(extensions);
    expect(preset.transform).toStrictEqual(TS_JEST_TRANSFORM);
  });

  test('should collect coverage from every source when a repository uses the base preset', () => {
    // Arrange
    const sources = [
      '**/*.(t|j)s',
    ];

    // Act
    const preset = configs.base;

    // Assert
    expect(preset.collectCoverageFrom).toStrictEqual(sources);
  });

  test('should run the end-to-end specs in node through ts-jest when a repository uses the end-to-end preset', () => {
    // Arrange
    const timeout = 30_000;

    // Act
    const preset = configs.endToEnd;

    // Assert
    expect(preset.rootDir).toBe('.');
    expect(preset.testEnvironment).toBe('node');
    expect(preset.testRegex).toBe(String.raw`.*\.e2e-spec\.ts$`);
    expect(preset.testTimeout).toBe(timeout);
    expect(preset.transform).toStrictEqual(TS_JEST_TRANSFORM);
  });
});
