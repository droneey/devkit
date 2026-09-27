import { config } from '@droneey/devkit-ts-syncpack';

/** @type {import('syncpack').RcFile} */
export default {
  ...config,
  versionGroups: [
    {
      label: 'The constitution comes from git by its release tag',
      dependencies: [
        '@droneey/constitution',
      ],
      isIgnored: true,
    },
    {
      label: 'Workspace packages use workspace protocol',
      dependencies: [
        '@droneey/**',
      ],
      dependencyTypes: [
        'dev',
      ],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Peer dependencies intentionally use wider ranges',
      dependencyTypes: [
        'peer',
      ],
      isIgnored: true,
    },
    {
      label: 'Ignore root-only dependencies',
      dependencies: [
        'syncpack',
      ],
      isIgnored: true,
    },
  ],
};
