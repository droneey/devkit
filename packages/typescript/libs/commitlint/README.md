# @droneey/devkit-ts-commitlint

Shared Commitlint configuration for consistent Git commits across projects.

## Install

```bash
npm install -D @droneey/devkit-ts-commitlint @commitlint/cli
```

## Usage

```ts
// commitlint.config.ts
const config = {
  extends: ['@droneey/devkit-ts-commitlint'],
};

export default config;
```

## Commit Format

```
type: Subject in sentence case
```

### Allowed Types

`feat` `fix` `perf` `refactor` `style` `test` `docs` `build` `ci` `chore`

### Rules

- Subject must be sentence-case
- Body and footer must be empty (enforced)
- Extends `@commitlint/config-conventional`

## License

MIT
