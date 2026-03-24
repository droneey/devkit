const baseNamingConvention = [
  {
    leadingUnderscore: 'forbid',
    selector: 'default',
    trailingUnderscore: 'forbid',

    format: [
      'strictCamelCase',
    ],
  },
  {
    selector: 'import',

    format: [
      'strictCamelCase',
      'StrictPascalCase',
    ],
  },
  {
    selector: 'variable',

    format: [
      'strictCamelCase',
      'UPPER_CASE',
    ],
    modifiers: [
      'const',
    ],
  },
  {
    format: [
      'StrictPascalCase',
    ],
    selector: [
      'typeLike',
      'enumMember',
    ],
  },
  {
    selector: 'interface',

    custom: {
      match: false,
      regex: '^I[A-Z]',
    },
    format: [
      'StrictPascalCase',
    ],
  },
  {
    selector: 'typeParameter',

    format: [
      'StrictPascalCase',
    ],
    prefix: [
      'T',
    ],
  },
  {
    format: null,
    selector: 'objectLiteralProperty',
  },
  {
    selector: 'variable',

    format: [
      'StrictPascalCase',
    ],
    prefix: [
      'is',
      'should',
      'has',
      'can',
      'did',
      'will',
    ],
    types: [
      'boolean',
    ],
  },
] as const;

const privateMemberConvention = (
  leadingUnderscore: 'allow' | 'forbid' | 'require',
): {
  format: [
    'strictCamelCase',
  ];
  leadingUnderscore: 'allow' | 'forbid' | 'require';
  modifiers: [
    'private',
  ];
  selector: 'memberLike';
} => ({
  leadingUnderscore,
  selector: 'memberLike',

  format: [
    'strictCamelCase',
  ],
  modifiers: [
    'private',
  ],
});

export { baseNamingConvention, privateMemberConvention };
