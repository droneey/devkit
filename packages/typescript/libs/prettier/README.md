# @droneey/devkit-ts-prettier

Shared Prettier configuration for consistent code formatting across projects.

## Install

```bash
npm install -D @droneey/devkit-ts-prettier prettier
```

## Usage

In `package.json`:

```json
{
  "prettier": "@droneey/devkit-ts-prettier"
}
```

## Rules

| Rule                      | Value  |
| ------------------------- | ------ |
| `printWidth`              | 80     |
| `tabWidth`                | 2      |
| `useTabs`                 | false  |
| `semi`                    | true   |
| `singleQuote`             | true   |
| `jsxSingleQuote`          | true   |
| `trailingComma`           | all    |
| `bracketSpacing`          | true   |
| `bracketSameLine`         | false  |
| `arrowParens`             | always |
| `singleAttributePerLine`  | true   |
| `endOfLine`               | lf     |
| `vueIndentScriptAndStyle` | true   |

## License

MIT
