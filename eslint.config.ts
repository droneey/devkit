import * as DroneeyBiomeEslint from '@droneey/devkit-ts-eslint-biome';

const config = [
  {
    ignores: [
      '.syncpackrc.*',
      '**/templates/**',
      '**/jest-preset.js',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...DroneeyBiomeEslint.configs.base,
  ...DroneeyBiomeEslint.configs.node,
  ...DroneeyBiomeEslint.configs.test,
  {
    files: [
      'eslint.config.ts',
      './packages/typescript/libs/eslint/**/*.ts',
      './packages/typescript/libs/eslint-biome/**/*.ts',
    ],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
];

export default config;
