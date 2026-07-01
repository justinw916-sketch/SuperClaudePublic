---
description: Write a clean handoff to BUILD_STATE.md so the next fresh session can resume with minimal context.
---

Write a handoff for the current bounded-build stage.

Append a dated entry to `BUILD_STATE.md` under `## Log` capturing, tersely:
- **Stage** just completed and its deliverable.
- **Files created/modified** (paths).
- **Key decisions** and any deviations from `BUILD_PLAN.md`.
- **How it was verified** (test/diff/manual) and the result.
- **Next stage** number + the single most important thing the next session must
  know to resume.

Update the header: `Current stage: <N> (done)`, `Next: stage <N+1>`.

Then tell the user exactly what to paste next: `/clear`, then `/stage <N+1>`.
Do not carry the stage's working context forward — the Log is the source of truth.
