# @droneey/devkit-ts-eslint

Shared ESLint configuration with composable layers for base, environments, and frameworks. Full-featured setup with Prettier, TypeScript, unicorn, perfectionist, import, and secrets plugins.

## Installation

```bash
bun add -d @droneey/devkit-ts-eslint eslint typescript-eslint
```

Create `eslint.config.ts` in your project root:

```ts
import * as devkit from '@droneey/devkit-ts-eslint';

export default [
  ...devkit.configs.base,
  ...devkit.configs.node,
  ...devkit.configs.test,
];
```

## Configuration

### Base

Includes all plugins and rules:

- **JavaScript** -- 70+ core rules (curly, eqeqeq, no-var, prefer-const, etc.).
- **TypeScript** -- 40+ type-checked rules with `project: true`.
- **Unicorn** -- 60+ modern JS best practices.
- **Perfectionist** -- 19 sorting rules (imports, classes, interfaces, objects, etc.).
- **Import** -- import ordering, no default exports, no CommonJS.
- **Secrets** -- detects hardcoded API keys and tokens.
- **Prettier** -- disables formatting rules that conflict with Prettier.

### Environments

| Config | Description |
|---|---|
| `configs.node` | Node.js globals |
| `configs.browser` | Browser globals |

### Frameworks

| Config | Description | Peer Dependencies |
|---|---|---|
| `configs.nestjs` | NestJS DI patterns, relaxed naming | -- |
| `configs.react` | React, hooks, JSX a11y rules | `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` |
| `configs.reactNative` | React Native plugin rules | `eslint-plugin-react-native` |

```ts
export default [
  ...devkit.configs.base,
  ...devkit.configs.node,
  ...devkit.configs.nestjs,
  ...devkit.configs.test,
];
```

### Test

Relaxes strict rules for test files (`*.spec.ts`, `*.test.ts`, `*.spec.tsx`, `*.test.tsx`):

- Disables `naming-convention`, `no-explicit-any`, `no-unsafe-*`, `no-magic-numbers`, `no-secrets`.
- Allows flexible typing for mocks and fixtures.

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-prettier](https://www.npmjs.com/package/@droneey/devkit-ts-prettier) | Prettier configuration |
| [@droneey/devkit-ts-lint-staged-eslint](https://www.npmjs.com/package/@droneey/devkit-ts-lint-staged-eslint) | lint-staged for ESLint + Prettier projects |

## License

MIT
