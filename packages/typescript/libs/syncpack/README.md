# @droneey/devkit-ts-syncpack

Shared [Syncpack](https://syncpack.dev) configuration: the order of the fields in every `package.json`, the alphabetical fields, and caret ranges for the dependencies of the project. Scripts keep the order their author chose.

## Installation

```bash
bun add -d @droneey/devkit-ts-syncpack syncpack
```

Create `.syncpackrc.mjs` in your project root:

```js
export { config as default } from '@droneey/devkit-ts-syncpack';
```

A repository of packages takes `packages` instead:

```js
export { packages as default } from '@droneey/devkit-ts-syncpack';
```

On top of `config`, it holds:

- every package of the repository at one version: each manifest's `version` is read as one custom type under `sameRange`, so a package left behind is a `SameRangeMismatch`;
- the repository's own packages (`$LOCAL`) taken as `workspace:*` in dependencies and dev dependencies;
- peer dependencies left at their wider ranges.

## Scripts

```json
{
  "scripts": {
    "packages:check": "syncpack lint && syncpack format --check",
    "packages:fix": "syncpack fix && syncpack format"
  }
}
```

`syncpack lint` checks versions and ranges; `syncpack format --check` checks the field order. Both run in `check`.
