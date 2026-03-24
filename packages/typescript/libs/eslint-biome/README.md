# @droneey/devkit-ts-eslint-biome

Lean ESLint configuration for projects using **Biome** as the primary linter and formatter. Contains only the rules that Biome cannot implement — primarily TypeScript type-checked rules that require `project: true`.

## Why both Biome and ESLint?

Biome handles formatting, import sorting, and most linting rules. But it cannot run TypeScript's type checker, which means rules like these are impossible for Biome:

- `no-floating-promises` — catches unhandled async calls
- `no-unnecessary-condition` — catches dead code via type analysis
- `switch-exhaustiveness-check` — catches missing switch cases
- `no-unsafe-type-assertion` — catches unsafe `as` casts
- `naming-convention` — enforces camelCase/PascalCase with type-aware selectors

This package provides only these type-checked rules, with zero overlap with Biome.

## Installation

```bash
bun add -d @droneey/devkit-ts-eslint-biome eslint typescript-eslint
```

## Setup

Create `eslint.config.ts`:

```ts
import * as devkit from '@droneey/devkit-ts-eslint-biome';

export default [
  ...devkit.configs.base,
  ...devkit.configs.node,    // or .browser
  ...devkit.configs.test,
];
```

## Available configs

| Config | Description |
|---|---|
| `configs.base` | Type-checked TypeScript rules with `project: true` |
| `configs.node` | Node.js globals |
| `configs.browser` | Browser globals |
| `configs.test` | Relaxes strict rules for test files (`*.spec.ts`, `*.test.ts`) |
| `configs.nestjs` | NestJS-specific overrides (DI patterns, naming) |
| `configs.react` | Disables naming-convention for JSX files |
| `configs.reactNative` | React Native plugin rules |

## VS Code setup

Use both extensions:
- **Biome** — default formatter + fast linting
- **ESLint** — type-checked rule squiggles

```jsonc
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  }
}
```

## Performance note

Type-checked rules require TypeScript to parse your entire project (`project: true`). This is slower than Biome but catches bugs no other tool can find. ESLint runs only on `*.ts`/`*.tsx` files — Biome handles everything else at full speed.

## Related packages

- [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) — Biome configuration (formatter + linter)
- [@droneey/devkit-ts-lint-staged-biome](https://www.npmjs.com/package/@droneey/devkit-ts-lint-staged-biome) — lint-staged for Biome + ESLint projects
- [@droneey/devkit-ts-eslint](https://www.npmjs.com/package/@droneey/devkit-ts-eslint) — Full ESLint config for legacy (non-Biome) projects

## License

MIT
