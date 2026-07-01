---
description: Audit the current session for token bloat and recommend a compaction strategy
---

Analyze this session for token waste. Report:

1. **Heaviest consumers** — which tool results or file reads ate the most tokens?
2. **Redundancy** — any file read more than once, any repeated research, any correction loops?
3. **Delegable work** — what should have gone to a subagent but stayed in the main thread?
4. **Recommended action** — pick one:
   - `/clear` and restart with a sharper prompt (if current task is polluted beyond saving)
   - `/compact [specific instructions]` (if mid-task but bloated — give me the exact compact instruction to use)
   - Continue as-is (if the weight is justified)

One paragraph per section. No code, no tool calls beyond what's needed to check file state.
