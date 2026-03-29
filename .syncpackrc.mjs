/** @type {import('syncpack').RcFile} */
const config = {
  sortFirst: [
    'name',
    'version',
    'private',
    'description',
    'keywords',
    'homepage',
    'bugs',
    'license',
    'author',
    'repository',
    'type',
    'main',
    'module',
    'types',
    'scripts',
    'workspaces',
    'files',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
  ],
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
  semverGroups: [
    {
      label: 'Use caret ranges for all dependencies',
      range: '^',
      dependencyTypes: [
        'dev',
        'prod',
        'peer',
      ],
    },
  ],
};

export default config;
