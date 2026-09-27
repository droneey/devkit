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
- **Linter** -- 100+ rules across correctness, complexity, style, suspicious, performance, and security categories, all at `error`: a function body of at most 100 lines, a file of at most 500, cognitive complexity of at most 10, at most three positional parameters, strict equality with `null` too, no `any`, no non-null assertion, no console output.
- **GritQL plugins** -- no bare verb as a function name (`handle`, `process`, `get`…), no `.json<T>()` cast of a response body, type names without an `I` prefix or a `Type`/`Interface` suffix.
- **Assist** -- import sorting, duplicate class detection, interface member sorting.

### Tests

`test` applies to `**/__tests__/**` and every `*.spec.ts(x)` and `*.test.ts(x)`: specs have no line limits, keep `any` and `!` out like any other code, and compare with `toStrictEqual`.

### CSS

`css` holds the rules of stylesheets and the classes they declare: no undeclared or unused class, no undeclared custom property, a valid `@property` initial value, named cascade layers, a cap on classes in a selector. Extend it in a repository with CSS files.

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
| `@droneey/devkit-ts-biome/react` | React component rules, hooks, JSX a11y; function components only, and no legacy API (`useContext`, `<Context.Provider>`, `defaultProps`, `createRef`, string refs) |
| `@droneey/devkit-ts-biome/react-dom` | React in the browser: DOM attributes as the DOM spells them, ids from `useId`, `autoComplete` on fields for the user's own data, Testing Library queries by role, label and text |
| `@droneey/devkit-ts-biome/tailwind` | Tailwind: no arbitrary values (in `className`, `cva`, `cn`, `clsx`, `twMerge`; one that only reads a token's variable, such as `bg-[var(--color-surface)]`, carries a `biome-ignore` with its reason), `h-dvh` over `h-screen`, no `max-*:` breakpoints |
| `@droneey/devkit-ts-biome/react-native` | React Native specific rules |
| `@droneey/devkit-ts-biome/nestjs` | NestJS patterns |

```json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/browser",
    "@droneey/devkit-ts-biome/react",
    "@droneey/devkit-ts-biome/react-dom",
    "@droneey/devkit-ts-biome/tailwind"
  ]
}
```

### Test

Relaxes strict rules for test files (`__tests__`, `*.spec.ts(x)`, `*.test.ts(x)`).

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
