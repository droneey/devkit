# @droneey/devkit-ts-stryker

Shared [Stryker](https://stryker-mutator.io) configuration for Bun projects, and `mutation-check`, which mutates only the lines a change touches.

## Installation

```bash
bun add -d @droneey/devkit-ts-stryker @stryker-mutator/core
```

Stryker has no `extends`, so `stryker.config.mjs` spreads the configuration and adds what the project mutates:

```js
import { config } from '@droneey/devkit-ts-stryker';

export default {
  ...config,
  mutate: ['src/**/*.ts', '!src/**/__tests__/**'],
  thresholds: { high: 100, low: 100, break: 100 },
};
```

`config` runs the tests through Bun's command runner with `bunfig.mutation.toml` (copy `packages/typescript/templates/bun/bunfig.mutation.toml`: tests from `src`, no coverage). It works in `.stryker-tmp`, leaves the linked `.devkit` out of its sandbox and skips Stryker's tsconfig step, which TypeScript 7 does not support.

It keeps no incremental report: with the command runner Stryker cannot tell which tests a mutant meets, so a cached result can hide a survivor or report one that is gone. Mutating only the changed lines keeps a run short instead.

A Node project sets its own `testRunner` over `config`, such as `vitest` with its Stryker plugin.

## The mutation check

```json
{
  "scripts": {
    "mutation:check": "mutation-check",
    "mutation:all": "mutation-check all"
  }
}
```

`mutation-check` compares the working tree with `origin/main` and mutates, among the files the configuration's `mutate` patterns name:

- the lines each change touches (`file:start-end`);
- a new file, whole;
- the file a changed spec proves, whole: `src/__tests__/order.utils.test.ts` proves `src/order.utils.ts`, so a weakened test cannot pass unseen.

A change that touches no mutated line runs no mutant. `mutation-check all` mutates everything the configuration names. The bin is built to JavaScript on publish, so it runs under Node and Bun alike.
