# @droneey/devkit-ts-lint-staged-biome

Shared [lint-staged](https://github.com/lint-staged/lint-staged) configuration for projects using **Biome + ESLint**.

Runs Biome for formatting and fast linting, then ESLint for type-checked rules — on staged files only.

## What it does

| Staged files | Command |
|---|---|
| `*.{ts,tsx,js,jsx,json,md,yaml,yml}` | `biome check --write` |
| `*.{ts,tsx}` | `eslint --fix` |

## Installation

```bash
bun add -d @droneey/devkit-ts-lint-staged-biome lint-staged
```

## Setup

Add to your `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,md,yaml,yml}": [
      "biome check --write --no-errors-on-unmatched"
    ],
    "*.{ts,tsx}": [
      "eslint --fix"
    ]
  }
}
```

Or import programmatically in a `lint-staged.config.ts`:

```ts
import { configs } from '@droneey/devkit-ts-lint-staged-biome';

export default configs.base;
```

## Usage with Husky

Install [husky](https://typicode.github.io/husky/) for git hooks:

```bash
bun add -d husky
bunx husky init
```

Update `.husky/pre-commit`:

```bash
bunx lint-staged
```

Now every commit automatically runs Biome + ESLint on staged files.

## Related packages

- [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) — Biome configuration (formatter + linter)
- [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) — ESLint type-checked rules for Biome projects
- [@droneey/devkit-ts-lint-staged](https://www.npmjs.com/package/@droneey/devkit-ts-lint-staged-eslint) — lint-staged for legacy ESLint + Prettier projects

## License

MIT
