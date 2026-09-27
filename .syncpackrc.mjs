import { config } from '@droneey/devkit-ts-syncpack';

/** @type {import('syncpack').RcFile} */
export default {
  ...config,
  versionGroups: [
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
