# @droneey/devkit

Shared development toolkit for consistent tooling across the fleet's repositories. The configuration of JavaScript and TypeScript tools ships as npm packages; the configuration of every other tool ships in the release archive `devkit.tar.gz`, which mise installs.

## 🚀 Quick start

### Installation

```bash
bun add -d \
  @droneey/devkit-ts-biome \
  @droneey/devkit-ts-tsconfig \
  @droneey/devkit-ts-syncpack \
  @biomejs/biome \
  syncpack
```

### The release archive (mise)

Tools that are not JavaScript — lefthook, betterleaks — come from mise, and their configuration from the release archive, linked as `.devkit` and ignored in git:

```toml
# mise.toml
[tools]
betterleaks = "1.8.1"
lefthook = "2.1.14"
"http:devkit" = { version = "<version>", url = "https://github.com/droneey/devkit/releases/download/v{{ version }}/devkit.tar.gz", strip_components = 0, checksum = "sha256:<the release's devkit.tar.gz.sha256>" }

[hooks]
postinstall = [
  "ln -sfn \"$(mise where http:devkit)\" .devkit",
  "lefthook install",
]
```

`strip_components = 0` keeps the archive's `common/` folder, and `checksum` is checked on every platform. `mise install` relinks `.devkit` and installs the git hooks each time it runs, in a fresh clone and in CI alike — never `prepare`, which runs where mise does not, such as the npm deploy; a version bump takes the new checksum from the release's `devkit.tar.gz.sha256`.

### Configuration files

```json
// biome.json — a program on Bun
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/bun",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

```json
// tsconfig.json — a program on Bun
{
  "extends": "@droneey/devkit-ts-tsconfig/bun"
}
```

### Git hooks (Lefthook)

```yaml
# lefthook.yml
extends:
  - .devkit/common/lefthook/base.yml
  - .devkit/common/lefthook/biome.yml
  - .devkit/common/lefthook/betterleaks.yml
```

`mise install` installs them, through the `postinstall` hook above.

| Hook | Job | Checks |
|---|---|---|
| `base.yml` | `validate-branch`, `commit-message` | The branch `(feature\|fix\|hotfix)/{id}-{name}`; Conventional Commits with `feat`, `fix`, `refactor`, `chore` and `!`, no scope, a sentence-case subject that is not a placeholder, no body |
| `biome.yml` | `biome` | `biome check --write` on the staged files, with Biome from npm or from mise |
| `betterleaks.yml` | `secrets` | `betterleaks git --pre-commit --staged --redact` over the staged changes |

### Secrets (betterleaks)

```toml
# .betterleaks.toml
[extend]
path = ".devkit/common/betterleaks/betterleaks.toml"
```

The preset keeps betterleaks' default rules, with nothing switched off, and skips `bun.lock` as betterleaks skips the other lockfiles (until [betterleaks#370](https://github.com/betterleaks/betterleaks/pull/370) is released). The check scans the history the clone holds and the uncommitted changes, never `betterleaks dir`, which reads ignored files such as a local `.env`:

```json
"secrets:check": "betterleaks git . --redact --no-banner && betterleaks git . --pre-commit --redact --no-banner && betterleaks git . --pre-commit --staged --redact --no-banner"
```

A false positive is allowed on its line by `// betterleaks:allow <reason>`, or by its fingerprint in `.betterleaksignore` under a `#` line that states the reason; never by switching a rule off.

### Names (ls-lint)

ls-lint comes from mise (`ls-lint = "2.3.1"`) and reads its parts from the release archive, then the repository's own additions:

```json
"names:check": "ls-lint --config .devkit/common/ls-lint/base.yaml --config .devkit/common/ls-lint/markdown.yaml --config .devkit/common/ls-lint/typescript.yaml --config .ls-lint.yaml"
```

| Part | Names |
| --- | --- |
| `base.yaml` | Every file and folder in kebab-case, hidden ones (`.github/`, `.editorconfig`) and names with up to three extensions (`order-card.stories.tsx`, `checkout.e2e.spec.ts`) too; ignores `.git`, `.devkit`, `node_modules`, `coverage`, `dist`, `reports` and Stryker's sandbox |
| `markdown.yaml` | Documents in kebab-case or upper case (`README.md`, `CODE_OF_CONDUCT.md`) |
| `typescript.yaml` | `.ts` and `.tsx` in kebab-case, and `__tests__/` folders |
| `python.yaml` | Modules and their compiled caches in snake_case with `__init__.py` and `__main__.py`, packages in snake_case; ignores `.venv` and the tools' caches |

A repository takes `base` and the parts of its languages, then adds its own ignores and rules in `.ls-lint.yaml`. ls-lint takes everything after a name's first dot as its extension and checks the name only when a key matches that whole extension, so `.*` alone would leave `OrderCard.stories.tsx` unchecked. ls-lint merges the configurations it is given key by key: an extension's rule adds to the others, while a key named in two configurations keeps only the last one's rules. `typescript` and `python` both name folders, so a repository with both writes its own `.dir` rule in `.ls-lint.yaml`.

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

Copy `packages/typescript/templates/bun/bunfig.toml`: coverage on, a gate of 100 percent for functions and lines, specs, the entry, each entrypoint's entry, the wiring file and generated files excluded by glob, a three-day cooldown before a new release is installed, so the file is identical in every repository.

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
  "extends": [
    "@droneey/devkit-ts-tsconfig/node",
    "@droneey/devkit-ts-tsconfig/nestjs"
  ]
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
  "extends": [
    "@droneey/devkit-ts-tsconfig/browser",
    "@droneey/devkit-ts-tsconfig/react"
  ]
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
  "extends": [
    "@droneey/devkit-ts-tsconfig/base",
    "@droneey/devkit-ts-tsconfig/react"
  ]
}
```

```json
// biome.json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
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
| `@droneey/devkit-ts-syncpack` | Syncpack configuration (package.json order and ranges) |
| `@droneey/devkit-ts-dependency-cruiser` | dependency-cruiser hygiene: no cycle, no test code in production, declared and resolvable dependencies |

## ⚙️ Workflows

| Workflow | Trigger | What it does |
|---|---|---|
| `ci-check` | pull request to `main` | Runs `check`, then builds the packages |
| `cd-version` | push to `main` | Bumps every `package.json` and tags the release - `droneey/.github` |
| `cd-pre-release` | tag `v*` | Opens the pre-release to promote by hand, with `devkit.tar.gz` attached - `droneey/.github` |
| `cd-deploy` | release published | Builds and publishes the packages to npm - `droneey/.github` |

The last three are thin callers of the shared hub at [`droneey/.github`](https://github.com/droneey/.github), each pinned to an exact release of the hub in its `uses:` line; only `ci-check` is local.

## 🛠️ Development

```bash
mise trust && mise install   # Bun, lefthook, betterleaks and actionlint, pinned in mise.toml
bun install
bun run check
```

`check` runs Biome, Syncpack, the type checker, the tests with full coverage, dependency-cruiser and betterleaks - the same gates as the pull request. devkit reads its own common files straight from `packages/common/`.

## 📐 Conventions

Branches are `feature/*`, `fix/*` or `hotfix/*`, and the prefix decides the version bump. Commits are one-line Conventional Commits, `type: Subject`, with the types `feat`, `fix`, `refactor` and `chore`, and `type!: Subject` for a breaking change. See [CONTRIBUTING.md](https://github.com/droneey/.github/blob/main/CONTRIBUTING.md).

## 📚 Docs

- [Docker conventions](docs/docker-conventions.md)

## 📄 License

MIT
