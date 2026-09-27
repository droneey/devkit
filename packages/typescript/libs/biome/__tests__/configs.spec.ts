import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

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

const EXPORTS = (
  JSON.parse(
    readFileSync(resolve(import.meta.dirname, '../package.json'), 'utf8'),
  ) as {
    exports: Readonly<Record<string, string>>;
  }
).exports;

const BIOME = resolve(
  import.meta.dirname,
  '../../../../../node_modules/.bin/biome',
);

// One file linted by the real Biome under one environment preset.
const lintPasses = (input: {
  environment: string;
  source: string;
}): boolean => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-biome-'));

  writeFileSync(
    join(folder, 'biome.json'),
    JSON.stringify({
      extends: [
        resolve(
          import.meta.dirname,
          '..',
          EXPORTS[`./${input.environment}`] ?? 'missing',
        ),
      ],
    }),
  );
  writeFileSync(join(folder, 'main.ts'), input.source);

  const result = spawnSync(
    BIOME,
    [
      'lint',
      '--error-on-warnings',
      folder,
    ],
    {
      cwd: folder,
    },
  );

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  return result.status === 0;
};

describe('the node and bun environments', () => {
  test.each([
    'node',
    'bun',
  ])(
    'should report a built-in module imported without its node: prefix when a repository extends %s',
    (environment) => {
      // Arrange
      const project = {
        environment,
        source: "import { readFile } from 'fs';\n\nexport { readFile };\n",
      };

      // Act
      const passes = lintPasses(project);

      // Assert
      expect(passes).toBe(false);
    },
  );

  test.each([
    'node',
    'bun',
  ])(
    'should pass a built-in module imported with its node: prefix when a repository extends %s',
    (environment) => {
      // Arrange
      const project = {
        environment,
        source: "import { readFile } from 'node:fs';\n\nexport { readFile };\n",
      };

      // Act
      const passes = lintPasses(project);

      // Assert
      expect(passes).toBe(true);
    },
  );
});
