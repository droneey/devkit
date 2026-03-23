module.exports = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
  ],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.e2e-spec\\.ts$',
  testTimeout: 30_000,
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
};
