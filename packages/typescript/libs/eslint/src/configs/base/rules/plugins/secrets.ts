import eslintPluginNoSecrets from 'eslint-plugin-no-secrets';

const secretsConfig = [
  {
    plugins: {
      'no-secrets': eslintPluginNoSecrets,
    },
    rules: {
      'no-secrets/no-secrets': 'error',
    },
  },
];

export { secretsConfig };
