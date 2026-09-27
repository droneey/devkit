import { spawnSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const ROOT = resolve(PACKAGE_DIR, '../../../..');
const BIOME = resolve(ROOT, 'node_modules/.bin/biome');
const EXPORTS = (
  JSON.parse(readFileSync(resolve(PACKAGE_DIR, 'package.json'), 'utf8')) as {
    exports: Readonly<Record<string, string>>;
  }
).exports;

interface Report {
  diagnostics: readonly {
    category: string;
    message: string;
  }[];
}

interface Project {
  files: Readonly<Record<string, string>>;
  presets: readonly string[];
  source?: 'npm' | 'submodule';
}

interface Findings {
  plugins: readonly string[];
  rules: readonly string[];
}

const installPackage = (folder: string): void => {
  mkdirSync(join(folder, 'node_modules/@droneey'), {
    recursive: true,
  });
  symlinkSync(
    PACKAGE_DIR,
    join(folder, 'node_modules/@droneey/devkit-ts-biome'),
  );
};

// A submodule is a real folder holding devkit's own biome.json, which Biome
// would read if it walked into it.
const checkOutSubmodule = (folder: string): void => {
  cpSync(
    resolve(ROOT, 'packages/common/biome'),
    join(folder, '.devkit/packages/common/biome'),
    {
      recursive: true,
    },
  );
  cpSync(resolve(ROOT, 'biome.json'), join(folder, '.devkit/biome.json'));
};

const presetReference = (input: {
  preset: string;
  source: 'npm' | 'submodule';
}): string =>
  input.source === 'npm'
    ? `@droneey/devkit-ts-biome/${input.preset}`
    : `./.devkit/packages/common/biome/${(EXPORTS[`./${input.preset}`] ?? '').slice(2)}`;

// What the real Biome reports over a small project that takes this package's
// presets as a consumer does — from npm by name, or from a devkit submodule by
// path: each lint rule by its name, each GritQL plugin by its message.
const lintFindings = (project: Project): Findings => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-biome-'));
  const source = project.source ?? 'npm';

  if (source === 'npm') {
    installPackage(folder);
  } else {
    checkOutSubmodule(folder);
  }

  writeFileSync(
    join(folder, 'biome.json'),
    JSON.stringify({
      extends: project.presets.map((preset) =>
        presetReference({
          preset,
          source,
        }),
      ),
      vcs: {
        enabled: false,
      },
    }),
  );

  for (const [path, text] of Object.entries(project.files)) {
    mkdirSync(dirname(join(folder, path)), {
      recursive: true,
    });
    writeFileSync(join(folder, path), text);
  }

  const linting = spawnSync(
    BIOME,
    [
      'lint',
      '--reporter=json',
      source === 'npm' ? 'src' : '.',
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

  const report = JSON.parse(linting.stdout) as Report;

  return {
    plugins: report.diagnostics
      .filter(({ category }) => category === 'plugin')
      .map(({ message }) => message),
    rules: report.diagnostics
      .filter(({ category }) => category !== 'plugin')
      .map(({ category }) => category.slice(category.lastIndexOf('/') + 1)),
  };
};

export type { Findings, Project };
export { lintFindings, PACKAGE_DIR };
