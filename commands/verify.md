---
description: Independently verify a completed build against its plan. Run once all stages are done. Read-only — does not fix, only reports.
---

You are doing an independent verification pass per the `bounded-build` skill. Your job is to
check, not to build. Treat this like a fresh reviewer who did not write the code.

## 1. Load the contract
- Read `BUILD_PLAN.md` — this is the spec the build is measured against.
- Read `BUILD_STATE.md` — confirm it claims all stages complete. If it doesn't, STOP and
  tell the user the build isn't finished; point them to the next stage.

## 2. Check each stage's exit criterion — independently
For every stage in the plan, independently confirm its exit criterion actually holds in the
current codebase. Do not trust `BUILD_STATE.md`'s claim that it was met — re-check against
the real files / tests / commands. For each:

```
Stage <N>: <title>
  Exit criterion: <criterion>
  Verified: PASS / FAIL / CAN'T TELL
  Evidence: <what you actually checked>
```

## 3. Cross-stage integrity
Check the things that individual stages can't catch on their own:
- Do the stages actually fit together (imports resolve, interfaces match, no orphaned code)?
- Did any later stage silently break an earlier stage's exit criterion?
- Is anything in "Out of scope" accidentally present? Is anything in scope missing?
- Does "Discovered work" contain items that should block sign-off?

## 4. Report — do not fix
Produce a verdict:
- **Build status:** COMPLETE / INCOMPLETE / COMPLETE-WITH-ISSUES
- **Passed:** <count>/<total> stage criteria
- **Issues found:** prioritized list, each with the stage it traces to
- **Recommended next action:** if issues exist, recommend re-planning the fixes as new
  stages (`/plan` for the fix set) rather than ad-hoc patching — keep the same discipline
  on the cleanup that you used on the build.

Do NOT fix issues in this run. Verification stays read-only so the report is trustworthy.
If the user wants fixes, that's a new `/plan` → `/stage` cycle.
