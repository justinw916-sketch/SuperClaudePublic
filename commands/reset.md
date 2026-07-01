---
description: Guidance to reset context cleanly between unrelated tasks.
---

the user wants a clean slate. Do the following, then stop:
1. If a bounded build is in progress, ensure `BUILD_STATE.md` is current (run the
   intent of `/handoff` first if not).
2. Summarize in 3-5 lines: what was just finished, what is next, and the exact
   command to resume.
3. Tell the user to `/clear` now — the polluted context is worse than a fresh start.
