# @droneey/devkit-ts-lint-staged-biome

Shared [lint-staged](https://github.com/lint-staged/lint-staged) configuration for Biome + ESLint projects. Runs Biome for formatting and fast linting, then ESLint for type-checked rules on staged files.

## Installation

```bash
bun add -d @droneey/devkit-ts-lint-staged-biome lint-staged husky
```

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

Or import programmatically in `lint-staged.config.ts`:

```ts
import { configs } from '@droneey/devkit-ts-lint-staged-biome';

export default configs.base;
```

## Configuration

| Staged Files | Command |
|---|---|
| `*.{ts,tsx,js,jsx,json,md,yaml,yml}` | `biome check --write` |
| `*.{ts,tsx}` | `eslint --fix` |

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) | ESLint type-checked rules for Biome projects |

## License

MIT
