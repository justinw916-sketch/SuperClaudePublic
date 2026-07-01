#!/usr/bin/env node
// SessionStart hook. Emits a short reminder that becomes session context.
// Fail-open: never throws.
try {
  process.stdout.write(
    "Toolkit active. For non-trivial builds use the bounded-build loop " +
    "(/plan -> /stage N -> /handoff -> /clear -> /verify). Run /review before committing. " +
    "Operating rules: never fabricate, cite sources, push back, production-ready, Windows-first.\n"
  );
} catch {}
process.exit(0);
