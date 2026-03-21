import * as Commitlint from '@commitlint/types';

const baseConfig: Commitlint.UserConfig = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'body-empty': [Commitlint.RuleConfigSeverity.Error, 'always'],
    'footer-empty': [Commitlint.RuleConfigSeverity.Error, 'always'],
    'header-case': [Commitlint.RuleConfigSeverity.Disabled],

    'body-case': [
      Commitlint.RuleConfigSeverity.Error,
      'always',
      'sentence-case',
    ],
    'subject-case': [
      Commitlint.RuleConfigSeverity.Error,
      'always',
      'sentence-case',
    ],
    'type-enum': [
      Commitlint.RuleConfigSeverity.Error,
      'always',
      [
        // A new feature
        'feat',
        // A bug fix
        'fix',
        // A code change that improves performance
        'perf',
        // A code change that neither fixes a bug nor adds a feature
        'refactor',
        // Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
        'style',
        // Adding missing tests or correcting existing tests
        'test',
        // Documentation only changes
        'docs',
        // Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        'build',
        // Changes to CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
        'ci',
        // Other changes that don't modify src or test files
        'chore',
      ],
    ],
  },
};

export { baseConfig };
