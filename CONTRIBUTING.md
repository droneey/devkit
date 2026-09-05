# Contributing

## 🌱 Branches

Branch off `main` as `feature/*`, `fix/*` or `hotfix/*`. The prefix decides the release: `feature/*` is a minor bump, `fix/*` and `hotfix/*` a patch. `main` is protected; nothing lands on it outside a pull request.

## 📝 Commits

One-line Conventional Commits, `type: Subject`, no body. The subject starts with a capital and describes the change, not the file it touched. The lefthook `commit-msg` hook rejects anything else.

## ✅ Checks

```bash
bun install
bun run check
```

`check` is the three gates the pull request runs: `lint:check` (Biome formats and lints), `lint:packages` (syncpack keeps the manifests in step) and `test:unit`. Fix what Biome can fix for you with `bun run lint:fix` and `bun run lint:packages:fix`.

Every workflow has to parse before it is pushed:

```bash
for file in .github/workflows/*.yml; do
  bunx --package @action-validator/cli action-validator "$file"
done
```

A change to a shipped config is not done until a project outside this repository still loads it. Point a scratch project at the package and run its own tool against it.

## 🔀 Pull requests

One concern per pull request. Fill in the template, keep the README in step with what the packages export, and wait for the check to pass.

## 🚀 Releasing

Merging to `main` releases: `cd-version` bumps every `package.json`, pushes `chore: Release vX.Y.Z` with the matching tag, `cd-pre-release` opens the pre-release, and promoting it by hand runs `cd-deploy` to publish to npm. Nothing is released by hand.
