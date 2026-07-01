---
description: Execute a single bounded-build stage from BUILD_PLAN.md, then stop.
argument-hint: <stage number>
---

Execute **stage $1** of the bounded build — and only that stage.

1. Read `BUILD_PLAN.md` and `BUILD_STATE.md`. Confirm stage $1 is the correct
   next stage; if not, say so and stop.
2. State the stage's deliverable and the files you will touch (2-4 lines), then
   build it. Follow the operating rules: production-ready, errors handled,
   Windows-safe paths, tests for new logic.
3. Run the stage's own verification step (from the plan). Fix until it passes.
4. Do NOT start the next stage. Instead run the intent of `/handoff`: append a
   dated entry to `BUILD_STATE.md` `## Log` (what was built, key decisions, files
   touched, how verified), set `Current stage: $1 (done)` and `Next: stage N+1`.
5. Tell the user to `/clear` (or start a fresh session) and then run `/stage <N+1>`.
   Keeping each stage in its own context is the whole point.
