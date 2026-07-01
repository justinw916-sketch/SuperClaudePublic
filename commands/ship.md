---
description: Final pre-ship checklist before committing or releasing.
---

Run the ship checklist for the current change. Do not commit until each item is
green or explicitly waived:
- **/review** run and VERDICT is APPROVE (no BLOCKERs).
- Tests pass; new logic has tests.
- No secrets, no `.env`, no PII in logs.
- Docs / README updated if behavior changed.
- Version bumped if this is a release.
Then, on the user's go-ahead: stage files by name, write an imperative commit
subject with a "why" body, and commit. Never `--no-verify` / `--force` without an
explicit instruction.
