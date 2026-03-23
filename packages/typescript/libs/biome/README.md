# @droneey/devkit-ts-biome

Shared Biome configuration for formatting, linting, and code organization.

## Install

```bash
npm install -D @droneey/devkit-ts-biome @biomejs/biome
```

## Usage

Create a `biome.json` in your project root:

```json
{
  "extends": ["@droneey/devkit-ts-biome/base"]
}
```

### Framework configs

Add framework-specific rules alongside the base config:

```json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/react"
  ]
}
```

Available framework configs:

- `@droneey/devkit-ts-biome/react` - React, hooks, JSX a11y, Next.js rules
- `@droneey/devkit-ts-biome/nestjs` - NestJS-specific overrides
- `@droneey/devkit-ts-biome/react-native` - React Native rules

### Test config

Relax strict rules for test files:

```json
{
  "extends": [
    "@droneey/devkit-ts-biome/base",
    "@droneey/devkit-ts-biome/test"
  ]
}
```

## What's Included

### Formatter

Replaces Prettier with consistent settings:

- Single quotes, JSX single quotes
- 2-space indent (spaces, not tabs)
- Semicolons always
- Trailing commas everywhere
- LF line endings
- 80 character line width
- One attribute per line

### Assist actions

- **Import sorting** - alphabetical within groups
- **Interface member sorting** - sorted by key
- **Duplicate CSS class removal**

### Linter

All recommended rules enabled at `error` level, plus 80+ additional rules across:

- **Suspicious** - `noVar`, `noAlert`, `noConsole`, `noEvolvingTypes`, `noFloatingPromises`, `noSkippedTests`
- **Style** - `noDefaultExport`, `noCommonJs`, `noNamespace`, `noMagicNumbers`, `useNamingConvention`, `useBlockStatements`, `useFilenamingConvention` (kebab-case)
- **Complexity** - `noForEach`, `noVoid`, `noExcessiveCognitiveComplexity` (max 8), `noExcessiveLinesPerFunction` (max 75), `useMaxParams`
- **Correctness** - `useImportExtensions`, `noUndeclaredDependencies`, `noGlobalDirnameFilename`
- **Performance** - `noDelete`, `noAccumulatingSpread`, `noAwaitInLoops`, `noReExportAll`
- **Security** - `noSecrets`
- **Nursery** - `noShadow`, `noUnnecessaryConditions`, `useExhaustiveSwitchCases`, `useNullishCoalescing`, `useErrorCause`, and more

### Disabled rules

- `useLiteralKeys` - conflicts with TypeScript's `noPropertyAccessFromIndexSignature`

## VS Code setup

Add to `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit",
    "source.fixAll.biome": "explicit"
  },
  "[javascript][typescript][javascriptreact][typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json][jsonc]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

Recommended extension: [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

## License

MIT
