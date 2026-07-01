#!/usr/bin/env node
// PreToolUse (Bash) guard. Blocks clearly destructive shell commands.
// Fail-open: any internal error exits 0 (allow). Exit 2 = block + reason to stderr.
import { readFileSync } from "node:fs";

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return null; }
}

const DANGER = [
  /\brm\s+-rf?\s+(\/|~|\$HOME|\*)(\s|$)/i,      // rm -rf / ~ *  (root-ish wipes)
  /\bgit\s+push\b[^\n]*(--force|-f)\b/i,        // force push
  /\bgit\s+reset\s+--hard\b/i,                  // hard reset
  /\bgit\s+clean\s+-[a-z]*f/i,                  // git clean -fd
  /--no-verify\b/i,                             // bypassing our own review
  /\bmkfs\.[a-z0-9]+/i,                         // format filesystem
  /\bdd\s+if=.*\bof=\/dev\//i,                  // dd to a device
  /:\(\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;/,       // fork bomb
  /\bchmod\s+-R\s+0*777\s+\//i,                 // recursive 777 on root
  />\s*\/dev\/sd[a-z]/i                         // clobber a raw disk
];

const data = read();
if (!data) process.exit(0);
const cmd = data?.tool_input?.command ?? "";
const hit = DANGER.find((re) => re.test(cmd));
if (hit) {
  process.stderr.write(
    `BLOCKED by danger-check: this command matches a destructive pattern (${hit}).\n` +
    `If this is truly intended, run it yourself in a terminal outside Claude Code.\n`
  );
  process.exit(2);
}
process.exit(0);
