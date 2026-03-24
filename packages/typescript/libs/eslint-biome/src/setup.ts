import {
  baseConfig,
  browserConfig,
  nestjsConfig,
  nodeConfig,
  reactConfig,
  reactNativeConfig,
  testConfig,
} from './configs/index.ts';

const configs = {
  base: baseConfig,
  browser: browserConfig,
  nestjs: nestjsConfig,
  node: nodeConfig,
  react: reactConfig,
  reactNative: reactNativeConfig,
  test: testConfig,
};

export { configs };
