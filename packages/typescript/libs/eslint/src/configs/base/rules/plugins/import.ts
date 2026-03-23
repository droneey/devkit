import eslintPluginImportX from 'eslint-plugin-import-x';

const importConfig = [
  {
    plugins: {
      'import-x': eslintPluginImportX,
    },
    rules: {
      'import-x/export': 'warn',
      'import-x/exports-last': 'error',
      'import-x/first': 'warn',
      'import-x/newline-after-import': 'warn',
      'import-x/no-amd': 'warn',
      'import-x/no-anonymous-default-export': 'warn',
      'import-x/no-commonjs': 'warn',
      'import-x/no-default-export': 'warn',
      'import-x/no-duplicates': 'warn',
      'import-x/no-empty-named-blocks': 'warn',
      'import-x/no-import-module-exports': 'warn',
      'import-x/no-mutable-exports': 'warn',
      'import-x/no-self-import': 'warn',
      'import-x/no-unassigned-import': 'warn',

      'import-x/consistent-type-specifier-style': [
        'warn',
        'prefer-top-level',
      ],
      'import-x/no-useless-path-segments': [
        'warn',
        {
          noUselessIndex: true,
        },
      ],
    },
  },
];

export { importConfig };
