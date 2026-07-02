# Claude Code Toolkit — Desktop-app-first edition (v2.0.0)

[![Claude Code plugin](https://img.shields.io/badge/Claude_Code-plugin-7c9cff)](https://github.com/justinw916-sketch/SuperClaudePublic) [![License: MIT](https://img.shields.io/badge/License-MIT-3fb950.svg)](LICENSE) [![Docs](https://img.shields.io/badge/docs-GitHub_Pages-5eead4)](https://justinw916-sketch.github.io/SuperClaudePublic/)

## Quickstart — Claude Desktop app (no terminal)

1. Open the **Code** tab → **+ → Plugins → Add plugin**.
2. Add marketplace `justinw916-sketch/SuperClaudePublic`, then install **claude-code-toolkit**.
3. Restart the Code tab — done. The operating rules load automatically via the plugin; there are no files to edit.
4. Type `/` — you should see `/plan`, `/stage`, `/review`, etc. (Optional: add your own `~/.claude/CLAUDE.md` to personalize identity.)

Full steps: [DEPLOY.md](DEPLOY.md) · Rendered docs: https://justinw916-sketch.github.io/SuperClaudePublic/

---

A single, app-focused Claude Code configuration you install from the **Desktop
Plugin manager** — no terminal, no CLI. It keeps Claude sharp deep into long
sessions with a bounded-build workflow, always-on operating rules, deterministic
safety hooks, tailored subagents, and an in-session `/review`.

This edition is the canonical replacement for the older CLI-oriented toolkit.
Everything here is designed for the **Claude Desktop app -> Code tab**.

---

## What's inside

| Layer | Ships as | Delivered by |
|-------|----------|--------------|
| Bounded-build workflow | `/plan` `/stage` `/handoff` `/verify` `/reset` `/ship` `/trim` | plugin `commands/` |
| Auto-advance builds | `/build-all` (checkpoint) + `/build-all-auto` (full-auto) — a fresh subagent per stage | plugin `commands/`, `agents/` |
| In-session code review | `/review` skill + `review-agent` subagent | plugin `skills/`, `agents/` |
| Operating rules | `operating-rules` skill + `terse-engineer` output style | plugin + `reference/` |
| Tailored subagents | planner, verifier, researcher, debugger, security-reviewer, network-infra, web-cloudflare, stage-runner | plugin `agents/` |
| Safety hooks | destructive-command guard, secret-scan, session primer | plugin `hooks/` |
| Always-on rules | auto-injected each session (SessionStart hook) — zero setup | plugin `hooks/` |

The operating rules load automatically every session via the plugin SessionStart hook,
so there is nothing to paste. A personal **`~/.claude/CLAUDE.md`** and the **output style** are an
optional personalization. Everything else installs with the plugin.

---

## Deploy on a new PC (no terminal)

**Step 1 — Install the plugin (Desktop Code tab):**

1. Open the **Claude Desktop app -> Code** tab.
2. Click the **+** button next to the prompt box -> **Plugins** -> **Add plugin**.
3. Add this folder/repo as a marketplace, then install **claude-code-toolkit**.
   - From a Git repo: add the marketplace by URL, e.g.
     `justinw916-sketch/SuperClaudePublic`.
   - From this local folder: point the marketplace at the folder that contains
     `.claude-plugin/marketplace.json`.

That installs all commands, agents, skills, and hooks. Restart the Code tab if a
new command doesn't show up immediately.

**Step 2 — (Optional) personalize your identity:**

Open `~/.claude/CLAUDE.md` in the Code tab's file editor (Windows:
`C:\Users\<you>\.claude\CLAUDE.md`) and paste the contents of
[`reference/CLAUDE.md`](reference/CLAUDE.md). The Code tab reads this on every
session. Optionally copy `output-styles/terse-engineer.md` into
`~/.claude/output-styles/` and select it as your output style.

> Prefer one click? On Windows you can run `reference/install-memory.ps1` once
> (double-click or right-click -> Run with PowerShell). It only copies the memory
> file and output style — it does **not** use the `claude` CLI.

**Step 3 — Verify:** in a Code-tab session, type `/` and confirm `/plan`,
`/stage`, `/review` appear, and that the `operating-rules` skill is listed under
**+ -> Skills**.

---

## Daily use (Code tab)

- **Build something real:** `/plan <goal>` -> review `BUILD_PLAN.md` -> `/stage 1`
  -> `/handoff` -> `/clear` -> `/stage 2` -> ... -> `/verify` -> `/ship`.
  One stage per fresh session keeps context small so quality stays high.
- **Before committing:** run `/review`. It reviews your diff in-session and emits
  a VERDICT; for risky changes it can hand off to the `review-agent` subagent.
- **Recurring automation:** use the Desktop app's **Scheduled tasks**
  (Settings / the scheduled-tasks feature), not cron or the Agent SDK — those are
  CLI-only.

## What this edition intentionally drops vs. the old CLI toolkit

- The headless `ci/` pre-commit reviewer that shelled out to `claude -p`
  (**headless is not available in the Desktop Code tab**). Replaced by `/review`.
- Emphasis on the terminal **statusLine** (the Desktop app shows its own session
  status UI). The setting is harmless if you keep it but it won't render in the GUI.
- Community-authored skills (not redistributed here). Add any you want from their
  own marketplaces via **+ -> Plugins**.

Sources: [Claude Code Desktop app](https://code.claude.com/docs/en/desktop) ·
[Desktop scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks) ·
[Plugins](https://code.claude.com/docs/en/plugins) · [Hooks](https://code.claude.com/docs/en/hooks)

---

## Documentation (rendered)

Once GitHub Pages is enabled (Settings → Pages → Source: `main` / `/docs`), the
visual guides are live at:

- **Using the toolkit in the Desktop Code tab** —
  https://justinw916-sketch.github.io/SuperClaudePublic/using-in-claude-code-desktop.html
- **Scheduled-task recipes** —
  https://justinw916-sketch.github.io/SuperClaudePublic/scheduled-task-recipes.html

(Source files: [`docs/using-in-claude-code-desktop.html`](docs/using-in-claude-code-desktop.html),
[`docs/scheduled-task-recipes.html`](docs/scheduled-task-recipes.html).)

## Deploy prompt

See [`DEPLOY.md`](DEPLOY.md) for step-by-step deployment, or paste
[`deploy-prompt.txt`](deploy-prompt.txt) into Claude Code on a new machine to have
it set everything up for you.

---

## Using it in Cowork (not the Code tab)

The plugin's slash commands (`/plan`, `/build-all`, `/review`) are for the **Code tab**. For
**Cowork** (the desktop app's agent mode, where those slash commands don't apply), this repo also
ships companion **skills** in [`cowork/`](cowork/):

- **bounded-build** — the same context-saving loop (plan to disk, run each stage in its own
  subagent) as a Cowork skill.
- **code-review** — in-session review of your working git diff, with an
  APPROVE / REQUEST_CHANGES / REJECT verdict.

Install by opening a `cowork/*.skill` file in Cowork and clicking **Save skill**. Details in
[`cowork/README.md`](cowork/README.md).
