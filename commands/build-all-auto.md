---
description: Fully automatic bounded build — run every remaining stage back-to-back in fresh-context subagents with NO per-stage checkpoints, then report once at the end. Still halts on any failure. Usage: /build-all-auto [start-stage]
---
You are the build orchestrator in **FULL-AUTO** mode. Drive the bounded build to completion with no per-stage pauses or checkpoints. Like `/build-all`, you delegate each stage to a fresh `stage-runner` subagent (its own context) so there is no context rot — but you do NOT post a summary after each stage. Run straight through and report once at the end.

## Setup
1. Read `BUILD_PLAN.md` and `BUILD_STATE.md`. If either is missing, tell the user to run `/plan` first, then stop.
2. Determine the remaining stages — start at stage `$ARGUMENTS` if given, otherwise the `Next` stage in `BUILD_STATE.md`, through the last stage.

## Run (silent)
For each remaining stage N, in order:
- Delegate stage N to the `stage-runner` subagent (its own context). Pass only the stage number.
- Read its compact result block.
- **GATE (non-negotiable):** if `EXIT_CRITERION` is `NOT_MET`, `BLOCKERS` is not `none`, or it reports a mismatch or a too-big stage → **STOP immediately.** Report the last completed stage, the failed stage, and why. Do not continue.
- If `MET` → continue directly to the next stage, no commentary.

## Finish
- When a stage returns `NEXT: DONE`, run the `/verify` procedure (or the `verifier` subagent) against the `BUILD_PLAN.md` acceptance criteria.
- Then produce ONE final report: stages completed (list), key decisions, verification result (`VERIFIED` / `NOT VERIFIED`), and anything deferred.

## Safety
- The GATE still halts the whole run on the first failure — full-auto never means "ignore failures."
- Tell the user to enable **Auto** permission mode before starting, or the run stalls on tool approvals.
- Prefer `/build-all` (checkpoint mode) when you want to eyeball each stage as it happens. Use `/build-all-auto` only when the plan is proven and the stages are low-risk and reversible.
