# @droneey/devkit-ts-eslint-biome

Lean ESLint configuration for Biome projects. Contains only TypeScript type-checked rules that Biome cannot implement.

## Installation

```bash
bun add -d @droneey/devkit-ts-eslint-biome eslint typescript-eslint
```

Create `eslint.config.ts` in your project root:

```ts
import * as devkit from '@droneey/devkit-ts-eslint-biome';

export default [
  ...devkit.configs.base,
  ...devkit.configs.node,
  ...devkit.configs.test,
];
```

## Configuration

### Base

Type-checked rules requiring `project: true`:

- `no-floating-promises` -- catches unhandled async calls.
- `no-unnecessary-condition` -- catches dead code via type analysis.
- `switch-exhaustiveness-check` -- catches missing switch cases.
- `no-unsafe-type-assertion` -- catches unsafe `as` casts.
- `naming-convention` -- enforces camelCase/PascalCase with type-aware selectors.
- `consistent-type-exports` -- enforces type-only exports.

### Environments

| Config | Description |
|---|---|
| `configs.node` | Node.js globals |
| `configs.browser` | Browser globals |

### Frameworks

| Config | Description | Peer Dependencies |
|---|---|---|
| `configs.nestjs` | NestJS DI patterns, relaxed naming | -- |
| `configs.react` | Disables naming-convention for JSX | -- |
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

- Disables `naming-convention`, `explicit-module-boundary-types`, `no-explicit-any`, `no-unsafe-*`.
- Allows flexible typing for mocks and fixtures.

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-tsconfig](https://www.npmjs.com/package/@droneey/devkit-ts-tsconfig) | TypeScript configuration |
| [@droneey/devkit-ts-lefthook](https://www.npmjs.com/package/@droneey/devkit-ts-lefthook) | Git hooks (biome, eslint, commit validation) |

## License

MIT
