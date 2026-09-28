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

import { describe, expect, test } from 'bun:test';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const ROOT = resolve(PACKAGE_DIR, '../../../..');
const DEPCRUISE = resolve(ROOT, 'node_modules/.bin/depcruise');

interface Project {
  files: Readonly<Record<string, string>>;
}

interface Report {
  summary: {
    totalCruised: number;
    violations: readonly {
      rule: {
        name: string;
      };
    }[];
  };
}

interface Cruise {
  cruised: number;
  violations: readonly string[];
}

// Packages the project installs: `kit` is declared, `devtool` a development
// dependency, `ghost` installed but never declared, `legacy` deprecated.
const INSTALLED = {
  'node_modules/devtool/index.js': 'export const devtool = 1;\n',
  'node_modules/devtool/package.json':
    '{"name":"devtool","version":"1.0.0","main":"index.js"}',
  'node_modules/ghost/index.js': 'export const ghost = 1;\n',
  'node_modules/ghost/package.json':
    '{"name":"ghost","version":"1.0.0","main":"index.js"}',
  'node_modules/kit/index.js': 'export const kit = 1;\n',
  'node_modules/kit/package.json':
    '{"name":"kit","version":"1.0.0","main":"index.js"}',
  'node_modules/legacy/index.js': 'export const legacy = 1;\n',
  'node_modules/legacy/package.json':
    '{"name":"legacy","version":"1.0.0","main":"index.js","deprecated":"use kit"}',
  'package.json': JSON.stringify({
    dependencies: {
      kit: '1.0.0',
      legacy: '1.0.0',
    },
    devDependencies: {
      devtool: '1.0.0',
    },
    name: 'fixture',
    type: 'module',
  }),
};

const cruise = (project: Project): Cruise => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-depcruise-'));
  const files = {
    ...INSTALLED,
    ...project.files,
    // dependency-cruiser resolves `extends` without the package's exports, so the
    // preset is named by its file's path.
    '.dependency-cruiser.mjs':
      "export default { extends: '@droneey/devkit-ts-dependency-cruiser/configs/hygiene.mjs' };\n",
  };

  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(folder, path)), {
      recursive: true,
    });
    writeFileSync(join(folder, path), text);
  }

  mkdirSync(join(folder, 'node_modules/@droneey'), {
    recursive: true,
  });
  symlinkSync(
    PACKAGE_DIR,
    join(folder, 'node_modules/@droneey/devkit-ts-dependency-cruiser'),
  );

  const cruising = spawnSync(
    DEPCRUISE,
    [
      '.',
      '--config',
      '.dependency-cruiser.mjs',
      '--output-type',
      'json',
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

  const report = JSON.parse(cruising.stdout) as Report;

  return {
    cruised: report.summary.totalCruised,
    violations: report.summary.violations.map(({ rule }) => rule.name),
  };
};

describe('dependency-cruiser hygiene preset', () => {
  test.each([
    {
      condition: 'two modules import each other',
      files: {
        'src/order.ts':
          "import { line } from './line';\nexport const order = line;\n",
        'src/line.ts':
          "import { order } from './order';\nexport const line = order;\n",
      },
      rule: 'no-circular',
    },
    {
      condition: 'production code imports a fixture',
      files: {
        'src/__tests__/order.fixtures.ts': 'export const anOrder = 1;\n',
        'src/order.ts':
          "import { anOrder } from './__tests__/order.fixtures';\nexport const order = anOrder;\n",
      },
      rule: 'no-test-code-in-production',
    },
    {
      condition: 'code imports a package the manifest does not declare',
      files: {
        'src/order.ts':
          "import { ghost } from 'ghost';\nexport const order = ghost;\n",
      },
      rule: 'no-undeclared-dependency',
    },
    {
      condition: 'code imports a module that does not exist',
      files: {
        'src/order.ts':
          "import { line } from './line';\nexport const order = line;\n",
      },
      rule: 'no-unresolvable',
    },
    {
      condition: 'code imports a deprecated package',
      files: {
        'src/order.ts':
          "import { legacy } from 'legacy';\nexport const order = legacy;\n",
      },
      rule: 'no-deprecated-dependency',
    },
    {
      condition: 'production code imports a development dependency',
      files: {
        'src/order.ts':
          "import { devtool } from 'devtool';\nexport const order = devtool;\n",
      },
      rule: 'no-development-dependency-in-production',
    },
  ])('should report $rule when $condition', ({ files, rule }) => {
    // Arrange
    const project = {
      files,
    };

    // Act
    const { violations } = cruise(project);

    // Assert
    expect(violations).toContain(rule);
  });

  test.each([
    {
      condition:
        'production code imports a declared package and its own modules',
      files: {
        'src/line.ts': 'export const line = 1;\n',
        'src/order.ts':
          "import { kit } from 'kit';\nimport { line } from './line';\nexport const order = kit + line;\n",
      },
    },
    {
      condition:
        'production code imports only the types of a development dependency',
      files: {
        'src/order.ts':
          "import type { devtool } from 'devtool';\nexport type Order = typeof devtool;\n",
      },
    },
    {
      condition: 'a hidden folder holds modules that break the rules',
      files: {
        '.cache/order.ts':
          "import { line } from './line';\nexport const order = line;\n",
        'src/order.ts': 'export const order = 1;\n',
      },
    },
    {
      condition: 'a spec imports a fixture and a development dependency',
      files: {
        'src/__tests__/order.fixtures.ts': 'export const anOrder = 1;\n',
        'src/__tests__/order.spec.ts':
          "import { devtool } from 'devtool';\nimport { anOrder } from './order.fixtures';\nexport const checked = devtool + anOrder;\n",
      },
    },
  ])('should report no violation when $condition', ({ files }) => {
    // Arrange
    const project = {
      files,
    };

    // Act
    const { cruised, violations } = cruise(project);

    // Assert
    expect({
      cruisedAny: cruised > 0,
      violations,
    }).toStrictEqual({
      cruisedAny: true,
      violations: [],
    });
  });
});
