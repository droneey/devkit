# @droneey/devkit-ts-eslint

Shared ESLint configuration with composable layers for base, environments, and frameworks.

## Install

```bash
npm install -D @droneey/devkit-ts-eslint eslint
```

## Usage

Spread the layers you need:

```ts
// eslint.config.ts
import * as devkitEslint from '@droneey/devkit-ts-eslint';

const config = [
  ...devkitEslint.configs.base,
  ...devkitEslint.configs.node,
  ...devkitEslint.configs.test,
];

export default config;
```

## Available Layers

| Layer         | Purpose                                                                     |
| ------------- | --------------------------------------------------------------------------- |
| `base`        | Core JS/TS rules, import sorting, unicorn, perfectionist, secrets, prettier |
| `node`        | Node.js globals                                                             |
| `browser`     | Browser globals                                                             |
| `test`        | Relaxes strict typing for `.spec.ts` / `.test.ts` files                     |
| `nestjs`      | Relaxes class rules, DI patterns, bumps thresholds                          |
| `react`       | React, react-hooks, jsx-a11y rules                                          |
| `reactNative` | React Native specific rules                                                 |

### Framework Peer Dependencies

React and React Native layers require additional plugins:

```bash
# React
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y

# React Native (in addition to React)
npm install -D eslint-plugin-react-native
```

## Performance

The `base` layer enables type-checked rules (`project: true`) such as `no-floating-promises`, `no-unnecessary-condition`, and `switch-exhaustiveness-check`. These require TypeScript to parse every file during linting, which is significantly slower than syntax-only rules.

This is an intentional tradeoff — type-checked rules catch bugs that are impossible to detect otherwise. If linting speed is critical (e.g. on-save in large codebases), you can disable type-checking per project:

```ts
const config = [
  ...devkitEslint.configs.base,
  {
    languageOptions: {
      parserOptions: { project: false },
    },
  },
];
```

## License

MIT
