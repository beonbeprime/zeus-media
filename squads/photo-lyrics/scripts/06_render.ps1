# 06_render.ps1 - Renderiza o video final via Remotion CLI (NUNCA Studio).
#
# Uso:
#   powershell -File scripts\06_render.ps1 -Project producoes\meu-projeto [-Draft]
#
# Gate: check-manifest.py --gate render precisa passar (zero unmatched).
# Draft: 720x1280 com --scale 0.6667 para aprovacao rapida; final: 1080x1920.
# Depois do render, chama 07_qc.py automaticamente.

param(
    [Parameter(Mandatory = $true)][string]$Project,
    [switch]$Draft
)

$ErrorActionPreference = "Stop"
$squad = Split-Path -Parent $PSScriptRoot
$projectPath = Resolve-Path $Project
$manifest = Join-Path $projectPath "manifest.json"
$renderDir = Join-Path $projectPath "07-render"
New-Item -ItemType Directory -Force $renderDir | Out-Null

# GATE: manifest valido e pronto para render
$py = Join-Path $squad ".venv\Scripts\python.exe"
if (-not (Test-Path $py)) { $py = "python" }
& $py (Join-Path $squad "scripts\check-manifest.py") --project $projectPath --gate render
if ($LASTEXITCODE -ne 0) {
    Write-Host "RENDER BLOQUEADO pelo gate do manifest." -ForegroundColor Red
    exit 1
}

# versionamento vNN
$prefix = if ($Draft) { "draft" } else { "final" }
$existing = Get-ChildItem $renderDir -Filter "$prefix-v*.mp4" | ForEach-Object {
    if ($_.Name -match "v(\d+)") { [int]$Matches[1] }
} | Sort-Object
$v = if ($existing) { $existing[-1] + 1 } else { 1 }
$out = Join-Path $renderDir ("{0}-v{1:d2}.mp4" -f $prefix, $v)

$remotionDir = Join-Path $squad "remotion"
$renderArgs = @(
    "remotion", "render", "PhotoLyrics", $out,
    "--props=$manifest",
    "--public-dir=$projectPath",
    "--codec=h264",
    "--jpeg-quality=90",
    "--log=warn"
)
if ($Draft) { $renderArgs += "--scale=0.5" }  # 540x960 (escala precisa ser inteira em pixels)

Write-Host "RENDER: npx $($renderArgs -join ' ')"
Push-Location $remotionDir
npx @renderArgs
$code = $LASTEXITCODE
Pop-Location
if ($code -ne 0) {
    Write-Host "ERRO: render falhou (exit $code)." -ForegroundColor Red
    exit $code
}

Write-Host "RENDER OK: $out" -ForegroundColor Green

# QC automatico
& $py (Join-Path $squad "scripts\07_qc.py") --project $projectPath --output $out
exit $LASTEXITCODE
