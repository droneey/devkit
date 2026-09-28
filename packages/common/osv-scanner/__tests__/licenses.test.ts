import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'bun:test';

import { z } from 'zod';

const REPORT = z.object({
  results: z.array(
    z.object({
      packages: z.array(
        z.object({
          // biome-ignore lint/style/useNamingConvention: osv-scanner names the field license_violations
          license_violations: z.array(z.string()).optional(),
          package: z.object({
            name: z.string(),
          }),
        }),
      ),
    }),
  ),
});

const COMMON = resolve(import.meta.dirname, '../..');
const ROOT = resolve(COMMON, '../..');
const ALLOWLIST = readFileSync(
  resolve(COMMON, 'osv-scanner/licenses.txt'),
  'utf8',
)
  .trim()
  .split('\n')
  .join(',');

// mise pins osv-scanner for this repository; its shim does not resolve in a
// temporary folder, so the scan runs the binary it points to.
const OSV_SCANNER = spawnSync(
  'mise',
  [
    'which',
    'osv-scanner',
  ],
  {
    cwd: ROOT,
    encoding: 'utf8',
  },
).stdout.trim();

if (OSV_SCANNER === '') {
  throw new Error(
    'osv-scanner is not installed: run `mise install` in a trusted checkout',
  );
}

const violations = (
  packages: Readonly<Record<string, string>>,
): readonly string[] => {
  const folder = mkdtempSync(join(tmpdir(), 'devkit-osv-scanner-'));

  writeFileSync(
    join(folder, 'package-lock.json'),
    JSON.stringify({
      lockfileVersion: 3,
      name: 'fixture',
      packages: {
        '': {
          dependencies: packages,
          name: 'fixture',
        },
        ...Object.fromEntries(
          Object.entries(packages).map(([name, version]) => [
            `node_modules/${name}`,
            {
              version,
            },
          ]),
        ),
      },
      requires: true,
    }),
  );

  const scanning = spawnSync(
    OSV_SCANNER,
    [
      'scan',
      'source',
      `--licenses=${ALLOWLIST}`,
      '--format',
      'json',
      '.',
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

  const report = REPORT.parse(JSON.parse(scanning.stdout));

  return report.results.flatMap(({ packages: scanned }) =>
    scanned
      .filter(({ license_violations: found }) => (found ?? []).length > 0)
      .map(({ package: { name } }) => name),
  );
};

describe('osv-scanner licence allowlist', () => {
  test('should report a package when its licence is not on the list', () => {
    // Arrange
    const packages = {
      'is-number': '7.0.0',
      'left-pad': '1.3.0',
    };

    // Act
    const found = violations(packages);

    // Assert
    expect(found).toStrictEqual([
      'left-pad',
    ]);
  });

  test('should report nothing when every licence is permissive', () => {
    // Arrange
    const packages = {
      'caniuse-lite': '1.0.30001812',
      'is-number': '7.0.0',
      typescript: '5.9.2',
    };

    // Act
    const found = violations(packages);

    // Assert
    expect(found).toStrictEqual([]);
  });
});
