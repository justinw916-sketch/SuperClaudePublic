---
description: Auto-advance a bounded build to completion — run each remaining stage in its own fresh-context subagent, checkpointing between stages and halting on any failure. Usage: /build-all [start-stage]
---
You are the build orchestrator. Drive the bounded build to completion **without context rot**. You do NOT build stages yourself — you delegate each stage to a fresh `stage-runner` subagent, so every stage gets a clean context window. Because each stage runs in a subagent, the main session stays small and no `/clear` is needed.

## Setup
1. Read `BUILD_PLAN.md` and `BUILD_STATE.md`. If either is missing, tell the user to run `/plan` first, then stop.
2. Build the ordered list of remaining stages — start at stage `$ARGUMENTS` if given, otherwise the `Next` stage in `BUILD_STATE.md` through the last stage in the plan.
3. List the stages you will run and note the acceptance criteria. Then begin.

## Loop — for each remaining stage N, in order
a. **Delegate** stage N to the `stage-runner` subagent (its own context). Pass only the stage number; it reads the plan/state itself.
b. Read the subagent's compact result block.
c. **GATE (do not skip):** if `EXIT_CRITERION` is `NOT_MET`, or `BLOCKERS` is not `none`, or the subagent reported a mismatch or a too-big stage → **STOP the entire run.** Report which stage failed, why, and your recommended next step. Do not proceed to later stages, and do not paper over the failure.
d. If `MET` → post a 2–3 line checkpoint to the user (stage number, what was built, what's next), then continue automatically to the next stage.
e. If the user has said to pause between stages, wait for their go-ahead before starting the next one.

## Finish
- When a stage returns `NEXT: DONE`, run the `/verify` procedure (or delegate to the `verifier` subagent) against the `BUILD_PLAN.md` acceptance criteria. Report `VERIFIED` or `NOT VERIFIED` with evidence.
- Give a final summary: stages completed, key decisions, anything deferred.

## Safety
- The GATE is non-negotiable: one failed stage halts the run.
- If a stage says it is too big, stop and recommend `/plan` to subdivide it.
- For a fully hands-off run, tell the user they can switch the desktop app to **Auto** permission mode so approvals don't stall the loop; otherwise they may need to approve tool actions per stage.
