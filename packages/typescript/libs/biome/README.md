# @droneey/devkit-ts-biome

Shared [Biome](https://biomejs.dev) configuration with formatting, linting, and import sorting for TypeScript projects.

## Installation

```bash
bun add -d @droneey/devkit-ts-biome @biomejs/biome
```

Create `biome.json` in your project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.8/schema.json",
  "extends": ["@droneey/devkit-ts-biome/base"]
}
```

## Configuration

### Base

The base config includes:

- **Formatter** -- 80 char line width, 2 spaces, single quotes, semicolons, trailing commas, LF line endings.
- **Linter** -- 100+ rules across correctness, complexity, style, suspicious, performance, and security categories.
- **Assist** -- import sorting, key sorting, interface member sorting.

### Environments

| Config | Description |
|---|---|
| `@droneey/devkit-ts-biome/node` | Node.js environment |
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
| [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) | ESLint type-checked rules for Biome projects |
| [@droneey/devkit-ts-commitlint](https://www.npmjs.com/package/@droneey/devkit-ts-commitlint) | Commit message enforcement |
| [@droneey/devkit-ts-tsconfig](https://www.npmjs.com/package/@droneey/devkit-ts-tsconfig) | TypeScript configuration |

## License

MIT
