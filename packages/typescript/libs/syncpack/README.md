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

A monorepo adds its own version groups on top:

```js
import { config } from '@droneey/devkit-ts-syncpack';

export default {
  ...config,
  versionGroups: [
    {
      label: 'Workspace packages use the workspace protocol',
      dependencies: ['@acme/**'],
      dependencyTypes: ['dev'],
      pinVersion: 'workspace:*',
    },
  ],
};
```

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
