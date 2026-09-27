import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';
import { YAML } from 'bun';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const ROOT = resolve(PACKAGE_DIR, '../../../..');
const COMMON = resolve(ROOT, 'packages/common');
const PRESET = resolve(PACKAGE_DIR, 'configs/betterleaks.toml');

// A token of GitHub's shape, drawn at random on each run: no source file holds
// one, and a random body carries the entropy the scanner looks for.
const TOKEN = `ghp_${randomBytes(48)
  .toString('base64')
  .replaceAll(/[^A-Za-z0-9]/g, '')
  .slice(0, 36)}`;

interface Project {
  files: Readonly<Record<string, string>>;
}

interface Scan {
  exitCode: number | undefined;
  output: string;
}

// mise pins betterleaks for this repository; its shim does not resolve in a
// temporary folder, so the scan runs the binary it points to.
const BETTERLEAKS = spawnSync(
  'mise',
  [
    'which',
    'betterleaks',
  ],
  {
    cwd: ROOT,
    encoding: 'utf8',
  },
).stdout.trim();

const hookCommand = (): string => {
  const config = YAML.parse(
    readFileSync(resolve(COMMON, 'lefthook/betterleaks.yml'), 'utf8'),
  ) as {
    'pre-commit': {
      jobs: {
        name: string;
        run: string;
      }[];
    };
  };

  return (
    config['pre-commit'].jobs.find(({ name }) => name === 'secrets')?.run ??
    'exit 99'
  );
};

// What the commit hook reports over a repository that extends the preset and
// stages the given files.
const scanStaged = (project: Project): Scan => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-betterleaks-'));
  const git = (args: readonly string[]): void => {
    spawnSync(
      'git',
      [
        ...args,
      ],
      {
        cwd: folder,
      },
    );
  };

  git([
    'init',
    '--quiet',
  ]);
  writeFileSync(
    join(folder, '.betterleaks.toml'),
    `[extend]\npath = "${PRESET}"\n`,
  );

  for (const [path, text] of Object.entries(project.files)) {
    writeFileSync(join(folder, path), text);
  }

  git([
    'add',
    '.',
  ]);

  const scanning = spawnSync(
    'sh',
    [
      '-c',
      hookCommand().replace(/^betterleaks /, `"${BETTERLEAKS}" `),
    ],
    {
      cwd: folder,
      encoding: 'utf8',
    },
  );

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  return {
    exitCode: scanning.status ?? undefined,
    output: `${scanning.stdout}${scanning.stderr}`,
  };
};

describe('betterleaks preset', () => {
  test('should ship the common preset unchanged when a repository extends it', () => {
    // Arrange
    const source = readFileSync(
      resolve(COMMON, 'betterleaks/betterleaks.toml'),
      'utf8',
    );

    // Act
    const shipped = readFileSync(PRESET, 'utf8');

    // Assert
    expect(shipped).toBe(source);
  });

  test('should stop the commit when a staged file holds a token', () => {
    // Arrange
    const project = {
      files: {
        'config.ts': `export const token = '${TOKEN}';\n`,
      },
    };

    // Act
    const { exitCode } = scanStaged(project);

    // Assert
    expect(exitCode).toBe(1);
  });

  test('should keep the token out of the report when it stops the commit', () => {
    // Arrange
    const project = {
      files: {
        'config.ts': `export const token = '${TOKEN}';\n`,
      },
    };

    // Act
    const { output } = scanStaged(project);

    // Assert
    expect(output).not.toContain(TOKEN);
  });

  test.each([
    {
      condition: 'the line carries betterleaks:allow with its reason',
      files: {
        'config.ts': `export const token = '${TOKEN}'; // betterleaks:allow a fixture, never a real token\n`,
      },
    },
    {
      condition: 'the line carries the older gitleaks:allow',
      files: {
        'config.ts': `export const token = '${TOKEN}'; // gitleaks:allow a fixture, never a real token\n`,
      },
    },
    {
      condition:
        'its fingerprint is ignored under a line that states the reason',
      files: {
        '.betterleaksignore':
          '# a fixture token in the parser spec, never a real one\nconfig.ts:github-pat:1\n',
        'config.ts': `export const token = '${TOKEN}';\n`,
      },
    },
    {
      condition: 'no staged file holds a secret',
      files: {
        'config.ts': "export const greeting = 'hello';\n",
      },
    },
  ])('should let the commit through when $condition', ({ files }) => {
    // Arrange
    const project = {
      files,
    };

    // Act
    const { exitCode } = scanStaged(project);

    // Assert
    expect(exitCode).toBe(0);
  });
});
