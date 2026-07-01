---
description: Pre-ship checklist — validate, verify, then commit
argument-hint: "[optional commit message]"
---

Before shipping, run this in order. Stop at the first failure and report.

1. **Diff review** — `git status` and `git diff`. Summarize the change in 3–5 bullets focused on the *why*.
2. **Sanity check** — any secrets, debug prints, `TODO`/`XXX`/`FIXME` accidentally committed? Any files that shouldn't be staged?
3. **Tests** — run the relevant test command. If the project is JS/TS, default to `npm test`. If Python, check for `pytest` / `uv run pytest`. If unclear, ask.
4. **Lint/format** — run the project's lint/format command. Fix or report.
5. **Commit** — if everything is green, stage the files explicitly (never `-A` / `.`) and commit with an imperative-mood subject + body explaining why. Use the arg `$ARGUMENTS` as the message if provided; otherwise draft one and show it for approval before committing.
6. **Post-commit report** — `git log -1 --stat` and confirm branch state.

Do NOT push unless I explicitly ask.
