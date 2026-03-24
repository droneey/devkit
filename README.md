# @droneey/devkit

Shared development toolkit for consistent tooling across TypeScript projects.

## Packages

| Package | Description |
|---|---|
| `@droneey/devkit-ts-biome` | Biome configuration (formatter + linter) |
| `@droneey/devkit-ts-eslint-biome` | ESLint type-checked rules for Biome projects |
| `@droneey/devkit-ts-tsconfig` | TypeScript configuration variants |
| `@droneey/devkit-ts-commitlint` | Conventional commits enforcement |
| `@droneey/devkit-ts-jest` | Jest presets |

---

## Quick Start

### Installation

```bash
bun add -d \
  @droneey/devkit-ts-biome \
  @droneey/devkit-ts-eslint-biome \
  @droneey/devkit-ts-tsconfig \
  @droneey/devkit-ts-commitlint \
  @biomejs/biome \
  eslint \
  typescript-eslint \
  @commitlint/cli \
  lefthook
```

### Configuration Files

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.4.8/schema.json",
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/node",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

```ts
// eslint.config.ts
import * as devkit from '@droneey/devkit-ts-eslint-biome';

export default [
  ...devkit.configs.base,
  ...devkit.configs.node,
  ...devkit.configs.test,
];
```

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/base.json"
}
```

```ts
// commitlint.config.ts
import commitlintConfig from '@droneey/devkit-ts-commitlint';

export default commitlintConfig;
```

### Git Hooks (Lefthook)

```yaml
# lefthook.yml
pre-commit:
  parallel: true
  jobs:
    - name: biome
      glob: "*.{ts,tsx,js,jsx,json,md,yaml,yml}"
      stage_fixed: true
      run: bunx biome check --write --no-errors-on-unmatched {staged_files}
    - name: eslint
      glob: "*.{ts,tsx}"
      stage_fixed: true
      run: bunx eslint --fix {staged_files}

commit-msg:
  jobs:
    - name: commitlint
      run: bun --bun x --no -- commitlint --edit {1}
```

```bash
bunx lefthook install
```

### VS Code

Set Biome as the default formatter and enable code actions on save:

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

Extensions: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).

---

## Framework Setups

### NestJS

```ts
// eslint.config.ts
import * as devkit from '@droneey/devkit-ts-eslint-biome';

export default [
  ...devkit.configs.base,
  ...devkit.configs.node,
  ...devkit.configs.nestjs,
  ...devkit.configs.test,
];
```

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/node-cjs.json"
}
```

```json
// biome.json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/node",
    "@droneey/devkit-ts-biome/nestjs",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

### React

```ts
// eslint.config.ts
import * as devkit from '@droneey/devkit-ts-eslint-biome';

export default [
  ...devkit.configs.base,
  ...devkit.configs.browser,
  ...devkit.configs.react,
  ...devkit.configs.test,
];
```

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/browser.json"
}
```

```json
// biome.json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/browser",
    "@droneey/devkit-ts-biome/react",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

### React Native

```ts
// eslint.config.ts
import * as devkit from '@droneey/devkit-ts-eslint-biome';

export default [
  ...devkit.configs.base,
  ...devkit.configs.browser,
  ...devkit.configs.react,
  ...devkit.configs.reactNative,
  ...devkit.configs.test,
];
```

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/react-native.json"
}
```

## License

MIT
