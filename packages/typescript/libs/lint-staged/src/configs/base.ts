const baseConfig = {
  '*.{ts,tsx,js,jsx,json,md,yaml,yml}': [
    'prettier --write',
  ],
  '*.{ts,tsx}': [
    'eslint --fix',
  ],
};

export { baseConfig };
