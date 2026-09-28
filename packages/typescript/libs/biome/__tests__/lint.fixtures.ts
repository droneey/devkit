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
  source?: 'npm' | 'release';
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

const unpackRelease = (folder: string): void => {
  cpSync(resolve(ROOT, 'packages/common'), join(folder, '.devkit/common'), {
    recursive: true,
  });
};

const presetReference = (input: {
  preset: string;
  source: 'npm' | 'release';
}): string =>
  input.source === 'npm'
    ? `@droneey/devkit-ts-biome/${input.preset}`
    : `./.devkit/common/biome/${(EXPORTS[`./${input.preset}`] ?? '').slice(2)}`;

const lintFindings = (project: Project): Findings => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-biome-'));
  const source = project.source ?? 'npm';

  if (source === 'npm') {
    installPackage(folder);
  } else {
    unpackRelease(folder);
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
