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
