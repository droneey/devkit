const baseConfig = {
  '*.{ts,tsx,js,jsx,json,md,yaml,yml}': [
    'biome check --write --no-errors-on-unmatched',
  ],
  '*.{ts,tsx}': [
    'eslint --fix',
  ],
};

export { baseConfig };
