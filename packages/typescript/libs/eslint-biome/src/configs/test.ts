const testConfig = [
  {
    files: [
      '**/*.spec.ts',
      '**/*.test.ts',
      '**/*.spec.tsx',
      '**/*.test.tsx',
    ],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
    },
  },
];

export { testConfig };
