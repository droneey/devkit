// biome-ignore lint/style/noDefaultExport: dependency-cruiser reads a preset's default export
export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-test-code-in-production',
      severity: 'error',
      from: {
        pathNot: '(^|/)(__tests__|e2e)/',
      },
      to: {
        path: '(^|/)(__tests__|e2e)/',
      },
    },
    {
      name: 'no-undeclared-dependency',
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: [
          'npm-no-pkg',
          'npm-unknown',
        ],
      },
    },
    {
      name: 'no-unresolvable',
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'no-deprecated-dependency',
      severity: 'error',
      from: {},
      to: {
        dependencyTypes: [
          'deprecated',
        ],
      },
    },
    {
      name: 'no-development-dependency-in-production',
      severity: 'error',
      from: {
        path: '^src/',
        pathNot: '(^|/)(__tests__|e2e)/',
      },
      to: {
        dependencyTypes: [
          'npm-dev',
        ],
        dependencyTypesNot: [
          'type-only',
        ],
        pathNot: 'node_modules/@types/',
      },
    },
  ],
  options: {
    parser: 'swc',
    builtInModules: {
      add: [
        'bun',
        'bun:test',
      ],
    },
    doNotFollow: {
      path: [
        'node_modules',
      ],
    },
    exclude: {
      path: [
        '(^|/)dist/',
        '\\.gen\\.',
      ],
    },
  },
};
