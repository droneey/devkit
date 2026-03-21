# @droneey/devkit-ts-tsconfig

Shared TypeScript configuration variants for different project types.

## Install

```bash
npm install -D @droneey/devkit-ts-tsconfig
```

## Usage

```json
{
  "extends": "@droneey/devkit-ts-tsconfig/configs/base.json"
}
```

## Available Variants

| Variant             | Use Case                                |
| ------------------- | --------------------------------------- |
| `base.json`         | Modern ESM (Bun, Vite)                  |
| `node-cjs.json`     | NestJS, Express (CommonJS + decorators) |
| `node-esm.json`     | Pure ESM Node.js                        |
| `browser.json`      | React, Vue (DOM + JSX)                  |
| `react-native.json` | React Native                            |

## Base Config Highlights

- `strict: true`
- `module: ESNext` / `moduleResolution: bundler`
- `noUncheckedIndexedAccess: true`
- `verbatimModuleSyntax: true`
- `skipLibCheck: true`

## License

MIT
