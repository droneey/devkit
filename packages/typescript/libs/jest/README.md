# @droneey/devkit-ts-jest

Shared [Jest](https://jestjs.io) presets for unit and end-to-end testing with TypeScript.

## Installation

```bash
bun add -d @droneey/devkit-ts-jest jest ts-jest
```

Add to your `package.json`:

```json
{
  "jest": {
    "preset": "@droneey/devkit-ts-jest"
  }
}
```

## Configuration

### Unit Tests

The default preset (`@droneey/devkit-ts-jest`):

| Option | Value |
|---|---|
| Test pattern | `*.spec.ts` |
| Transform | `ts-jest` |
| Module extensions | `js`, `json`, `ts`, `tsx` |
| Environment | `node` |

### End-to-End Tests

Create `jest-e2e.config.ts`:

```ts
export default {
  preset: '@droneey/devkit-ts-jest/e2e',
};
```

| Option | Value |
|---|---|
| Test pattern | `*.e2e-spec.ts` |
| Root dir | `.` |
| Timeout | 30 seconds |

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-biome](https://www.npmjs.com/package/@droneey/devkit-ts-biome) | Biome configuration (formatter + linter) |
| [@droneey/devkit-ts-eslint-biome](https://www.npmjs.com/package/@droneey/devkit-ts-eslint-biome) | ESLint type-checked rules for Biome projects |
| [@droneey/devkit-ts-lefthook](https://www.npmjs.com/package/@droneey/devkit-ts-lefthook) | Git hooks (biome, eslint, commit validation) |
| [@droneey/devkit-ts-tsconfig](https://www.npmjs.com/package/@droneey/devkit-ts-tsconfig) | TypeScript configuration |

## License

MIT
