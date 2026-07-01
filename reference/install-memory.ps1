# install-memory.ps1  (OPTIONAL, Windows) — copies ONLY the always-on memory file
# and the terse-engineer output style into ~/.claude. It does NOT use the claude CLI.
# The plugin (installed via the Desktop Plugin manager) provides everything else.
#
# Run: right-click -> "Run with PowerShell", or:  powershell -ExecutionPolicy Bypass -File .\install-memory.ps1
[CmdletBinding()]
param([switch]$Force)

$ErrorActionPreference = 'Stop'
$here     = Split-Path -Parent $MyInvocation.MyCommand.Path          # ...\reference
$root     = Split-Path -Parent $here                                  # package root
$claude   = Join-Path $env:USERPROFILE '.claude'
$stylesDir= Join-Path $claude 'output-styles'

New-Item -ItemType Directory -Force -Path $claude, $stylesDir | Out-Null

# 1) Merge/append the operating rules into ~/.claude/CLAUDE.md
$src = Join-Path $here 'CLAUDE.md'
$dst = Join-Path $claude 'CLAUDE.md'
if (-not (Test-Path $src)) { throw "Missing $src" }

if (Test-Path $dst) {
    $existing = Get-Content -Raw -Path $dst
    if ($existing -match 'Global operating instructions' -and -not $Force) {
        Write-Host "~/.claude/CLAUDE.md already has operating instructions. Use -Force to overwrite." -ForegroundColor Yellow
    } else {
        $backup = "$dst.backup-$(Get-Date -Format yyyyMMdd-HHmmss)"
        Copy-Item $dst $backup
        Copy-Item $src $dst -Force
        Write-Host "Wrote $dst (backup: $backup)" -ForegroundColor Green
    }
} else {
    Copy-Item $src $dst
    Write-Host "Created $dst" -ForegroundColor Green
}

# 2) Copy the output style (optional convenience)
$styleSrc = Join-Path $root 'output-styles\terse-engineer.md'
if (Test-Path $styleSrc) {
    Copy-Item $styleSrc (Join-Path $stylesDir 'terse-engineer.md') -Force
    Write-Host "Copied terse-engineer output style. Select it in Settings if you want it." -ForegroundColor Green
}

Write-Host "`nDone. Install the plugin from the Desktop Plugin manager for commands/agents/skills/hooks." -ForegroundColor Cyan
