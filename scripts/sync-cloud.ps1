# scripts/sync-cloud.ps1
# Miroir automatique du projet C: vers le lecteur cloud P: (hors node_modules et .next)
param(
    [string]$Destination = "P:\Pro\Angeli Visions\Sites web\angeli-visions-website"
)

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
if (-not (Test-Path "P:\")) {
    Write-Host "Lecteur P: non disponible, synchronisation ignoree." -ForegroundColor DarkGray
    exit 0
}

robocopy $root $Destination /MIR /XD "node_modules" ".next" /XF "*.tar.gz" "*.zip" "*.tsbuildinfo" "build_output*.txt" "tsc_errors*.txt" /FFT /R:1 /W:1 /NP /NFL /NDL | Out-Null
Write-Host "Copie cloud (P:) a jour." -ForegroundColor Green
