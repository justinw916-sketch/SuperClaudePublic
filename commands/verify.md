---
description: Independently verify the current stage against BUILD_PLAN.md acceptance criteria.
---

Verify the current bounded-build stage. Be skeptical — assume it is broken until
proven otherwise.

1. Read `BUILD_PLAN.md` acceptance criteria and the current stage's deliverable.
2. Check the actual artifacts: run tests, lint, type-check, or exercise the code
   as appropriate. For docs/config, read them back and validate (JSON parses,
   links resolve, paths exist).
3. Run a consistency pass: paths match, versions/dates line up, no contradictions,
   numbers add up.
4. Report `VERIFIED` or `NOT VERIFIED` with a short evidence list. If NOT
   VERIFIED, list the exact failures and the smallest fix for each. For
   high-stakes work, delegate a second-opinion pass to the `verifier` subagent.
