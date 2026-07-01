---
name: review
description: Run an in-session code review before committing — a desktop-native replacement for a headless pre-commit hook. Use when the user says "review my changes", "review before I commit", "/review", "is this safe to commit", or after finishing an edit and about to commit in the Code tab. Reviews staged/uncommitted diffs for security, correctness, and quality, returns a VERDICT, and (on approval) helps stage and commit.
---

# /review — in-session pre-commit review (desktop-first)

The desktop Code tab does not run headless `claude -p`, so instead of a
background git hook this skill does the review **inside your session**, where you
can see the diff pane and approve. Run it before every commit.

## Procedure

1. **Gather the diff.** Run `git diff --staged` (or `git diff` if nothing is
   staged yet) and `git status --short`. If the repo is large, focus on changed
   files only. Show the diff pane alongside so the user can follow.
2. **Review against this checklist** (block-worthy items in bold):
   - **Secrets**: no hardcoded API keys, tokens, passwords, connection strings,
     private keys. Check for `.env` files staged by accident.
   - **Security**: **injection** (SQL/shell/HTML), unvalidated external input at
     trust boundaries, use of `random`/`Math.random` for anything security-facing
     (should be `secrets`/`crypto.randomBytes`), path traversal, unsafe deserialize.
   - **Correctness**: obvious logic errors, off-by-one, unhandled `None`/`null`,
     swallowed exceptions, missing `await`, race conditions.
   - **Error handling**: external calls wrapped, inputs validated, failures loud
     not silent.
   - **PII / logging**: no PII or credentials in logs or error output.
   - **Windows**: cross-platform paths (`pathlib.Path` / `path.join`), no
     Unix-only assumptions unless intended.
   - **Tests**: new logic ships with tests unless explicitly opted out.
3. **Emit a verdict** in this exact shape:
   ```
   VERDICT: APPROVE | REQUEST_CHANGES | REJECT
   Summary: <one line>
   Findings:
     [BLOCKER]  file:line — issue — fix
     [WARNING]  file:line — issue — fix
     [NOTE]     file:line — issue
   ```
   - **REJECT** = a BLOCKER (secret, injection, data-loss risk). Do not commit.
   - **REQUEST_CHANGES** = warnings worth fixing first.
   - **APPROVE** = clean or notes-only.
4. **On APPROVE and the user's go-ahead**: stage files **by name** (never
   `git add -A` / `git add .`), write an imperative-mood commit subject (<=50 char
   soft cap) with a body explaining *why*, and commit. Never use `--no-verify`,
   `--force`, `reset --hard`, or `rebase -i` without an explicit instruction.

## Notes

- Fail-open by design: this is guidance, not a gate. the user decides.
- For a deeper second opinion on a risky change, hand off to the
  **review-agent** subagent (separate context) and fold its verdict in.
- This replaces the CLI `ci/` hook that shelled out to `claude -p`. If you *also*
  use the CLI on some machine, that hook can still run there; on desktop-only
  machines, run `/review` instead.
