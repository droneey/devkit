# @droneey/devkit-ts-jest

Shared Jest configuration with base and end-to-end presets.

## Install

```bash
npm install -D @droneey/devkit-ts-jest jest ts-jest
```

## Usage

### Unit Tests

In `package.json` — no config file needed:

```json
{
  "jest": {
    "preset": "@droneey/devkit-ts-jest",
    "rootDir": "src",
    "moduleNameMapper": { "^#/(.*)$": "<rootDir>/$1" },
    "setupFilesAfterSetup": ["<rootDir>/../jest.setup.ts"]
  }
}
```

### End-to-End Tests

```ts
// jest-e2e.config.ts
export default {
  preset: '@droneey/devkit-ts-jest/e2e',
  moduleNameMapper: { '^#/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

## Presets

| Preset                        | Test Pattern    | Timeout |
| ----------------------------- | --------------- | ------- |
| `@droneey/devkit-ts-jest`     | `*.spec.ts`     | default |
| `@droneey/devkit-ts-jest/e2e` | `*.e2e-spec.ts` | 30s     |

Both presets use `ts-jest` for TypeScript transformation.

## License

MIT
