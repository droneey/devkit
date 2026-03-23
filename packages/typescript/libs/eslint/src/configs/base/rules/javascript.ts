import eslintJs from '@eslint/js';

const javascriptConfig = [
  eslintJs.configs.recommended,
  {
    rules: {
      'consistent-return': 'error',
      curly: 'error',
      'default-case-last': 'error',
      'dot-notation': 'error',
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-constructor-return': 'error',
      'no-else-return': 'error',
      'no-empty-function': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-implicit-coercion': 'error',
      'no-implicit-globals': 'error',
      'no-inline-comments': 'error',
      'no-iterator': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-negated-condition': 'error',
      'no-nested-ternary': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-param-reassign': 'error',
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-throw-literal': 'error',
      'no-undefined': 'off',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': 'error',
      'no-useless-assignment': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'require-atomic-updates': 'error',
      'require-await': 'error',
      'require-unicode-regexp': 'error',
      'symbol-description': 'error',

      'accessor-pairs': [
        'error',
        {
          getWithoutSet: false,
          setWithoutGet: false,
        },
      ],
      'array-callback-return': [
        'error',
        {
          checkForEach: true,
        },
      ],
      'arrow-body-style': [
        'error',
        'as-needed',
      ],
      'capitalized-comments': [
        'error',
        'always',
      ],
      complexity: [
        'warn',
        {
          max: 8,
        },
      ],
      eqeqeq: [
        'error',
        'always',
      ],
      'func-names': [
        'error',
        'as-needed',
      ],
      'func-style': [
        'error',
        'expression',
      ],
      'grouped-accessor-pairs': [
        'error',
        'getBeforeSet',
      ],
      'logical-assignment-operators': [
        'error',
        'always',
      ],
      'max-classes-per-file': [
        'warn',
        {
          max: 1,
        },
      ],
      'max-depth': [
        'warn',
        {
          max: 3,
        },
      ],
      'max-lines': [
        'warn',
        {
          max: 300,
        },
      ],
      'max-lines-per-function': [
        'warn',
        {
          IIFEs: true,
          max: 75,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'max-nested-callbacks': [
        'warn',
        {
          max: 3,
        },
      ],
      'max-statements': [
        'warn',
        {
          max: 15,
        },
      ],
      'no-duplicate-imports': [
        'error',
        {
          includeExports: true,
        },
      ],
      'no-irregular-whitespace': [
        'error',
        {
          skipComments: false,
          skipJSXText: false,
          skipRegExps: false,
          skipStrings: false,
          skipTemplates: false,
        },
      ],
      'object-shorthand': [
        'error',
        'always',
        {
          avoidExplicitReturnArrows: true,
          avoidQuotes: true,
        },
      ],
      'operator-assignment': [
        'error',
        'always',
      ],
      radix: [
        'error',
        'as-needed',
      ],
      yoda: [
        'error',
        'never',
      ],
    },
  },
];

export { javascriptConfig };
