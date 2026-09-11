import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');
const COMMON_DIR = resolve(import.meta.dirname, '../../../../common/lefthook');

describe('lefthook configs', () => {
  test('base.yml ships the common base unchanged', () => {
    // Arrange
    const source = readFileSync(resolve(COMMON_DIR, 'base.yml'), 'utf8');

    // Act
    const shipped = readFileSync(resolve(CONFIGS_DIR, 'base.yml'), 'utf8');

    // Assert
    expect(shipped).toBe(source);
  });

  test('biome.yml runs Biome over the staged files', () => {
    // Act
    const config = readFileSync(resolve(CONFIGS_DIR, 'biome.yml'), 'utf8');

    // Assert
    expect(config).toContain('bunx biome check --write');
    expect(config).toContain('{staged_files}');
  });
});
