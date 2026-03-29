import globals from 'globals';

const nodeConfig = (): object[] => [
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];

export { nodeConfig };
