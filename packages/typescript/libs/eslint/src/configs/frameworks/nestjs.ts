import {
  baseNamingConvention,
  privateMemberConvention,
} from '../shared/index.ts';

const nestjsConfig = [
  {
    files: [
      '**/*.ts',
    ],
    rules: {
      '@typescript-eslint/init-declarations': 'off',
      // NestJS dependency injection patterns require more constructor parameters
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      'import-x/no-commonjs': 'off',
      'no-empty-function': 'off',
      'unicorn/prefer-top-level-await': 'off',

      '@typescript-eslint/max-params': [
        'error',
        {
          max: 5,
        },
      ],
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
      'max-statements': [
        'warn',
        {
          max: 20,
        },
      ],
    },
  },
];

export { nestjsConfig };
