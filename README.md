# @droneey/devkit

Shared development toolkit for consistent tooling across TypeScript projects.

## 🚀 Quick start

### Installation

```bash
bun add -d \
  @droneey/devkit-ts-biome \
  @droneey/devkit-ts-tsconfig \
  @droneey/devkit-ts-lefthook \
  @biomejs/biome \
  lefthook
```

### Configuration files

```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.5.12/schema.json",
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

### Git hooks (Lefthook)

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

### Framework setups

#### NestJS

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

#### React

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

#### React Native

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

## 📦 Packages

| Package | Description |
|---|---|
| `@droneey/devkit-ts-biome` | Biome configuration (formatter + linter) |
| `@droneey/devkit-ts-tsconfig` | TypeScript configuration variants |
| `@droneey/devkit-ts-lefthook` | Lefthook git hooks (biome, commit validation) |

## ⚙️ Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `ci-check` | pull request to `main` | Lints, checks the manifests, builds and tests with full line coverage |
| `cd-version` | push to `main` | Bumps every `package.json` and tags the release - `droneey/workflows` |
| `cd-pre-release` | tag `v*` | Opens the pre-release to promote by hand - `droneey/workflows` |
| `cd-deploy` | release published | Builds and publishes the packages to npm - `droneey/workflows` |

The last three are thin callers of the shared hub at [`droneey/workflows`](https://github.com/droneey/workflows), pinned to `@v1`; only `ci-check` is local.

## 🛠️ Development

```bash
bun install
bun run check
```

`check` runs Biome, syncpack and the tests - the same three gates as the pull request.

## 📐 Conventions

Branches are `feature/*`, `fix/*` or `hotfix/*`, and the prefix decides the version bump. Commits are one-line Conventional Commits, `type: Subject`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## 📚 Docs

- [Docker conventions](docs/docker-conventions.md)

## 📄 License

MIT
