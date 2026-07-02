---
description: Decompose a build into bounded, independently-executable stages. Run this ONCE at the start of any large build. Produces BUILD_PLAN.md.
---

You are decomposing a build into bounded stages per the `bounded-build` skill. Read that
skill now if it is not already loaded.

The user's build goal: $ARGUMENTS

Follow this sequence exactly. Do NOT start building anything — `/plan` only plans.

## 1. Clarify scope (only if genuinely ambiguous)
If the goal is clear enough to decompose, skip straight to step 2. Only ask questions if a
missing decision would change the stage breakdown (e.g. "Postgres or D1?" when it determines
the data-layer stages). Ask at most 2 questions, then proceed.

## 2. Identify decision points
List the architectural decisions this build depends on (stack, schema, auth model, deploy
target, etc.). Treat anything already fixed in the BUILD_PLAN.md `## Stack defaults` block as
decided — only surface decisions NOT covered there. Any decision not yet made becomes its OWN
early stage — never bury a decision inside an implementation stage.

## 3. Decompose into stages
Break the build into stages where each one satisfies the sizing heuristics from the skill:
≤ 8 files, single testable exit criterion, no dependency on an unmade decision, unambiguous
"done." Order them so each stage only depends on outputs of earlier stages.

Prefer MORE, SMALLER stages over fewer large ones. A 12-stage plan that each run finishes
cleanly beats a 5-stage plan where stage 3 blows the context window.

**Make every exit criterion machine-checkable.** Each stage's exit criterion must be an
unambiguous PASS/FAIL a command or inspection can confirm — e.g. `npm test` passes, `GET /health`
returns 200, `dist/app.js` exists. Vague criteria ("looks done") cannot be gated: `/build-all`
halts on any stage whose criterion it can't confirm met, so fuzzy criteria break hands-off runs.

## 4. Write BUILD_PLAN.md
Create `BUILD_PLAN.md` in the working directory with this structure:

```markdown
# Build Plan: <build name>
_Generated: <date>. Source goal: <one line>._

## Stack defaults
_Standing choices for your builds — override per build only when noted._
- **Runtime/language:** Node.js + TypeScript
- **Frontend/UI:** React + shadcn/ui, styled with Tailwind CSS
- **Deploy target:** Cloudflare — Workers for APIs, Pages for front-ends
- **Data layer:** Cloudflare D1 (SQLite-compatible)
- **Auth model:** OPEN — decide per build (make it an early stage)
- **Secrets/config:** env vars — Workers secrets / `.dev.vars`; never hardcode
- **Dev context:** Windows 11 + local Docker; cross-platform paths

## Decisions
- [ ] D1: <decision> — <chosen value or "OPEN — resolved in Stage 0">
- [ ] D2: ...

## Stages
### Stage 1: <imperative title>
- **Goal:** <one sentence>
- **Files:** <expected files touched, or "TBD ≤8">
- **Exit criterion:** <single testable condition>
- **Depends on:** <stage numbers, or "none">

### Stage 2: ...
(repeat)

## Out of scope (this build)
- <things explicitly NOT being built, to prevent scope creep>
```

## 5. Initialize BUILD_STATE.md
Create `BUILD_STATE.md` with:

```markdown
# Build State
_Last updated: <date> by /plan_

## Current position
- **Next stage:** 1
- **Status:** planned, not started

## Completed stages
(none yet)

## Discovered work (not in original plan)
(none yet)

## Open questions / blockers
(none yet)
```

## 6. Stop
Print a one-paragraph summary: number of stages, the critical path, and any OPEN decisions
that Stage 0/1 must resolve. Then instruct the user to run `/stage 1` in a fresh session.
Do NOT begin Stage 1.
