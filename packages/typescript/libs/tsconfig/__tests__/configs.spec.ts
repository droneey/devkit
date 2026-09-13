import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');

const readSource = (name: string): string =>
  readFileSync(resolve(CONFIGS_DIR, name), 'utf8');

describe('tsconfig configs', () => {
  test('should hold the strict ESNext baseline when a repository extends base.json', () => {
    // Arrange
    const source = readSource('base.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('compilerOptions.strict', true);
    expect(config).toHaveProperty('compilerOptions.target', 'ESNext');
    expect(config).toHaveProperty('compilerOptions.module', 'ESNext');
    expect(config).toHaveProperty('compilerOptions.verbatimModuleSyntax', true);
    expect(config).toHaveProperty(
      'compilerOptions.noUncheckedSideEffectImports',
      true,
    );
    expect(config).toHaveProperty(
      'compilerOptions.exactOptionalPropertyTypes',
      true,
    );
    expect(config).toHaveProperty('compilerOptions.skipLibCheck', true);
  });

  test.each([
    'node.json',
    'browser.json',
    'mobile.json',
  ])('should build on the base when a repository extends %s', (file) => {
    // Arrange
    const source = readSource(file);

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('extends', './base.json');
  });

  test('should add the DOM types and React JSX when a repository extends browser.json', () => {
    // Arrange
    const source = readSource('browser.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('compilerOptions.lib', [
      'ESNext',
      'DOM',
      'DOM.Iterable',
    ]);
    expect(config).toHaveProperty('compilerOptions.jsx', 'react-jsx');
  });

  test('should compile React Native JSX when a repository extends mobile.json', () => {
    // Arrange
    const source = readSource('mobile.json');

    // Act
    const config: unknown = JSON.parse(source);

    // Assert
    expect(config).toHaveProperty('compilerOptions.jsx', 'react-jsx');
  });
});
