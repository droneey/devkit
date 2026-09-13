/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: 'packages-no-cross-import',
      comment:
        'A package reaches another only through a declared dependency and common only at build time, never by importing their files.',
      severity: 'error',
      from: {
        path: '^packages/([^/]+)/libs/([^/]+)/',
      },
      to: {
        path: '^packages/',
        pathNot: '^packages/$1/libs/$2/',
      },
    },
    {
      name: 'common-imports-nothing',
      comment:
        'The common area holds language-agnostic files and imports nothing.',
      severity: 'error',
      from: {
        path: '^packages/common/',
      },
      to: {},
    },
    {
      name: 'root-takes-packages-by-name',
      comment:
        'The root installs its own packages and imports them by name, like any consumer.',
      severity: 'error',
      from: {
        pathNot: '^packages/',
      },
      to: {
        path: '^packages/',
      },
    },
    {
      name: 'no-production-test-imports',
      comment: 'Fakes and fixtures are reachable from tests and nowhere else.',
      severity: 'error',
      from: {
        pathNot: '/__tests__/',
      },
      to: {
        path: '/__tests__/',
      },
    },
    {
      name: 'no-undeclared-dependency',
      comment:
        'A module imports only what the manifest closest to it declares.',
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
      comment: 'An import that resolves to nothing is a missing dependency.',
      severity: 'error',
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'no-circular',
      comment:
        'Circular imports make the module graph impossible to reason about.',
      severity: 'error',
      from: {},
      to: {
        circular: true,
      },
    },
  ],
  options: {
    preserveSymlinks: true,
    tsPreCompilationDeps: true,
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
      ],
    },
  },
};
