# @droneey/devkit-ts-lefthook

Shared [Lefthook](https://github.com/evilmartians/lefthook) configuration with composable git hooks.

## Installation

```bash
bun add -d @droneey/devkit-ts-lefthook lefthook
```

Create `lefthook.yml` in your project root:

```yaml
extends:
  - node_modules/@droneey/devkit-ts-lefthook/configs/base.yml
  - node_modules/@droneey/devkit-ts-lefthook/configs/biome.yml
  - node_modules/@droneey/devkit-ts-lefthook/configs/eslint.yml
```

```bash
bunx lefthook install
```

## Configuration

### Base

Language-agnostic hooks:

| Hook | Job | Description |
|---|---|---|
| `pre-commit` | `validate-branch` | Branch must match `(feature\|fix\|hotfix)/{id}-{name}` |
| `commit-msg` | `commitlint` | Validates conventional commit format (type, sentence-case, no body/footer) |

### Biome

| Hook | Job | Description |
|---|---|---|
| `pre-commit` | `biome` | Runs `biome check --write` on staged `ts,tsx,js,jsx,json,md,yaml,yml` files |

### ESLint

| Hook | Job | Description |
|---|---|---|
| `pre-commit` | `eslint` | Runs `eslint --fix` on staged `ts,tsx` files |

## Overriding

Override any named job in your `lefthook.yml`:

```yaml
extends:
  - node_modules/@droneey/devkit-ts-lefthook/configs/base.yml
  - node_modules/@droneey/devkit-ts-lefthook/configs/biome.yml

pre-commit:
  jobs:
    - name: biome
      glob: "*.{ts,tsx,js,jsx,json}"
```

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) | ESLint type-checked rules for Biome projects |
| [@droneey/devkit-ts-tsconfig](https://www.npmjs.com/package/@droneey/devkit-ts-tsconfig) | TypeScript configuration |

## License

MIT
