# @droneey/devkit-ts-biome

Shared [Biome](https://biomejs.dev) configuration with formatting, linting, and import sorting for TypeScript projects.

## Installation

```bash
bun add -d @droneey/devkit-ts-biome @biomejs/biome
```

Create `biome.json` in your project root:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["@droneey/devkit-ts-biome/base"]
}
```

Run it in the check as `biome check --error-on-warnings`, so a warning of Biome's recommended rules fails it too; the presets themselves set every rule to `error`.

## Configuration

### Base

The base config includes:

- **Formatter** -- 80 char line width, 2 spaces, single quotes, semicolons, trailing commas, LF line endings.
- **Linter** -- 100+ rules across correctness, complexity, style, suspicious, performance, and security categories, all at `error`: a function body of at most 100 lines, a file of at most 500, cognitive complexity of at most 10, one positional parameter, strict equality with `null` too, no `any`, no non-null assertion, no console output.
- **Assist** -- import sorting, duplicate class detection, interface member sorting.

### Tests

`test` applies to `**/__tests__/**` and every `*.spec.ts(x)`: specs have no line limits, and keep `any` and `!` out like any other code.

### Environments

| Config | Description |
|---|---|
| `@droneey/devkit-ts-biome/node` | Node.js environment |
| `@droneey/devkit-ts-biome/bun` | Bun environment: the same rules as Node's, under the name the tsconfig preset uses |
| `@droneey/devkit-ts-biome/browser` | Browser environment |

```json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/node"
  ]
}
```

### Frameworks

| Config | Description |
|---|---|
| `@droneey/devkit-ts-biome/react` | React component rules, hooks, JSX a11y |
| `@droneey/devkit-ts-biome/react-native` | React Native specific rules |
| `@droneey/devkit-ts-biome/nestjs` | NestJS patterns |

```json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/react"
  ]
}
```

### Test

Relaxes strict rules for test files (`*.spec.ts`, `*.test.ts`).

```json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-tsconfig](https://www.npmjs.com/package/@droneey/devkit-ts-tsconfig) | TypeScript configuration |
| [@droneey/devkit-ts-lefthook](https://www.npmjs.com/package/@droneey/devkit-ts-lefthook) | Git hooks (biome, commit validation) |

## License

MIT
