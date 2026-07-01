---
description: Draft a bounded build plan (BUILD_PLAN.md + BUILD_STATE.md) split into small, one-context stages.
argument-hint: <what to build>
---

You are planning a bounded build. Goal: **$ARGUMENTS**

Produce a plan sized so each stage fits comfortably in one fresh context window
(so quality stays high — context degrades as it fills).

1. Ask up to 3 blocking clarifying questions ONLY if scope, stack, or acceptance
   criteria are genuinely ambiguous (recommended answer + one-line why for each).
2. Write **BUILD_PLAN.md** in the project root:
   - `## Goal` — one paragraph.
   - `## Stack` — languages, frameworks, key deps (default Python / Node / HTML-CSS-Tailwind).
   - `## Acceptance criteria` — testable bullet list.
   - `## Stages` — an ordered list; each stage has a title, the files it
     creates/modifies, its deliverable, and its own verification step. Keep each
     stage to roughly one context window of work.
   - `## Risks / open questions`.
3. Write **BUILD_STATE.md**: `Current stage: 0 (planning)`, `Next: stage 1`, plus
   an empty `## Log` section.
4. Do NOT start building. End by telling the user to review the plan, then run
   `/stage 1` in a fresh session.
