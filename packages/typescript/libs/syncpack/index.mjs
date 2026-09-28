/** @satisfies {import('syncpack').RcFile} */
const config = {
  formatBugs: false,
  formatRepository: false,
  sortAz: [
    'bin',
    'contributors',
    'dependencies',
    'devDependencies',
    'keywords',
    'peerDependencies',
    'resolutions',
  ],
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
    'packageManager',
    'bin',
    'main',
    'module',
    'types',
    'exports',
    'imports',
    'files',
    'scripts',
    'workspaces',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta',
  ],
  semverGroups: [
    {
      label: 'Use caret ranges for the dependencies of the project',
      range: '^',
      dependencyTypes: [
        'dev',
        'prod',
      ],
    },
  ],
};

/** @satisfies {import('syncpack').RcFile} */
const packages = {
  ...config,
  customTypes: {
    packageVersion: {
      path: 'version',
      strategy: 'version',
    },
  },
  versionGroups: [
    {
      label: 'Every package of the repository shares one version',
      dependencies: [
        'packageVersion',
      ],
      policy: 'sameRange',
    },
    {
      label: "The repository's own packages use the workspace protocol",
      dependencies: [
        '$LOCAL',
      ],
      dependencyTypes: [
        'dev',
        'prod',
      ],
      pinVersion: 'workspace:*',
    },
    {
      label: 'Peer dependencies keep their wider ranges',
      dependencyTypes: [
        'peer',
      ],
      isIgnored: true,
    },
  ],
};

export { config, packages };
