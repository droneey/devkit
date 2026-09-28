import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { config } from '../index.mjs';

const PACKAGE_DIR = resolve(import.meta.dirname, '..');
const SYNCPACK = resolve(PACKAGE_DIR, '../../../../node_modules/.bin/syncpack');

interface Manifest {
  devDependencies?: Readonly<Record<string, string>>;
  name: string;
  peerDependencies?: Readonly<Record<string, string>>;
  version: string;
}

const workspace = (
  packages: readonly Manifest[],
): Readonly<Record<string, Manifest | object>> => ({
  'package.json': {
    name: 'root',
    private: true,
    version: '1.0.0',
    workspaces: [
      'packages/*',
    ],
  },
  ...Object.fromEntries(
    packages.map((manifest) => [
      `packages/${manifest.name}/package.json`,
      manifest,
    ]),
  ),
});

const issues = (packages: readonly Manifest[]): readonly string[] => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-syncpack-'));

  for (const [path, manifest] of Object.entries(workspace(packages))) {
    mkdirSync(dirname(join(folder, path)), {
      recursive: true,
    });
    writeFileSync(join(folder, path), JSON.stringify(manifest));
  }
  writeFileSync(
    join(folder, '.syncpackrc.mjs'),
    `export { packages as default } from '${resolve(PACKAGE_DIR, 'index.mjs')}';\n`,
  );

  const linting = spawnSync(
    SYNCPACK,
    [
      'lint',
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

  return [
    ...new Set(
      [
        ...`${linting.stdout}${linting.stderr}`.matchAll(/✘ [^(]*\((\w+)\)/g),
      ].map(([, kind]) => kind ?? ''),
    ),
  ];
};

describe('syncpack config', () => {
  test('should put the identity of a package first and its dependencies last when a manifest is formatted', () => {
    // Arrange
    const identity = [
      'name',
      'version',
      'private',
    ];
    const dependencies = [
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'peerDependenciesMeta',
    ];

    // Act
    const order = config.sortFirst;

    // Assert
    expect(order.slice(0, identity.length)).toStrictEqual(identity);
    expect(order.slice(-dependencies.length)).toStrictEqual(dependencies);
  });

  test('should leave the scripts in the order the author chose when a manifest is formatted', () => {
    // Arrange
    const field = 'scripts';

    // Act
    const sorted = config.sortAz;

    // Assert
    expect(sorted).not.toContain(field);
  });

  test('should ask for caret ranges on the project dependencies only when the versions are linted', () => {
    // Arrange
    const caretRanges: (typeof config.semverGroups)[number] = {
      label: 'Use caret ranges for the dependencies of the project',
      range: '^',
      dependencyTypes: [
        'dev',
        'prod',
      ],
    };

    // Act
    const groups = config.semverGroups;

    // Assert
    expect(groups).toStrictEqual([
      caretRanges,
    ]);
  });

  test.each([
    {
      condition: 'two packages are at different versions',
      packages: [
        {
          name: 'a',
          version: '1.0.0',
        },
        {
          name: 'b',
          version: '1.1.0',
        },
      ],
      reported: 'SameRangeMismatch',
    },
    {
      condition:
        "a package takes the repository's own package from the registry",
      packages: [
        {
          name: 'a',
          version: '1.0.0',
        },
        {
          devDependencies: {
            a: '^1.0.0',
          },
          name: 'b',
          version: '1.0.0',
        },
      ],
      reported: 'DiffersToPin',
    },
  ])(
    'should report $reported when $condition in a repository of packages',
    ({ packages, reported }) => {
      // Arrange
      const repository = packages;

      // Act
      const found = issues(repository);

      // Assert
      expect(found).toContain(reported);
    },
  );

  test('should report nothing when the packages share a version, link each other and keep wide peer ranges', () => {
    // Arrange
    const repository = [
      {
        name: 'a',
        version: '1.0.0',
      },
      {
        devDependencies: {
          a: 'workspace:*',
        },
        name: 'b',
        peerDependencies: {
          a: '>=1.0.0',
        },
        version: '1.0.0',
      },
    ];

    // Act
    const found = issues(repository);

    // Assert
    expect(found).toStrictEqual([]);
  });
});
