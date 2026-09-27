/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  extends: '@droneey/devkit-ts-dependency-cruiser/configs/hygiene.mjs',
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
        'The common area holds language-agnostic files and imports nothing; only their specs import the tools that check them.',
      severity: 'error',
      from: {
        path: '^packages/common/',
        pathNot: '/__tests__/',
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
  ],
  options: {
    preserveSymlinks: true,
  },
};
