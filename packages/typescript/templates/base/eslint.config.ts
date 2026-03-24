import * as devkitEslint from '@droneey/devkit-ts-eslint-biome';

const config = [
  ...devkitEslint.configs.base,
  ...devkitEslint.configs.node,
  ...devkitEslint.configs.test,
];

export default config;
