# @droneey/devkit-ts-lint-staged

Shared lint-staged configuration for running linters on staged files.

## Install

```bash
npm install -D @droneey/devkit-ts-lint-staged-eslint lint-staged
```

## Usage

```ts
// lint-staged.config.ts
import { configs } from '@droneey/devkit-ts-lint-staged-eslint';

export default configs.base;
```

## Base Config

| Pattern                              | Commands           |
| ------------------------------------ | ------------------ |
| `*.{ts,tsx,js,jsx,json,md,yaml,yml}` | `prettier --write` |
| `*.{ts,tsx}`                         | `eslint --fix`     |

## License

MIT
