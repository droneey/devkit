import globals from 'globals';

const browserConfig = (): object[] => [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

export { browserConfig };
