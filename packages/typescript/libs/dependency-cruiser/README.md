# @droneey/devkit-ts-dependency-cruiser

Shared [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) configuration: the import hygiene any TypeScript repository keeps, whatever its folders.

## Installation

```bash
bun add -d @droneey/devkit-ts-dependency-cruiser dependency-cruiser @swc/core
```

Create `.dependency-cruiser.mjs` in your project root:

```js
/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  extends: '@droneey/devkit-ts-dependency-cruiser/configs/base.mjs',
};
```

dependency-cruiser resolves `extends` without a package's `exports`, so the preset is named by its file. Run it in the check as `depcruise src --config .dependency-cruiser.mjs`; the rules of a repository's own layers go into `forbidden` beside the preset, or into a second preset in `extends`.

## Hygiene

| Rule | Forbids |
|---|---|
| `no-circular` | A module that reaches itself through its imports |
| `no-test-code-in-production` | Production code importing anything under `__tests__/` or `e2e/` |
| `no-undeclared-dependency` | A package the closest manifest does not declare |
| `no-unresolvable` | An import that resolves to nothing |
| `no-deprecated-dependency` | A deprecated package |
| `no-development-dependency-in-production` | Code under `src/`, outside its specs, importing a development dependency other than its types |

The options parse TypeScript with swc, since TypeScript 7 has no compiler API, know Bun's built-in modules, stop at `node_modules`, and skip hidden folders (`.git`, a linked `.devkit`, tool caches), `dist/` and generated `.gen.` files.

## License

MIT
