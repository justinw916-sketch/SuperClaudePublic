# Changelog

All notable changes to the Claude Code Toolkit (public edition).

## [2.0.0] — Desktop-app-first edition

A plugin-first Claude Code toolkit built for the **Claude Desktop app (Code tab)**.
Install it from the Plugin manager — no terminal, no CLI required. Identity is a
fill-in template, so you can make it your own.

### Included
- **Zero-config rules:** the operating rules auto-load every session via the plugin SessionStart hook — no `~/.claude/CLAUDE.md` editing required (that file is optional personalization).
- **Bounded-build workflow:** `/plan /stage /handoff /verify /reset /ship /trim`.
- **In-session `/review`** + `review-agent` subagent — reviews your working diff
  in the Code tab and emits an APPROVE / REQUEST_CHANGES / REJECT verdict. No CI,
  no network; the review is entirely local.
- **`operating-rules` skill** + `terse-engineer` output style — the rules of
  engagement, delivered by the plugin.
- **Tailored subagents:** planner, verifier, researcher, debugger,
  security-reviewer, network-infra, web-cloudflare.
- **Deterministic hooks** (fail-open Node): `danger-check` (blocks destructive
  shell commands), `secret-scan` (blocks writing high-confidence secrets),
  `session-start` (primes each session).
- **Docs:** a Code-tab usage guide and scheduled-task recipes (`docs/`).
- **`reference/CLAUDE.md`** — a template you fill in and paste into
  `~/.claude/CLAUDE.md` for always-on memory.

### Notes
- Headless `claude -p` and the Agent SDK are not available in the Desktop Code
  tab; this edition uses the in-session `/review` instead.
- `/permissions`, `/config`, `/agents`, `/doctor` are terminal-only dialogs and
  don't run in the Code tab — manage those via **Customize** in the sidebar.
- Windows: the first Code-tab launch requires Git for Windows installed.

Sources: [Desktop app](https://code.claude.com/docs/en/desktop) ·
[Scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks) ·
[Plugins](https://code.claude.com/docs/en/plugins) · [Hooks](https://code.claude.com/docs/en/hooks)
