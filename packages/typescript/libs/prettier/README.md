# @droneey/devkit-ts-prettier

Shared [Prettier](https://prettier.io) configuration for consistent code formatting across projects.

## Installation

```bash
bun add -d @droneey/devkit-ts-prettier prettier
```

Add to your `package.json`:

```json
{
  "prettier": "@droneey/devkit-ts-prettier"
}
```

## Configuration

| Rule | Value |
|---|---|
| Print width | 80 |
| Tab width | 2 |
| Tabs | Spaces |
| Semicolons | Always |
| Quotes | Single |
| JSX quotes | Single |
| Trailing commas | All |
| Bracket spacing | Yes |
| Bracket same line | No |
| Arrow parens | Always |
| End of line | LF |
| Single attribute per line | Yes |
| Vue indent script and style | Yes |

## Related Packages

| Package | Description |
|---|---|
| [@droneey/devkit-ts-eslint](https://www.npmjs.com/package/@droneey/devkit-ts-eslint) | ESLint configuration (includes Prettier plugin) |
| [@droneey/devkit-ts-lint-staged-eslint](https://www.npmjs.com/package/@droneey/devkit-ts-lint-staged-eslint) | lint-staged for ESLint + Prettier projects |

## License

MIT
