import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';
import { YAML } from 'bun';

import { z } from 'zod';

const HOOKS_DIR = resolve(import.meta.dirname, '..');

describe('lefthook configs', () => {
  test('should run Biome over the staged files when a repository commits, from npm or from mise', () => {
    // Arrange
    const source = readFileSync(resolve(HOOKS_DIR, 'biome.yaml'), 'utf8');

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
      'PATH="node_modules/.bin:$PATH" biome check --write --no-errors-on-unmatched {staged_files}',
    );
  });
});

const COMMIT_MESSAGE_HOOKS = z.object({
  'commit-msg': z.object({
    jobs: z.array(
      z.object({
        name: z.string(),
        run: z.string(),
      }),
    ),
  }),
});

interface CommitMessageCheck {
  exitCode: number | undefined;
  output: string;
}

// lefthook passes the message file as {1} and runs the job under sh.
const checkCommitMessage = (message: string): CommitMessageCheck => {
  const config = COMMIT_MESSAGE_HOOKS.parse(
    YAML.parse(readFileSync(resolve(HOOKS_DIR, 'base.yaml'), 'utf8')),
  );
  const job = config['commit-msg'].jobs.find(
    (candidate) => candidate.name === 'commit-message',
  );
  const folder = mkdtempSync(join(tmpdir(), 'devkit-commit-'));
  const file = join(folder, 'COMMIT_EDITMSG');

  writeFileSync(file, message);

  const hookRun = spawnSync(
    'sh',
    [
      '-c',
      (job?.run ?? 'exit 99').replaceAll('{1}', file),
    ],
    {
      encoding: 'utf8',
    },
  );

  rmSync(folder, {
    force: true,
    recursive: true,
  });

  return {
    exitCode: hookRun.status ?? undefined,
    output: hookRun.stdout.trim(),
  };
};

describe('commit message hook', () => {
  test.each([
    'feat: Add the audit preset',
    'fix: Keep the header within 100 characters',
    'refactor: Move the fixtures beside their specs',
    'chore: Update dependencies',
    'feat!: Split the NestJS settings out of the node preset',
    'fix!: Drop the old export',
  ])('should accept "%s" when it follows the four types', (message) => {
    // Arrange
    const text = `${message}\n`;

    // Act
    const check = checkCommitMessage(text);

    // Assert
    expect(check).toStrictEqual({
      exitCode: 0,
      output: '',
    });
  });

  test.each([
    {
      condition: 'its type is not one of the four',
      message: 'docs: Explain the presets',
      output: "Invalid type 'docs'. Allowed: feat, fix, refactor, chore",
    },
    {
      condition: 'it has a scope',
      message: 'feat(biome): Add a preset',
      output:
        'Commit must match format: type: Subject, or type!: Subject for a breaking change',
    },
    {
      condition: 'the colon has no space after it',
      message: 'feat:Add a preset',
      output:
        'Commit must match format: type: Subject, or type!: Subject for a breaking change',
    },
    {
      condition: 'the subject starts in lower case',
      message: 'fix: keep the header short',
      output: 'Subject must start with an uppercase letter (sentence-case)',
    },
    {
      condition: 'the subject is a placeholder',
      message: 'chore: Wip',
      output: "Subject 'Wip' says nothing; say what changed",
    },
    {
      condition: 'the subject is a placeholder of two words',
      message: 'fix: Fix stuff',
      output: "Subject 'Fix stuff' says nothing; say what changed",
    },
    {
      condition: 'the header passes 100 characters',
      message: `feat: ${'A'.repeat(95)}`,
      output: 'Header must be 100 characters or less (got 101)',
    },
    {
      condition: 'it carries a body',
      message: 'feat: Add a preset\n\nBecause the kit needs one',
      output: 'Body and footer must be empty',
    },
  ])('should reject a message when $condition', ({ message, output }) => {
    // Arrange
    const text = `${message}\n`;

    // Act
    const check = checkCommitMessage(text);

    // Assert
    expect(check).toStrictEqual({
      exitCode: 1,
      output,
    });
  });
});
