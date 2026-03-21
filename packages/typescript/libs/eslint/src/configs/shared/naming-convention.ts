const baseNamingConvention = [
  {
    format: ['strictCamelCase'],
    leadingUnderscore: 'forbid',
    selector: 'default',
    trailingUnderscore: 'forbid',
  },
  {
    format: ['strictCamelCase', 'StrictPascalCase'],
    selector: 'import',
  },
  {
    format: ['strictCamelCase', 'UPPER_CASE'],
    modifiers: ['const'],
    selector: 'variable',
  },
  {
    format: ['StrictPascalCase'],
    selector: ['typeLike', 'enumMember'],
  },
  {
    format: ['StrictPascalCase'],
    selector: 'interface',

    custom: {
      match: false,
      regex: '^I[A-Z]',
    },
  },
  {
    format: ['StrictPascalCase'],
    prefix: ['T'],
    selector: 'typeParameter',
  },
  {
    format: null,
    selector: 'objectLiteralProperty',
  },
  {
    format: ['StrictPascalCase'],
    prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
    selector: 'variable',
    types: ['boolean'],
  },
] as const;

const privateMemberConvention = (
  leadingUnderscore: 'allow' | 'forbid' | 'require',
): {
  format: ['strictCamelCase'];
  leadingUnderscore: 'allow' | 'forbid' | 'require';
  modifiers: ['private'];
  selector: 'memberLike';
} => ({
  format: ['strictCamelCase'],
  leadingUnderscore,
  modifiers: ['private'],
  selector: 'memberLike',
});

export { baseNamingConvention, privateMemberConvention };
