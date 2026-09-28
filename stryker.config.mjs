import { config } from '@droneey/devkit-ts-stryker';

export default {
  ...config,
  mutate: [
    'packages/typescript/libs/*/src/**/*.ts',
    '!packages/**/__tests__/**',
    '!packages/**/main.ts',
  ],
  ignorePatterns: [
    ...config.ignorePatterns,
    '/.constitution',
  ],
  thresholds: {
    high: 100,
    low: 100,
    break: 100,
  },
};
