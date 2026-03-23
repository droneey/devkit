import eslintTs from 'typescript-eslint';

import {
  baseNamingConvention,
  privateMemberConvention,
} from '../../shared/index.ts';

const IGNORED_MAGIC_NUMBERS = [
  0,
  1,
  -1,
];

const typescriptConfig = [
  eslintTs.configs.eslintRecommended,
  ...eslintTs.configs.recommendedTypeChecked,
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
    ],
    languageOptions: {
      parser: eslintTs.parser,

      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/default-param-last': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-dynamic-delete': 'error',
      '@typescript-eslint/no-extraneous-class': 'error',
      '@typescript-eslint/no-invalid-void-type': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/no-meaningless-void-operator': 'error',
      '@typescript-eslint/no-mixed-enums': 'error',
      '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-qualifier': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'error',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/no-useless-empty-export': 'error',
      '@typescript-eslint/parameter-properties': 'error',
      '@typescript-eslint/prefer-literal-enum-member': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/prefer-return-this-type': 'error',
      '@typescript-eslint/prefer-string-starts-ends-with': 'error',
      '@typescript-eslint/promise-function-async': 'error',
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/require-array-sort-compare': 'error',
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'error',

      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: false,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',

          overrides: {
            constructors: 'no-public',
          },
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
      '@typescript-eslint/max-params': [
        'error',
        {
          max: 3,
        },
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
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          enforceConst: true,
          ignore: IGNORED_MAGIC_NUMBERS,
          ignoreClassFieldInitialValues: true,
          ignoreDefaultValues: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true,
          ignoreTypeIndexes: true,
        },
      ],
      '@typescript-eslint/no-unnecessary-parameter-property-assignment':
        'error',
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
