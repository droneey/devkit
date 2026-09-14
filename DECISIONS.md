# Decision Log

> The departures of this repository from the constitution, each with its reason. **Only departures:** a decision the chapters already allow lives in the description of its pull request.
>
> **Conventions:** one entry per departure in force, numbered; a number is never reused. Every entry carries a **`Deviates:`** line naming the chapter and section — it is the only way this repository departs from the constitution. The change that ends a departure removes its entry; git keeps the history.

## ADR-0002 — The TypeScript peer is a range of majors, not a floor
**Date:** 2026-09-11 · **Deviates:** `bun-workspaces` stack §3

- **Context.** The stack declares the configured tool as a peer with a floor (`>=`). The tsconfig package declares `typescript` as `^5 || ^7` and the jest package as `^5`: ranges of majors, set in the first commit of the kit. Six, the bridge release before the native seven, is outside the tsconfig range.
- **Decision.** The ranges stay as they are; the departure is recorded here rather than widened away.
- **Why.** A floor is a promise about every future major of a compiler whose next major changes the defaults; a range of majors promises only the ones the configuration is written for.
