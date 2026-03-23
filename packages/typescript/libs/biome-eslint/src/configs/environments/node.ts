import globals from 'globals';

const nodeConfig = [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];

export { nodeConfig };
