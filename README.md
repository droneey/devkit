# @droneey/devkit

Shared development toolkit for consistent tooling across TypeScript projects.

## Packages

| Package | Description |
|---|---|
| `@droneey/devkit-ts-biome` | Biome configuration (formatter + linter) |
| `@droneey/devkit-ts-tsconfig` | TypeScript configuration variants |
| `@droneey/devkit-ts-lefthook` | Lefthook git hooks (biome, commit validation) |

---

## Quick Start

### Installation

```bash
bun add -d \
  @droneey/devkit-ts-biome \
  @droneey/devkit-ts-tsconfig \
  @droneey/devkit-ts-lefthook \
  @biomejs/biome \
  lefthook
```

### Configuration Files

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.4.11/schema.json",
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/node",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/base"
}
```

### Git Hooks (Lefthook)

```yaml
# lefthook.yml
extends:
  - node_modules/@droneey/devkit-ts-lefthook/configs/base.yml
  - node_modules/@droneey/devkit-ts-lefthook/configs/biome.yml
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

Extension: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome).

---

## Framework Setups

### NestJS

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/node-cjs"
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

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/browser"
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

```json
// tsconfig.json
{
  "extends": "@droneey/devkit-ts-tsconfig/mobile"
}
```

```json
// biome.json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/browser",
    "@droneey/devkit-ts-biome/react",
    "@droneey/devkit-ts-biome/react-native",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

## License

MIT
