import type { Linter } from 'eslint';

export declare const configs: {
  base: () => Linter.Config[];
  browser: () => Linter.Config[];
  nestjs: () => Linter.Config[];
  node: () => Linter.Config[];
  react: () => Linter.Config[];
  reactNative: () => Linter.Config[];
  test: () => Linter.Config[];
};
