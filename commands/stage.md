---
description: Execute exactly ONE stage of the current build, then stop. Reads state first, writes nothing past the stage boundary. Usage: /stage <number>
---

You are executing a single bounded stage per the `bounded-build` skill. Load that skill if
it is not already loaded.

Target stage: $ARGUMENTS

## 1. Read state FIRST (non-negotiable)
Before doing anything else:
- Read `BUILD_STATE.md` — confirm the requested stage is actually the next one. If the user
  asked for a stage that isn't next (e.g. skipping ahead, or repeating a done stage), STOP
  and flag the mismatch rather than guessing.
- Read `BUILD_PLAN.md` — load the goal, files, exit criterion, and dependencies for THIS
  stage only. Do not read ahead into later stages' details; they are not your job right now.
- Confirm every "Depends on" stage is marked complete in `BUILD_STATE.md`. If a dependency
  is incomplete, STOP and report it.

## 2. Execute the stage — and only this stage
- Do the work described in the plan for this stage.
- Stay inside the boundary. If you find yourself touching files or making decisions that
  belong to a different stage, STOP that drift immediately and log it under "Discovered work."
- If the stage turns out to be too big (heading past ~8 files or clearly past the
  high-quality window), STOP. Do not push through. Update `BUILD_STATE.md` noting the stage
  needs to be split, and recommend the user re-run `/plan` to subdivide it.

## 3. Self-check against the exit criterion
Before declaring the stage done, verify the stage's single exit criterion from the plan is
actually met. State explicitly: "Exit criterion: <criterion> — MET / NOT MET" with evidence
(test output, file contents, a command result). Do not claim done on vibes.

## 4. Hand off
Once the exit criterion is MET, do NOT continue to the next stage. Run the `/handoff`
procedure (or instruct the user to run `/handoff`) so state is written to disk before the
session ends.

If the exit criterion is NOT MET and can't be met this run, record exactly what's blocking
it in `BUILD_STATE.md` under "Open questions / blockers" and stop.

## Reminder
One stage per run. Stopping at the boundary is the entire point — it is what keeps every run
inside the high-quality regime. Chaining stages to "save time" reintroduces the exact
degradation this protocol exists to prevent.
