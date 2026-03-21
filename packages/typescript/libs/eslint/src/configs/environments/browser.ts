import globals from 'globals';

const browserConfig = [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
];

export { browserConfig };
