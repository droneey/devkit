# @droneey/devkit-ts-tsconfig

Shared TypeScript configuration variants for different project types.

## Installation

```bash
bun add -d @droneey/devkit-ts-tsconfig typescript
```

Add to your `tsconfig.json`:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/base.json"
}
```

## Configuration

### Variants

| Config | Extends | Description |
|---|---|---|
| `configs/base.json` | -- | Strict TypeScript with ESM, all strict checks enabled |
| `configs/node-esm.json` | `base` | Node.js with ESM modules |
| `configs/node-cjs.json` | `base` | Node.js with CommonJS modules |
| `configs/browser.json` | `base` | Browser with DOM types |
| `configs/react-native.json` | `base` | React Native with JSX |

### Base Config

- `strict: true` with all strict flags enabled.
- `target: ES2023`, `module: ESNext`.
- `verbatimModuleSyntax: true` -- enforces type-only imports.
- `noUncheckedSideEffectImports: true` -- checks all imports.
- `skipLibCheck: true` -- faster builds.

### Usage Examples

Node.js ESM project:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/node-esm.json"
}
```

React Native project:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/react-native.json"
}
```

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) | ESLint type-checked rules |
| [@droneey/devkit-ts-commitlint](https://www.npmjs.com/package/@droneey/devkit-ts-commitlint) | Commit message enforcement |

## License

MIT
