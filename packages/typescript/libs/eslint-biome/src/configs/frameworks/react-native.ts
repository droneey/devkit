import { createRequire } from 'node:module';

const reactNativeConfig = (): object[] => {
  const require = createRequire(import.meta.url);
  const eslintPluginReactNative = require('eslint-plugin-react-native');

  return [
    {
      files: [
        '**/*.tsx',
        '**/*.ts',
      ],
      plugins: {
        'react-native': eslintPluginReactNative,
      },
      rules: {
        'react-native/no-color-literals': 'warn',
        'react-native/no-inline-styles': 'warn',
        'react-native/no-raw-text': 'error',
        'react-native/no-single-element-style-arrays': 'error',
        'react-native/no-unused-styles': 'error',
        'react-native/split-platform-components': 'warn',

        'react-native/sort-styles': [
          'warn',
          'asc',
        ],
      },
    },
  ];
};

export { reactNativeConfig };
