---
name: bounded-build
description: Structured protocol for building anything non-trivial without context rot — split work into small stages, one fresh context per stage, with BUILD_PLAN.md and BUILD_STATE.md on disk as the source of truth. Use when starting a multi-file feature, app, or migration, when a build is large enough that doing it in one session would fill the context window, or when the user mentions /plan /stage /handoff /verify.
---

# Bounded build

Large builds fail not from lack of capability but from **context rot**: model
quality degrades as the context window fills. The fix is to keep every working
session small and push durable state to disk.

## The loop

`/plan` -> review -> `/stage 1` -> `/handoff` -> `/clear` -> `/stage 2` -> ... -> `/verify` -> `/ship`

- **`/plan <goal>`** writes `BUILD_PLAN.md` (goal, stack, acceptance criteria,
  ordered stages each sized to one context window, risks) and `BUILD_STATE.md`
  (current stage, next stage, empty log). Does NOT build.
- **`/stage N`** executes exactly one stage, verifies it, appends a handoff log
  entry, and stops. One stage per fresh context.
- **`/handoff`** writes the resume note into `BUILD_STATE.md`.
- **`/verify`** independently checks the current stage against acceptance criteria.
- **`/ship`** runs the pre-commit checklist and (on approval) commits.

## Rules that make it work

1. **One stage per context.** After each stage, `/clear` (or start a new Code-tab
   session). Do not carry a stage's working context into the next.
2. **Disk is the source of truth.** `BUILD_PLAN.md` + `BUILD_STATE.md` hold intent
   and progress. A brand-new session resumes from them alone.
3. **Small stages.** If a stage feels like it needs more than one context window,
   split it in the plan first.
4. **Verify every stage** before moving on; delegate high-stakes verification to
   the `verifier` subagent.

## Desktop Code-tab notes

- Run each stage in its own session; use the sidebar to keep them organized.
- Watch the **tasks pane** for subagent/background work spawned during a stage.
- Use the **diff pane** to review a stage's changes before `/ship`.
