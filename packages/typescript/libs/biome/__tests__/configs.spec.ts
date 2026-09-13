import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readSource = (name: string): string =>
  readFileSync(resolve(CONFIGS_DIR, name), 'utf8');

const configFiles = [
  'base.json',
  'test.json',
  'environments/node.json',
  'environments/browser.json',
  'frameworks/nestjs.json',
  'frameworks/react.json',
  'frameworks/react-native.json',
];

const scopedFiles = [
  [
    'test.json',
    [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.test.tsx',
    ],
  ],
  [
    'frameworks/react.json',
    [
      '**/*.tsx',
      '**/*.jsx',
    ],
  ],
  [
    'frameworks/nestjs.json',
    [
      '**/*.ts',
    ],
  ],
] as const;

describe('biome configs', () => {
  test.each(configFiles)(
    'should parse as a JSON object when a repository extends %s',
    (file) => {
      // Arrange
      const source = readSource(file);

      // Act
      const config: unknown = JSON.parse(source);

      // Assert
      expect(config).toBeObject();
    },
  );

  test('should configure the formatter, the linter and the assist when a repository extends base.json', () => {
    // Arrange
    const source = readSource('base.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('formatter');
    expect(config).toHaveProperty('linter');
    expect(config).toHaveProperty('assist');
  });

  test('should enable the recommended rule preset when a repository extends base.json', () => {
    // Arrange
    const source = readSource('base.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('linter.rules.preset', 'recommended');
    expect(config).not.toHaveProperty('linter.rules.recommended');
  });

  test('should let the tool configurations default-export when a repository extends base.json', () => {
    // Arrange
    const source = readSource('base.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('overrides.0.includes', [
      '**/*.config.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.cjs',
      '**/.*rc.ts',
      '**/.*rc.js',
      '**/.*rc.mjs',
      '**/.*rc.cjs',
      '**/.dependency-cruiser.js',
      '**/.dependency-cruiser.mjs',
      '**/.dependency-cruiser.cjs',
    ]);
    expect(config).toHaveProperty(
      'overrides.0.linter.rules.style.noDefaultExport',
      'off',
    );
  });

  test.each(scopedFiles)(
    'should scope its override to its own files when a repository extends %s',
    (file, includes) => {
      // Arrange
      const source = readSource(file);

      // Act
      const config: unknown = JSON.parse(source);

      // Assert
      expect(config).toHaveProperty('overrides.0.includes', includes);
    },
  );
});
