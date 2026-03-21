# @droneey/devkit

Shared development toolkit for consistent tooling across projects.

---

# Integration Guide

## Common

Language-agnostic files for every project. Copy from repo:

```bash
cp /path/to/devkit/packages/common/templates/.editorconfig .
cp /path/to/devkit/packages/common/templates/.gitignore .
cp /path/to/devkit/packages/common/templates/.yamllint.yml .
cp -r /path/to/devkit/packages/common/templates/.vscode .
```

---

## TypeScript

Base setup for any TypeScript project. Framework-specific sections below extend this.

### Packages (npm)

| Package                          | Description                 |
| -------------------------------- | --------------------------- |
| `@droneey/devkit-ts-eslint`      | Composable ESLint configs   |
| `@droneey/devkit-ts-prettier`    | Prettier config             |
| `@droneey/devkit-ts-tsconfig`    | TSConfig variants           |
| `@droneey/devkit-ts-commitlint`  | Conventional commits config |
| `@droneey/devkit-ts-lint-staged` | Lint-staged config          |
| `@droneey/devkit-ts-jest`        | Jest configs                |

```bash
npm install -D \
  @droneey/devkit-ts-eslint \
  @droneey/devkit-ts-prettier \
  @droneey/devkit-ts-tsconfig \
  @droneey/devkit-ts-commitlint \
  @droneey/devkit-ts-lint-staged \
  @droneey/devkit-ts-jest
```

### Templates (copy from repo)

Append TS-specific gitignore entries and copy config files:

```bash
cat /path/to/devkit/packages/typescript/templates/base/.gitignore >> .gitignore
cp /path/to/devkit/packages/typescript/templates/base/.prettierrc .
cp /path/to/devkit/packages/typescript/templates/base/types.d.ts .
```

### ESLint

Composable layers — spread what you need:

```ts
// eslint.config.ts
import * as devkitEslint from '@droneey/devkit-ts-eslint';

const config = [
  ...devkitEslint.configs.base,
  ...devkitEslint.configs.node, // OR .browser
  ...devkitEslint.configs.test,
];

export default config;
```

#### Available layers

| Layer     | Purpose                                                                     |
| --------- | --------------------------------------------------------------------------- |
| `base`    | Core JS/TS rules, import sorting, unicorn, perfectionist, secrets, prettier |
| `node`    | Node.js globals                                                             |
| `browser` | Browser globals                                                             |
| `test`    | Disables strict typing for .spec.ts / .test.ts files                        |

### TSConfig

#### Available variants

| Variant             | Use case                                |
| ------------------- | --------------------------------------- |
| `base.json`         | Modern ESM (Bun, Vite)                  |
| `node-cjs.json`     | NestJS, Express (CommonJS + decorators) |
| `node-esm.json`     | Pure ESM Node.js                        |
| `browser.json`      | React, Vue (DOM + JSX)                  |
| `react-native.json` | React Native                            |

### Prettier

```json
{
  "prettier": "@droneey/devkit-ts-prettier"
}
```

### Commitlint

```ts
// commitlint.config.ts
const config = {
  extends: ['@droneey/devkit-ts-commitlint'],
};

export default config;
```

### Lint-Staged

```ts
// lint-staged.config.ts
import { configs } from '@droneey/devkit-ts-lint-staged';
export default configs.base;
```

### Jest

```ts
// Unit (package.json "jest" section or jest.config.ts)
import { configs } from '@droneey/devkit-ts-jest';

export default {
  ...configs.base,
  rootDir: 'src',
  moduleNameMapper: { '^#/(.*)$': '<rootDir>/$1' },
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
};
```

```ts
// jest-e2e.config.ts
import { configs } from '@droneey/devkit-ts-jest';

export default {
  ...configs.endToEnd,
  moduleNameMapper: { '^#/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

### Git hooks

```bash
npm install -D husky lint-staged
npx husky init
```

`.husky/pre-commit`:

```bash
npx lint-staged
```

`.husky/commit-msg`:

```bash
npx --no -- commitlint --edit $1
```

---

## NestJS

Extends the TypeScript base setup above.

### Additional ESLint layer

| Layer    | Purpose                                            |
| -------- | -------------------------------------------------- |
| `nestjs` | Relaxes class rules, DI patterns, bumps thresholds |

```ts
import * as devkitEslint from '@droneey/devkit-ts-eslint';

const config = [
  ...devkitEslint.configs.base,
  ...devkitEslint.configs.node,
  ...devkitEslint.configs.nestjs,
  ...devkitEslint.configs.test,
];

export default config;
```

### TSConfig

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/node-cjs.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": { "#/*": ["./src/*"] },
    "outDir": "./dist"
  },
  "exclude": ["node_modules", "dist"]
}
```

### Templates (copy from repo)

```bash
cp /path/to/devkit/packages/typescript/templates/frameworks/nestjs/.swcrc .
cp /path/to/devkit/packages/typescript/templates/frameworks/nestjs/tsconfig.json .
cp /path/to/devkit/packages/typescript/templates/frameworks/nestjs/eslint.config.ts .
cp /path/to/devkit/packages/typescript/templates/frameworks/nestjs/jest.setup.ts .
cp -r /path/to/devkit/packages/typescript/templates/frameworks/nestjs/scripts .
```

---

## React

Extends the TypeScript base setup above.

### Additional dependencies

```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

### Additional ESLint layer

| Layer   | Purpose                            |
| ------- | ---------------------------------- |
| `react` | React, react-hooks, jsx-a11y rules |

```ts
import * as devkitEslint from '@droneey/devkit-ts-eslint';

const config = [
  ...devkitEslint.configs.base,
  ...devkitEslint.configs.browser,
  ...devkitEslint.configs.react,
  ...devkitEslint.configs.test,
];

export default config;
```

### TSConfig

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/browser.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

---

## React Native

Extends the TypeScript base setup above.

### Additional dependencies

```bash
npm install -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-react-native
```

### Additional ESLint layers

| Layer         | Purpose                            |
| ------------- | ---------------------------------- |
| `react`       | React, react-hooks, jsx-a11y rules |
| `reactNative` | React Native rules                 |

```ts
import * as devkitEslint from '@droneey/devkit-ts-eslint';

const config = [
  ...devkitEslint.configs.base,
  ...devkitEslint.configs.browser,
  ...devkitEslint.configs.react,
  ...devkitEslint.configs.reactNative,
  ...devkitEslint.configs.test,
];

export default config;
```

### TSConfig

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/react-native.json",
  "compilerOptions": {
    "baseUrl": "./",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

## License

MIT
