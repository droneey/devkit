import { describe, expect, test } from 'bun:test';

import { config } from '../index.mjs';

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
});
