# @droneey/devkit

Shared development toolkit for consistent tooling across TypeScript projects.

## 🚀 Quick start

### Installation

```bash
bun add -d \
  @droneey/devkit-ts-biome \
  @droneey/devkit-ts-tsconfig \
  @droneey/devkit-ts-lefthook \
  @droneey/devkit-ts-syncpack \
  @biomejs/biome \
  lefthook \
  syncpack
```

### Configuration files

```json
// biome.json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
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

A repository without npm pulls the same branch and commit rules through lefthook's remotes, pinned to a release:

```yaml
# lefthook.yml
remotes:
  - git_url: https://github.com/droneey/devkit
    ref: v1.10.0
    configs:
      - packages/common/lefthook/base.yml
```

### Package manifests (Syncpack)

```js
// .syncpackrc.mjs
export { config as default } from '@droneey/devkit-ts-syncpack';
```

```json
// package.json
{
  "scripts": {
    "packages:check": "syncpack lint && syncpack format --check",
    "packages:fix": "syncpack fix && syncpack format"
  }
}
```

### Tests (Bun)

Copy `packages/typescript/templates/bun/bunfig.toml`: coverage on, a gate of 100 percent for functions and lines, tests, fakes, entrypoints and composition roots excluded by glob, so the file is identical in every repository.

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
  "extends": "@droneey/devkit-ts-tsconfig/node"
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
| `@droneey/devkit-ts-syncpack` | Syncpack configuration (package.json order and ranges) |

## ⚙️ Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `ci-check` | pull request to `main` | Runs `check`, then builds the packages |
| `cd-version` | push to `main` | Bumps every `package.json` and tags the release - `droneey/.github` |
| `cd-pre-release` | tag `v*` | Opens the pre-release to promote by hand - `droneey/.github` |
| `cd-deploy` | release published | Builds and publishes the packages to npm - `droneey/.github` |

The last three are thin callers of the shared hub at [`droneey/.github`](https://github.com/droneey/.github), each pinned to an exact release of the hub in its `uses:` line; only `ci-check` is local.

## 🛠️ Development

```bash
bun install
bun run check
```

`check` runs Biome, Syncpack, the type checker, the tests with full coverage and dependency-cruiser - the same gates as the pull request.

## 📐 Conventions

Branches are `feature/*`, `fix/*` or `hotfix/*`, and the prefix decides the version bump. Commits are one-line Conventional Commits, `type: Subject`. See [CONTRIBUTING.md](https://github.com/droneey/.github/blob/main/CONTRIBUTING.md).

## 📚 Docs

- [Docker conventions](docs/docker-conventions.md)

## 📄 License

MIT
