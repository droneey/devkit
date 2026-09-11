import { describe, expect, test } from 'bun:test';

import { config } from '../index.mjs';

describe('syncpack config', () => {
  test('puts the identity of a package first and its dependencies last', () => {
    // Assert
    expect(config.sortFirst.slice(0, 3)).toStrictEqual([
      'name',
      'version',
      'private',
    ]);
    expect(config.sortFirst.slice(-4)).toStrictEqual([
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'peerDependenciesMeta',
    ]);
  });

  test('leaves the scripts in the order the author chose', () => {
    // Assert
    expect(config.sortAz).not.toContain('scripts');
  });

  test('asks for caret ranges on the project dependencies only', () => {
    // Assert
    expect(config.semverGroups).toStrictEqual([
      {
        label: 'Use caret ranges for the dependencies of the project',
        range: '^',
        dependencyTypes: [
          'dev',
          'prod',
        ],
      },
    ]);
  });
});
