import { baseNamingConvention, privateMemberConvention } from '../shared';

const nestjsConfig = [
  {
    files: ['**/*.ts'],

    rules: {
      '@typescript-eslint/init-declarations': 'off',
      // NestJS dependency injection patterns require more constructor parameters
      '@typescript-eslint/max-params': ['error', { max: 5 }],
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      'import-x/no-commonjs': 'off',
      'max-statements': ['warn', { max: 20 }],
      'no-empty-function': 'off',
      'unicorn/prefer-top-level-await': 'off',

      '@typescript-eslint/naming-convention': [
        'error',
        ...baseNamingConvention,
        privateMemberConvention('allow'),
      ],
      'max-lines-per-function': [
        'warn',
        {
          IIFEs: true,
          max: 100,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
  },
];

export { nestjsConfig };
