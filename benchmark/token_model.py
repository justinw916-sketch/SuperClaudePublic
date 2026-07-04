"""
Token-accounting model: one long chat (monolithic) vs bounded-build (a fresh
subagent per stage). This is a DETERMINISTIC accounting simulation of how many
tokens each strategy bills — NOT a live LLM run. All numbers are tokens.

Why a model instead of a live run: token cost is a mechanical property of how
much context is re-read on each model call. A live run just adds noise (fixed
system-prompt overhead dominates small tasks) without changing the mechanism.
Every assumption below is explicit and tweakable — change them and re-run.
"""

# ---- assumptions (per call, in tokens) — conservative, editable ----
P   = 2000   # fixed overhead every model call (system prompt + tool schemas)
F   = 800    # BUILD_PLAN.md a subagent reads once at stage start
M   = 250    # handoff summary appended to BUILD_STATE per completed stage
W   = 6000   # NEW persistent context a stage adds (tool reads + code + reasoning)
K   = 5      # model calls (tool round-trips) per stage
OUT = 400    # output tokens per call (the actual work — ~same either way)

def monolithic(S):
    """One long session: every call re-reads all accumulated context."""
    inp = out = 0
    acc = 0.0
    grow = W / K
    for _stage in range(S):
        for _call in range(K):
            inp += P + acc      # bill the whole context each call
            acc += grow         # context keeps growing, never resets
            out += OUT
    return inp, out

def bounded(S):
    """Each stage runs in its own fresh subagent; parent holds only summaries."""
    inp = out = 0
    grow = W / K
    for stage in range(S):
        acc = F + M * stage      # subagent reads plan + prior handoff summaries only
        for _call in range(K):
            inp += P + acc
            acc += grow          # grows within the stage, then is discarded
            out += OUT
        out += M                 # subagent writes its handoff summary
    pacc = 0                     # parent orchestrator: tiny call per stage
    for _stage in range(S):
        inp += P + pacc
        pacc += M
        out += 100
    return inp, out

print(f"{'stages':>7} | {'mono total':>12} | {'bounded total':>14} | {'total saved':>11} | {'input saved':>11}")
print("-" * 68)
rows = []
for S in (4, 8, 12, 20):
    mi, mo = monolithic(S)
    bi, bo = bounded(S)
    mt, bt = mi + mo, bi + bo
    tot = 100 * (1 - bt / mt)
    ins = 100 * (1 - bi / mi)
    rows.append((S, mt, bt, tot, ins))
    print(f"{S:>7} | {mt:>12,} | {bt:>14,} | {tot:>10.1f}% | {ins:>10.1f}%")
