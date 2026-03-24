# @droneey/devkit-ts-lint-staged-eslint

Shared [lint-staged](https://github.com/lint-staged/lint-staged) configuration for ESLint + Prettier projects. Runs Prettier for formatting and ESLint for linting on staged files.

## Installation

```bash
bun add -d @droneey/devkit-ts-lint-staged-eslint lint-staged husky
```

Add to your `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx,json,md,yaml,yml}": [
      "prettier --write"
    ],
    "*.{ts,tsx}": [
      "eslint --fix"
    ]
  }
}
```

Or import programmatically in `lint-staged.config.ts`:

```ts
import { configs } from '@droneey/devkit-ts-lint-staged-eslint';

export default configs.base;
```

## Configuration

| Staged Files | Command |
|---|---|
| `*.{ts,tsx,js,jsx,json,md,yaml,yml}` | `prettier --write` |
| `*.{ts,tsx}` | `eslint --fix` |

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-eslint](https://www.npmjs.com/package/@droneey/devkit-ts-eslint) | ESLint configuration |
| [@droneey/devkit-ts-prettier](https://www.npmjs.com/package/@droneey/devkit-ts-prettier) | Prettier configuration |

## License

MIT
