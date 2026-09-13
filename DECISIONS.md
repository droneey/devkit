# Decision Log

> A journal of the decisions behind this repository and the reasoning behind them. **Not a rulebook** — the constitution's chapters say *how things are*; this log records *why we decided it and what we rejected*.
>
> **Conventions:** append-only. One entry per decision, numbered. To change a decision, add a **new** entry that supersedes the old one (mark the old `Superseded by ADR-NNNN`) — never rewrite history. Statuses: `Accepted` · `Superseded` · `Proposed`. A departure from a block carries a **`Deviates:`** line naming the chapter and section — it is the only way this repository departs from the constitution.

## ADR-0001 — Ratified the constitution at 0.5.1 with the `library-bun` assembly
**Date:** 2026-09-11 · **Status:** Accepted

- **Context.** The droneey constitution exists as a plugin; devkit was the model for its `library` sphere and its `bun-workspaces` stack, so the repository already lives by them.
- **Decision.** `PROJECT.md` pins constitution 0.5.1 and the `library-bun` assembly; the product context is written from the code and the README. No chapter needed a change to the code.
- **Why.** One place for the rules, read by every agent and human on every session; the repository carries only what is its own.

## ADR-0002 — The TypeScript peer is a range of majors, not a floor
**Date:** 2026-09-11 · **Status:** Accepted · **Deviates:** `bun-workspaces` stack §3

- **Context.** The stack declares the configured tool as a peer with a floor (`>=`). The tsconfig package declares `typescript` as `^5 || ^7` and the jest package as `^5`: ranges of majors, set in the first commit of the kit. Six, the bridge release before the native seven, is outside the tsconfig range.
- **Decision.** The ranges stay as they are; the departure is recorded here rather than widened away.
- **Why.** A floor is a promise about every future major of a compiler whose next major changes the defaults; a range of majors promises only the ones the configuration is written for.

## ADR-0003 — `check` type-checks the packages
**Date:** 2026-09-13 · **Status:** Superseded by ADR-0004 · **Deviates:** `bun-workspaces` stack §6

- **Context.** The stack's `check` runs the linter, the manifests and the tests, and no type checker, although the `workflow` chapter counts the type checker among what `check` runs. With nothing type-checking the repository, two errors in the syncpack spec went unnoticed under the strict preset the kit itself ships.
- **Decision.** `check` gains `type:check` (`tsc --noEmit`) between `packages:check` and `test:unit`, the order the command-line stack uses. The two errors came from the syncpack config being annotated as the whole `RcFile`, where every field is optional; `@satisfies` checks it against `RcFile` while keeping the shape it actually has, so the compiler and the linter read the same value, without a cast.
- **Why.** A kit that ships the strict TypeScript preset holds its own code to it; the stricter step is recorded here until the stack's list catches up with the `workflow` chapter.

## ADR-0004 — Took constitution 0.6.1; the dependency checker holds the package boundaries
**Date:** 2026-09-13 · **Status:** Accepted · **Supersedes ADR-0003**

- **Context.** Constitution 0.6.1 has the `bun-workspaces` stack's `check` run the type checker and the dependency checker, and names the dependency checker among the enforcers of the `library` chapter. The type check ran here as a departure, nothing checked the imports, and CI kept its own list of gates, which had missed the type check. The code chapter's changes of 0.6.0 needed nothing here.
- **Decision.** `PROJECT.md` pins 0.6.1, and the type check is the stack's rule rather than a departure. dependency-cruiser runs as `architecture:check`, last in `check`, over the whole repository, with the rules of `library` §7 and `testing` §5: a package imports another package only by its name, through a declared dependency, and never a file of another package or of `common`; `common` imports nothing; the root imports its own packages by name; production code never imports from `__tests__/`; every import resolves, to a dependency the closest manifest declares; nothing is circular. Symlinks are preserved, so an import by name resolves into `node_modules` and an import by path into `packages/`, and the two read differently. The checker's configuration default-exports, as the tool requires, so the base Biome preset treats `.dependency-cruiser.*` like the other tool configurations. CI runs `check` and then builds, in the stack's order.
- **Rejected.** Cruising `packages/` alone — the root's imports of its own packages would go unchecked. An exception in each repository's own Biome configuration — every consumer of the checker would copy it. Keeping CI's own list of steps — that list is how the type check went missing.
- **Why.** The departure became the rule; one list of gates, run the same way on the machine and on the pull request, cannot drift again.
