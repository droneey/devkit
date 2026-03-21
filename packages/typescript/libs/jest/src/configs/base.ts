const baseConfig = {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testEnvironment: 'node',
  testRegex: String.raw`.*\.spec\.ts$`,
  transform: { '^.+\\.[tj]sx?$': 'ts-jest' },
};

export { baseConfig };
