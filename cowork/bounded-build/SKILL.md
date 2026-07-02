---
name: bounded-build
description: Run large, multi-step builds in Cowork WITHOUT context rot — decompose the work into small stages, persist BUILD_PLAN.md and BUILD_STATE.md to disk as external memory, and run each stage in its own isolated subagent so heavy work never piles up in the main conversation. This keeps the main thread small, cheap, and sharp (saves tokens + preserves intelligence). Use when the user asks to build/implement something substantial or multi-step, references bounded-build / /plan / /build-all, or explicitly asks to save tokens or manage the context window on a long task.
---

# Bounded build (Cowork)

**Goal:** keep the main conversation's context small and high-quality on long builds by
(1) writing the plan and progress to **disk** as external memory, and (2) running each stage in
its **own subagent** so the heavy work (file reads, iteration, tests, searches) never accumulates
in the main thread. The main thread only ever sees short per-stage summaries.

**Why it works:** a subagent spends its tokens in its own fresh context and returns a ~5-line
result. So the main context grows slowly (summaries only), staying cheap to re-process each turn
and — more importantly — staying in the high-quality band instead of filling up and rotting.

## When to use vs. not
- **Use it** for substantial multi-step work: features, migrations, multi-file builds, big research
  sweeps — anything that would otherwise fill the window.
- **Skip it** for short single-shot tasks. Spawning a subagent (which re-reads its own files with no
  shared warm context) costs more than it saves for small work — just do those directly.

## Files (external memory) — same format as the Code-tab toolkit, so plans are portable
Write these to the working folder so a brand-new session can resume from them alone:

- **`BUILD_PLAN.md`** — goal, stack, acceptance criteria, and an ordered list of stages. Each stage
  has: a title, the files it will touch (≤ ~8), a **single machine-checkable exit criterion**, and
  its dependencies.
- **`BUILD_STATE.md`** — current stage, next stage, and a dated log of completed stages.

See `reference/templates.md` for ready-to-copy skeletons.

## Procedure

### 1. Plan (once) — then stop
If `BUILD_PLAN.md` doesn't exist, decompose the goal into small stages (prefer MORE, SMALLER
stages over a few large ones). **Every exit criterion must be an unambiguous PASS/FAIL** a command
or inspection can confirm — e.g. "`npm test` passes", "`GET /health` returns 200", "`dist/app.js`
exists". Vague criteria ("looks done") can't be gated. Write `BUILD_PLAN.md`, initialize
`BUILD_STATE.md`, then **stop and let the user review** — do not start building yet.

### 2. Run each stage in a subagent (the context-saving core)
For each remaining stage, delegate to a **subagent** (the Agent tool) with a **self-contained**
brief — the subagent cannot ask the user mid-task, so give it everything:

> "You are executing **stage N** of a bounded build in an isolated context. Read `BUILD_PLAN.md`
> and `BUILD_STATE.md`. Confirm stage N is the correct next stage and its dependencies are complete.
> Do ONLY stage N. Stay inside its boundary; if it turns out to need more than ~8 files or is clearly
> too big, STOP and report that it needs splitting. Verify its exit criterion with real evidence.
> Append a dated handoff entry to `BUILD_STATE.md`. Return ONLY this block:
> `STAGE:` `EXIT_CRITERION: MET|NOT_MET` `BUILT:` (1 line) `FILES:` `NEXT:` `BLOCKERS:`"

The main thread only receives that block — that's what keeps its context small.

### 3. Gate — never skip
Read the block. If `EXIT_CRITERION` is `NOT_MET`, `BLOCKERS` ≠ none, or it reports a mismatch or a
too-big stage → **STOP the whole run**, report which stage failed and why, and recommend the next
step (usually: fix, or re-plan to subdivide). Do not proceed to later stages.

### 4. Checkpoint (default) vs. full-auto
- **Checkpoint (default):** after each `MET` stage, post a 2–3 line summary to the user, then
  continue automatically to the next stage. Only wait for input if the user explicitly asked to
  pause between stages. (Checkpoints are informational — they do not require approval.)
- **Full-auto:** if the user said "run all stages / don't stop / walk away", skip the per-stage
  summaries and run straight through, reporting once at the end.

Both modes still **halt on the gate** — full-auto never means "ignore failures".

### 5. Finish
When the last stage completes, run a verification pass (delegate to a verifier subagent, or check
each acceptance criterion in `BUILD_PLAN.md`) and report **VERIFIED / NOT VERIFIED** with evidence,
then a final summary: stages completed, key decisions, anything deferred.

## Habits that maximize the savings
- Keep each subagent brief **self-contained**; it can't come back to ask you.
- **Persist state every stage** — treat `BUILD_STATE.md` as the source of truth, not the chat.
- Start a **fresh conversation** for unrelated work; within one build, the subagents already give you
  the per-stage "fresh context", so you don't need to reset mid-build.
