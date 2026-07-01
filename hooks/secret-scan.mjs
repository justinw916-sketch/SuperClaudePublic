#!/usr/bin/env node
// PreToolUse (Write|Edit) guard. Blocks writing high-confidence secrets to disk.
// Fail-open on error. Exit 2 = block + reason to stderr.
import { readFileSync } from "node:fs";

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return null; }
}

const SECRETS = [
  { name: "private key block", re: /-----BEGIN (RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/ },
  { name: "AWS access key id", re: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Anthropic API key", re: /\bsk-ant-[A-Za-z0-9\-_]{20,}/ },
  { name: "OpenAI API key", re: /\bsk-[A-Za-z0-9]{40,}\b/ },
  { name: "GitHub token", re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/ },
  { name: "Slack token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/ },
  { name: "Google API key", re: /\bAIza[0-9A-Za-z\-_]{35}\b/ }
];

const data = read();
if (!data) process.exit(0);
const ti = data?.tool_input ?? {};
const content = [ti.content, ti.new_string, ti.newString].filter(Boolean).join("\n");
if (!content) process.exit(0);

const hit = SECRETS.find((s) => s.re.test(content));
if (hit) {
  process.stderr.write(
    `BLOCKED by secret-scan: content looks like a ${hit.name}. ` +
    `Do not commit secrets to files. Use environment variables / a secrets store instead.\n`
  );
  process.exit(2);
}
process.exit(0);
