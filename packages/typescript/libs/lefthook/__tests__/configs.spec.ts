import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';
import { YAML } from 'bun';

const CONFIGS_DIR = resolve(import.meta.dirname, '../configs');
const COMMON_DIR = resolve(import.meta.dirname, '../../../../common/lefthook');

describe('lefthook configs', () => {
  test('should ship the common base unchanged when a repository extends base.yml', () => {
    // Arrange
    const source = readFileSync(resolve(COMMON_DIR, 'base.yml'), 'utf8');

    // Act
    const shipped = readFileSync(resolve(CONFIGS_DIR, 'base.yml'), 'utf8');

    // Assert
    expect(shipped).toBe(source);
  });

  test('should run Biome over the staged files when a repository commits', () => {
    // Arrange
    const source = readFileSync(resolve(CONFIGS_DIR, 'biome.yml'), 'utf8');

    // Act
    const config: unknown = YAML.parse(source);

    // Assert
    expect(config).toHaveProperty(
      [
        'pre-commit',
        'jobs',
        0,
        'run',
      ],
      'bunx biome check --write --no-errors-on-unmatched {staged_files}',
    );
  });
});
