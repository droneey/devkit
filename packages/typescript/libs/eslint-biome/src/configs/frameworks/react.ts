const reactConfig = (): object[] => [
  {
    files: [
      '**/*.tsx',
      '**/*.jsx',
    ],
    rules: {
      '@typescript-eslint/naming-convention': 'off',
    },
  },
];

export { reactConfig };
