# @droneey/devkit-ts-betterleaks

Shared [betterleaks](https://github.com/betterleaks/betterleaks) configuration: the default rules — cloud keys, forge tokens, private keys, JWTs, credentials in connection strings — with nothing switched off.

## Installation

betterleaks is not an npm package; pin it through [mise](https://mise.jdx.dev):

```bash
mise use betterleaks@1.8.1
bun add -d @droneey/devkit-ts-betterleaks
```

Create `.betterleaks.toml` in your project root:

```toml
[extend]
path = "node_modules/@droneey/devkit-ts-betterleaks/configs/betterleaks.toml"
```

## Scanning

- **Before a commit** — the `betterleaks` hook of [@droneey/devkit-ts-lefthook](https://www.npmjs.com/package/@droneey/devkit-ts-lefthook) scans the staged changes.
- **In the check** — the history the clone holds, then the uncommitted changes:

```json
"secrets:check": "betterleaks git . --redact --no-banner && betterleaks git . --pre-commit --redact --no-banner && betterleaks git . --pre-commit --staged --redact --no-banner"
```

Every scan passes `--redact`, so a report shows a finding by its rule, file and line, never by its value. `betterleaks dir` is left out: it reads ignored files too, such as a local `.env`.

## A false positive

Never switch a rule off. Allow the one finding, with its reason:

- inline, on its line: `// betterleaks:allow <reason>` (the older `gitleaks:allow` works too);
- by its fingerprint in `.betterleaksignore`, under a `#` line that states the reason:

```text
# a fixture token in the parser spec, never a real one
src/__tests__/parser.spec.ts:github-pat:12
```

## License

MIT
