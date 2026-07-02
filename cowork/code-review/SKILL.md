---
name: code-review
description: Review your working code changes before committing — a Cowork in-session code review. Gathers the git diff (staged or uncommitted), checks it for secrets, injection, correctness, error handling, PII in logs, and missing tests, and emits an APPROVE / REQUEST_CHANGES / REJECT verdict with file:line findings and concrete fixes. For risky changes it delegates a second-opinion review to a subagent. Use when the user says "review my changes", "review before I commit", "is this safe to commit", or after finishing edits in a repo.
---

# Code review (Cowork)

Review the working changes in a git repo and return a clear verdict **before** the user commits.
This is a local, in-session review — no CI, no network.

## Procedure

1. **Gather the diff.** Run `git status --short` and `git diff` (and `git diff --staged` if anything
   is staged). If the repo is large, focus on changed files only. If there are no changes, say so
   and stop.
2. **Review against this checklist** (block-worthy items in bold):
   - **Secrets**: no hardcoded API keys, tokens, passwords, or private keys; no stray `.env` staged.
   - **Security**: **injection** (SQL/shell/HTML/template), unvalidated external input at trust
     boundaries, weak randomness for security use (require `secrets` / `crypto.randomBytes`), path
     traversal, unsafe deserialization, auth/authz gaps.
   - **Correctness**: logic errors, off-by-one, unhandled null/None, swallowed exceptions, missing
     `await`, race conditions, resource leaks.
   - **Robustness**: external calls wrapped, inputs validated, failures loud not silent.
   - **Hygiene**: no PII/credentials in logs; cross-platform paths; new logic has tests.
3. **Emit the verdict** in this exact shape:
   ```
   VERDICT: APPROVE | REQUEST_CHANGES | REJECT
   Summary: <one line>
   Findings:
     [BLOCKER]  file:line — issue — concrete fix
     [WARNING]  file:line — issue — concrete fix
     [NOTE]     file:line — issue
   Tests: <present / missing / n/a>
   ```
   - **REJECT** only for a true BLOCKER (secret, injection, data-loss/corruption risk).
   - Every finding cites `file:line` and gives a concrete fix. Never fabricate a line number; if you
     can't verify something (needs runtime or external state), say so explicitly.
4. **Second opinion (risky changes):** for a high-stakes or security-sensitive change, delegate a
   review to a **subagent** (the Agent tool) with the diff, and fold its verdict into yours.
5. **On APPROVE + the user's go-ahead:** help stage files **by name** (never `git add -A` or `.`)
   and write an imperative commit subject with a "why" body. Never use `--no-verify` / `--force`
   unless the user explicitly says so.

## Notes
- This is guidance, not a hard gate — the user decides. Fail-open.
- Windows-first paths; assume PowerShell for any local commands unless told otherwise.
