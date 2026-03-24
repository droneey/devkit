# @droneey/devkit-ts-commitlint

Shared [Commitlint](https://commitlint.js.org) configuration for enforcing consistent commit messages across projects.

## Installation

```bash
bun add -d @droneey/devkit-ts-commitlint @commitlint/cli husky
```

Create `commitlint.config.ts` in your project root:

```ts
import commitlintConfig from '@droneey/devkit-ts-commitlint';

export default commitlintConfig;
```

Add the commit-msg hook in `.husky/commit-msg`:

```bash
bun --bun x --no -- commitlint --edit "$1"
```

## Configuration

### Commit Format

```
type: Subject in sentence case

Optional body.
```

### Allowed Types

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `perf` | Performance improvement |
| `refactor` | Code refactoring |
| `style` | Code style change |
| `test` | Adding or updating tests |
| `docs` | Documentation |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance tasks |

### Rules

- Subject must be in sentence-case.
- Body and footer must be empty (enforced).
- Type must be one of the allowed types above.

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-eslint](https://www.npmjs.com/package/@droneey/devkit-ts-eslint) | ESLint configuration |
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration |

## License

MIT
