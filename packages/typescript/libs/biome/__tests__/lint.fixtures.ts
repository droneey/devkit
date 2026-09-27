import { spawnSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const BIOME = resolve(PACKAGE_DIR, '../../../../node_modules/.bin/biome');

interface Report {
  diagnostics: readonly {
    category: string;
    message: string;
  }[];
}

export interface Project {
  files: Readonly<Record<string, string>>;
  presets: readonly string[];
}

export interface Findings {
  plugins: readonly string[];
  rules: readonly string[];
}

// What the real Biome reports over a small project that installs this package
// and extends its presets by name, as a consumer does: each lint rule by its
// name, each GritQL plugin by its message.
export const lintFindings = (project: Project): Findings => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-biome-'));

  mkdirSync(join(folder, 'node_modules/@droneey'), {
    recursive: true,
  });
  symlinkSync(
    PACKAGE_DIR,
    join(folder, 'node_modules/@droneey/devkit-ts-biome'),
  );
  writeFileSync(
    join(folder, 'biome.json'),
    JSON.stringify({
      extends: project.presets.map(
        (preset) => `@droneey/devkit-ts-biome/${preset}`,
      ),
      vcs: {
        enabled: false,
      },
    }),
  );

  for (const [path, source] of Object.entries(project.files)) {
    mkdirSync(dirname(join(folder, path)), {
      recursive: true,
    });
    writeFileSync(join(folder, path), source);
  }

  const linting = spawnSync(
    BIOME,
    [
      'lint',
      '--reporter=json',
      'src',
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

export { PACKAGE_DIR };
