# Token benchmark — bounded-build vs. one long chat

**What this is:** a transparent, deterministic **accounting model** of how many tokens each approach
bills on a multi-stage build. It is **not** a live LLM run — token cost is a mechanical property of
how much context is re-read on each model call, so a model is more reproducible (and free) than a
single noisy run dominated by fixed overhead. Every assumption lives in
[`token_model.py`](token_model.py); change the numbers and re-run.

## The idea

- **One long chat:** every model call re-reads the whole accumulated context, and that context grows
  with each stage → total cost grows roughly **quadratically**.
- **Bounded-build:** each stage runs in its own fresh subagent that reads only the small plan +
  prior handoff summaries → the ballooning re-read cost never accumulates. The actual work produced
  (output tokens) is about the **same** either way; the savings come from not re-reading a giant
  history every call.

## Assumptions (per call, in tokens)

| | value | meaning |
|---|--:|---|
| P | 2,000 | fixed overhead every call (system prompt + tool schemas) |
| W | 6,000 | new persistent context a stage adds (tool reads + code + reasoning) |
| K | 5 | model calls (tool round-trips) per stage |
| M | 250 | handoff summary appended per completed stage |
| F | 800 | plan a subagent reads once at stage start |
| OUT | 400 | output tokens per call (the real work — ~equal in both) |

## Results

| Stages | One long chat | Bounded-build | **Total tokens saved** | (input-only saved) |
|---:|---:|---:|---:|---:|
| 4  | 276,000   | 130,400 | **52.8%** | 54.9% |
| 8  | 1,032,000 | 284,800 | **72.4%** | 73.8% |
| 12 | 2,268,000 | 463,200 | **79.6%** | 80.6% |
| 20 | 6,180,000 | 892,000 | **85.6%** | 86.2% |

**Takeaway:** savings grow with build size — from **~50% at 4 stages to ~85% at 20 stages.** The
bigger and more staged the build, the bigger the win.

## Reproduce

```bash
python token_model.py
```

Edit the assumptions at the top of the script to match your own workload and re-run.

## Honest caveats

- This is a **model, not a measured API bill.** Real projects vary with file sizes, how chatty the
  tools are, and how much each stage actually adds.
- Bounded-build subagents don't share a warm cache, so they re-read their own inputs each stage —
  that cost is already included above.
- Prompt caching (if enabled) lowers both columns but doesn't change the shape of the curve.
- Numbers are for **token cost / context growth**. The separate benefit — quality staying high
  instead of degrading as context fills — is the "context rot" effect documented by Chroma
  ("Context Rot", 2025) and Anthropic ("Effective context engineering").
