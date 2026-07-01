# Deploy SuperClaude on a machine

Two ways: the **Desktop app UI** (no terminal) or the **paste-to-Claude prompt**.
Pick either. ~2 minutes.

## Option A — Desktop app (no terminal)

1. Open the Claude Desktop app → **Code** tab.
2. Click **+** (next to the prompt box) → **Plugins** → **Add plugin**.
3. Add the marketplace: `justinw916-sketch/SuperClaudePublic`
4. Install the plugin **claude-code-toolkit**. Restart the Code tab if a new
   command doesn't appear.
5. One-time memory: open `~/.claude/CLAUDE.md` in the file pane and paste the
   contents of [`reference/CLAUDE.md`](reference/CLAUDE.md). (Windows shortcut:
   run `reference/install-memory.ps1` once — it does not use the CLI.)
6. Verify: type `/` → you should see `/plan`, `/stage`, `/handoff`, `/verify`,
   `/review`, `/ship`. Under **+ → Skills**: `bounded-build`, `operating-rules`,
   `review`.

## Option B — paste-to-Claude prompt

Paste the contents of [`deploy-prompt.txt`](deploy-prompt.txt) into a Claude Code
session on the new machine and let it do the install + memory setup + verification.

## Option C — CLI (if you use it)

```bash
claude plugin marketplace add justinw916-sketch/SuperClaudePublic
claude plugin install claude-code-toolkit@superclaude-public
claude plugin list
```

## Note on duplicates
If a machine already has older bounded-build commands in `~/.claude/commands/`
(plan.md, stage.md, ...), they duplicate the plugin's. Back them up and remove
them so the plugin is the single source:

```bash
mkdir -p ~/.claude/_pre-plugin-backup
mv ~/.claude/commands/{plan,stage,handoff,verify,reset,ship,trim}.md ~/.claude/_pre-plugin-backup/ 2>/dev/null
mv ~/.claude/skills/bounded-build ~/.claude/_pre-plugin-backup/ 2>/dev/null
```
