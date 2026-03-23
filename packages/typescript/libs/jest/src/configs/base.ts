const baseConfig = {
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testRegex: String.raw`.*\.spec\.ts$`,

  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
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

export { baseConfig };
