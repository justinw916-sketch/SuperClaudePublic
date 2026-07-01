# Install on the Claude Desktop app (Code tab) — quick card

No terminal. No CLI. ~2 minutes.

## 1. Prereqs
- Claude Desktop app installed and signed in.
- **Windows only:** Git for Windows installed (the Code tab needs it the first
  time). Restart the app after installing.

## 2. Install the plugin
+ button (next to prompt box) -> **Plugins** -> **Add plugin** -> add this
marketplace -> install **claude-code-toolkit**.

- Repo marketplace: add `justinw916-sketch/SuperClaudePublic`.
- Local folder marketplace: point at the folder containing
  `.claude-plugin/marketplace.json`.

## 3. Add always-on memory (one-time)
Open `~/.claude/CLAUDE.md` in the file pane and paste `reference/CLAUDE.md`.
(Optional Windows shortcut: run `reference/install-memory.ps1` once.)

## 4. Verify
Type `/` -> you should see `/plan`, `/stage`, `/handoff`, `/verify`, `/review`,
`/ship`. Under **+ -> Skills** you should see `bounded-build`, `operating-rules`,
`review`.

## 5. First run
`/plan build a small tool that ...` -> follow the bounded-build loop.
Before any commit, `/review`.

Note: `/permissions`, `/config`, `/agents`, `/doctor` are terminal-only dialogs
and won't run in the Code tab — manage those from **Customize** in the sidebar and
the app's Settings instead.
