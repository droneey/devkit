import globals from 'globals';

const nodeConfig = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'unicorn/prefer-top-level-await': 'off',
    },
  },
];

export { nodeConfig };
