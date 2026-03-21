# @droneey/devkit-ts-jest

Shared Jest configuration with base and end-to-end presets.

## Install

```bash
npm install -D @droneey/devkit-ts-jest jest ts-jest
```

## Usage

### Unit Tests

```ts
// jest.config.ts
import { configs } from '@droneey/devkit-ts-jest';

export default {
  ...configs.base,
  rootDir: 'src',
  moduleNameMapper: { '^#/(.*)$': '<rootDir>/$1' },
  setupFilesAfterEnv: ['<rootDir>/../jest.setup.ts'],
};
```

### End-to-End Tests

```ts
// jest-e2e.config.ts
import { configs } from '@droneey/devkit-ts-jest';

export default {
  ...configs.endToEnd,
  moduleNameMapper: { '^#/(.*)$': '<rootDir>/src/$1' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};
```

## Presets

| Preset     | Test Pattern    | Timeout |
| ---------- | --------------- | ------- |
| `base`     | `*.spec.ts`     | default |
| `endToEnd` | `*.e2e-spec.ts` | 30s     |

Both presets use `ts-jest` for TypeScript transformation.

## License

MIT
