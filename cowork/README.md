# Cowork skills

Companion skills for **Cowork** (the desktop app's agent mode), where the Code-tab plugin's
slash commands don't apply. They bring the same context-management and review workflow to Cowork
using skills + subagents.

- **bounded-build** — run large builds without context rot: plan to disk, then run each stage in
  its own subagent so the main conversation stays small and sharp (saves tokens + preserves quality).
- **code-review** — in-session review of your working git diff; emits an APPROVE / REQUEST_CHANGES /
  REJECT verdict with file:line findings.

## Install (Cowork)
Open the matching `.skill` file in Cowork and click **Save skill**. Each folder is the editable
source; the `*.skill` is the installable package. For the Code tab, use the plugin instead
(`/plan`, `/build-all`, `/review`).
