# Templates — BUILD_PLAN.md and BUILD_STATE.md

Copy these skeletons when starting a bounded build. Same format as the Code-tab toolkit, so a
plan started in Cowork can be resumed in the Claude Code Code tab and vice versa.

## BUILD_PLAN.md

```markdown
# Build Plan: <build name>
_Generated: <date>. Source goal: <one line>._

## Stack
- Runtime/language: <e.g. Node.js + TypeScript>
- Frontend/UI: <e.g. React + Tailwind, or n/a>
- Deploy target: <e.g. Cloudflare Workers/Pages, or n/a>
- Data layer: <e.g. SQLite / D1 / Postgres, or n/a>

## Acceptance criteria
- [ ] <testable, whole-build success condition>
- [ ] <...>

## Stages
### Stage 1: <imperative title>
- Goal: <one sentence>
- Files: <expected files, or "TBD <=8">
- Exit criterion: <SINGLE machine-checkable PASS/FAIL, e.g. "npm test passes">
- Depends on: <stage numbers, or "none">

### Stage 2: ...
(repeat — prefer more, smaller stages)

## Out of scope (this build)
- <things explicitly NOT being built>
```

## BUILD_STATE.md

```markdown
# Build State
_Last updated: <date>_

## Current position
- Next stage: 1
- Status: planned, not started

## Completed stages
(none yet)

## Discovered work (not in original plan)
(none yet)

## Open questions / blockers
(none yet)
```

## Per-stage handoff entry (appended to BUILD_STATE.md by each stage subagent)

```markdown
### Stage <N> — <title> — <date>
- Built: <what was produced>
- Files: <paths touched>
- Exit criterion: <criterion> — MET (<evidence>)
- Decisions: <any deviations from the plan>
- Next: stage <N+1>
```
