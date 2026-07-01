---
description: Write durable build state to disk and end the session cleanly. Run at the end of every stage. Updates BUILD_STATE.md.
---

You are closing out a stage per the `bounded-build` skill. The goal is to make the build
fully resumable from disk alone, so a fresh session with zero chat history can pick up
exactly where this one left off.

## 1. Update BUILD_STATE.md
Rewrite `BUILD_STATE.md` so it reflects reality as of right now:

```markdown
# Build State
_Last updated: <date+time> by /handoff after Stage <N>_

## Current position
- **Next stage:** <N+1, or "DONE — run /verify">
- **Status:** <one line: what's true right now>

## Completed stages
- Stage 1: <title> — <exit criterion met, one-line outcome> — <key files>
- Stage 2: ...
- Stage N: <title> — <outcome> — <key files>

## Discovered work (not in original plan)
- <anything found mid-build that isn't yet a planned stage, or "none">

## Open questions / blockers
- <anything the next session needs to resolve first, or "none">

## Resume hint
<2-3 sentences telling the next session exactly what to do first: which files to read,
what state the code is in, any gotcha. Write this for someone with NO memory of this session.>
```

## 2. Verify the write
Re-read `BUILD_STATE.md` after writing and confirm it's internally consistent: the "Next
stage" matches the last completed stage, completed stages list is accurate, no contradiction
between sections. Fix any mismatch before continuing — a wrong state file is worse than none.

## 3. Commit the state (if in a git repo)
If the working directory is a git repo, stage and commit `BUILD_STATE.md` (and `BUILD_PLAN.md`
if it changed) with a message like `build: complete stage <N> — <title>`. This gives you a
diffable history of the build's progress and a rollback point per stage.

## 4. Print the closeout
Give the user a 3-line closeout:
- Stage <N> complete: <exit criterion met>.
- Next: run `/stage <N+1>` in a fresh session (or `/verify` if the build is done).
- Any blocker the next session must handle first.

Then stop. Do not start the next stage. Recommend the user start a NEW session for the next
stage — a fresh context window is the mechanism that keeps quality high.
