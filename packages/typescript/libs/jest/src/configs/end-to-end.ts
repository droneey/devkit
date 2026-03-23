const END_TO_END_TEST_TIMEOUT = 30_000;

const endToEndConfig = {
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: String.raw`.*\.e2e-spec\.ts$`,
  testTimeout: END_TO_END_TEST_TIMEOUT,

  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
  ],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
};

export { endToEndConfig };
