import eslintPluginPerfectionist from 'eslint-plugin-perfectionist';

const perfectionistConfig = [
  {
    plugins: {
      perfectionist: eslintPluginPerfectionist,
    },
    rules: {
      'perfectionist/sort-array-includes': 'warn',
      'perfectionist/sort-decorators': 'warn',
      'perfectionist/sort-enums': 'warn',
      'perfectionist/sort-exports': 'warn',
      'perfectionist/sort-heritage-clauses': 'warn',
      'perfectionist/sort-maps': 'warn',
      'perfectionist/sort-named-exports': 'warn',
      'perfectionist/sort-named-imports': 'warn',
      'perfectionist/sort-sets': 'warn',
      'perfectionist/sort-switch-case': 'warn',
      'perfectionist/sort-variable-declarations': 'warn',

      'perfectionist/sort-classes': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            'index-signature',
            'static-property',
            'static-block',
            'protected-property',
            'protected-accessor-property',
            'private-property',
            'private-accessor-property',
            'property',
            'accessor-property',
            ['get-method', 'set-method'],
            'constructor',
            'static-method',
            'protected-method',
            'private-method',
            'method',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-imports': [
        'warn',
        {
          environment: 'bun',
          newlinesBetween: 'always',
          tsconfigRootDir: '.',

          customGroups: {
            type: {
              react: ['^react$', '^react-.+'],
            },
            value: {
              react: ['^react$', '^react-.+'],
            },
          },
          groups: [
            'builtin',
            'builtin-type',
            ['react'],
            'external',
            'external-type',
            'internal',
            'internal-type',
            'parent',
            'parent-type',
            'sibling',
            'sibling-type',
            'index',
            'index-type',
            'side-effect',
            'side-effect-style',
            'style',
            'object',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-interfaces': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            [
              'required-index-signature',
              'multiline-required-index-signature',
              'optional-index-signature',
              'multiline-optional-index-signature',
            ],
            [
              'required-property',
              'multiline-required-property',
              'optional-property',
              'multiline-optional-property',
            ],
            [
              'required-method',
              'multiline-required-method',
              'optional-method',
              'multiline-optional-method',
            ],
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-intersection-types': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            'import',
            'keyword',
            'nullish',
            'literal',
            'named',
            'operator',
            'intersection',
            'union',
            'conditional',
            'function',
            'object',
            'tuple',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-jsx-props': [
        'warn',
        {
          groups: ['shorthand', 'multiline', 'callback', 'unknown'],

          customGroups: {
            callback: '^on.+',
          },
        },
      ],
      'perfectionist/sort-modules': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            'declare-enum',
            'enum',
            'export-enum',
            'declare-interface',
            'interface',
            'export-interface',
            'declare-type',
            'type',
            'export-type',
            'declare-decorated-class',
            'declare-class',
            'decorated-class',
            'class',
            'export-decorated-class',
            'export-class',
            'declare-async-function',
            'declare-function',
            'async-function',
            'function',
            'export-async-function',
            'export-function',
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-object-types': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            [
              'required-index-signature',
              'multiline-required-index-signature',
              'optional-index-signature',
              'multiline-optional-index-signature',
            ],
            [
              'required-property',
              'multiline-required-property',
              'optional-property',
              'multiline-optional-property',
            ],
            [
              'required-method',
              'multiline-required-method',
              'optional-method',
              'multiline-optional-method',
            ],
            'unknown',
          ],
        },
      ],
      'perfectionist/sort-objects': [
        'warn',
        {
          groups: ['unknown', 'multiline', 'method'],
          newlinesBetween: 'always',
        },
      ],
      'perfectionist/sort-union-types': [
        'warn',
        {
          newlinesBetween: 'always',

          groups: [
            'import',
            'keyword',
            'nullish',
            'literal',
            'named',
            'operator',
            'intersection',
            'union',
            'conditional',
            'function',
            'object',
            'tuple',
            'unknown',
          ],
        },
      ],
    },
    settings: {
      perfectionist: {
        order: 'asc',
        partitionByComment: true,
        type: 'natural',
      },
    },
  },
];

export { perfectionistConfig };
