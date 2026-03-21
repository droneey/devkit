const END_TO_END_TEST_TIMEOUT = 30_000;

const endToEndConfig = {
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: String.raw`.*\.e2e-spec\.ts$`,
  testTimeout: END_TO_END_TEST_TIMEOUT,
  transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
};

export { endToEndConfig };
