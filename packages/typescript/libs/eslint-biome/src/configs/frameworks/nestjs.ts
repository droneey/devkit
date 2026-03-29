import {
  baseNamingConvention,
  privateMemberConvention,
} from '../shared/index.ts';

const nestjsConfig = (): object[] => [
  {
    files: [
      '**/*.ts',
    ],
    rules: {
      '@typescript-eslint/init-declarations': 'off',
      // NestJS dependency injection patterns require more constructor parameters
      '@typescript-eslint/no-extraneous-class': 'off',

      '@typescript-eslint/naming-convention': [
        'error',
        ...baseNamingConvention,
        privateMemberConvention('allow'),
      ],
    },
  },
];

export { nestjsConfig };
