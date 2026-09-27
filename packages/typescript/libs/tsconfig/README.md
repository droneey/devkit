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

### Presets

A project extends the **environment** its code runs in, then the **framework** it compiles, in that order. An environment brings the globals that exist there; a framework only adds its own options, so it always follows an environment or `base`. Never two environments: browser code given Bun's types would compile `Bun.file()` and fail at run time.

| Preset | Kind | Adds to `base` |
|---|---|---|
| `base` | — | Strict TypeScript, ESNext, no DOM, no ambient types chosen |
| `browser` | environment | the DOM, and no ambient `@types` (`types: []`) |
| `node` | environment | Node's types (`types: ["node"]`; the project installs `@types/node`) |
| `bun` | environment | Bun's types (`types: ["bun"]`; the project installs `@types/bun`) |
| `react` | framework | JSX with the automatic runtime |
| `nestjs` | framework | legacy decorators with their metadata, `esModuleInterop`, declarations, incremental builds; `verbatimModuleSyntax`, `.ts` import extensions and `strictPropertyInitialization` off |

### Base Config

- `strict: true` with all strict flags enabled.
- `exactOptionalPropertyTypes: true` -- an optional property may be absent, but holds `undefined` only when its type says so.
- `target: ESNext`, `module: ESNext`.
- `verbatimModuleSyntax: true` -- enforces type-only imports.
- `noUncheckedSideEffectImports: true` -- checks all imports.
- `skipLibCheck: true` -- faster builds.

### Usage Examples

A command-line tool on Bun:

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/bun"
}
```

A React application in the browser:

```json
{
  "extends": [
    "@droneey/devkit-ts-tsconfig/browser",
    "@droneey/devkit-ts-tsconfig/react"
  ]
}
```

A NestJS API on Node:

```json
{
  "extends": [
    "@droneey/devkit-ts-tsconfig/node",
    "@droneey/devkit-ts-tsconfig/nestjs"
  ]
}
```

A React Native application:

```json
{
  "extends": [
    "@droneey/devkit-ts-tsconfig/base",
    "@droneey/devkit-ts-tsconfig/react"
  ]
}
```

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-lefthook](https://www.npmjs.com/package/@droneey/devkit-ts-lefthook) | Git hooks (biome, commit validation) |

## License

MIT
