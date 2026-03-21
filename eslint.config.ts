import * as DroneeyEslintSetup from '@droneey/devkit-ts-eslint';

const config = [
  {
    ignores: ['.syncpackrc.ts', '**/templates/**', '**/jest-preset.js'],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  ...DroneeyEslintSetup.configs.base,
  ...DroneeyEslintSetup.configs.node,
  ...DroneeyEslintSetup.configs.test,
  {
    files: [
      './packages/typescript/libs/prettier/index.ts',
      './packages/typescript/libs/commitlint/index.ts',
    ],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  {
    files: ['eslint.config.ts', './packages/typescript/libs/eslint/**/*.ts'],

    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
];

export default config;
