# @droneey/devkit-ts-tsconfig

Shared TypeScript configuration variants for different project types.

## Installation

```bash
bun add -d @droneey/devkit-ts-tsconfig typescript
```

Add to your `tsconfig.json`:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/base"
}
```

## Configuration

### Variants

| Config | Extends | Description |
|---|---|---|
| `base` | -- | Strict TypeScript with ESM, all strict checks enabled |
| `node-esm` | `base` | Node.js with ESM modules |
| `node-cjs` | `base` | Node.js with CommonJS modules |
| `browser` | `base` | Browser with DOM types |
| `mobile` | `base` | React Native with JSX |

### Base Config

- `strict: true` with all strict flags enabled.
- `target: ESNext`, `module: ESNext`.
- `verbatimModuleSyntax: true` -- enforces type-only imports.
- `noUncheckedSideEffectImports: true` -- checks all imports.
- `skipLibCheck: true` -- faster builds.

### Usage Examples

Node.js ESM project:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/node-esm"
}
```

React Native project:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/mobile"
}
```

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) | ESLint type-checked rules |
| [@droneey/devkit-ts-lefthook](https://www.npmjs.com/package/@droneey/devkit-ts-lefthook) | Git hooks (biome, eslint, commit validation) |

## License

MIT
