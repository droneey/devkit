import eslintTs from 'typescript-eslint';

import {
  baseNamingConvention,
  privateMemberConvention,
} from '../../shared/index.ts';

const typescriptConfig = [
  ...eslintTs.configs.recommendedTypeChecked,
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      parser: eslintTs.parser,

      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      // Disabled — Biome handles these
      '@typescript-eslint/default-param-last': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-empty-export': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/prefer-literal-enum-member': 'off',
      '@typescript-eslint/require-array-sort-compare': 'off',
      '@typescript-eslint/unified-signatures': 'off',

      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Type-checked rules — Biome can't do these
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-parameter-property-assignment':
        'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'error',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',

      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: false,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        {
          allowHigherOrderFunctions: false,
        },
      ],
      '@typescript-eslint/init-declarations': [
        'error',
        'always',
      ],
      '@typescript-eslint/method-signature-style': [
        'error',
        'method',
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        ...baseNamingConvention,
        privateMemberConvention('require'),
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          checkThenables: true,
        },
      ],
      '@typescript-eslint/return-await': [
        'error',
        'always',
      ],
      '@typescript-eslint/switch-exhaustiveness-check': [
        'error',
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          considerDefaultExhaustiveForUnions: true,
          requireDefaultForNonUnion: true,
        },
      ],
    },
  },
];

export { typescriptConfig };
