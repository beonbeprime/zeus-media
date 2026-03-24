# Zeus Media - Instalador Automatico
# Cole este comando no PowerShell:
# irm https://raw.githubusercontent.com/beonbeprime/zeus-media/main/install.ps1 | iex

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  ZEUS MEDIA - Instalador Automatico" -ForegroundColor Cyan
Write-Host "  Sistema de Producao de Midia Visual" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se git esta instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] Git nao encontrado. Instale em: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

# Definir pasta de instalacao
$installPath = "$env:USERPROFILE\Desktop\zeus-media"

# Verificar se ja existe
if (Test-Path $installPath) {
    Write-Host "[INFO] Zeus Media ja existe em $installPath" -ForegroundColor Yellow
    Write-Host "[INFO] Atualizando..." -ForegroundColor Yellow
    Set-Location $installPath
    git pull origin main
} else {
    Write-Host "[INFO] Clonando Zeus Media..." -ForegroundColor Green
    git clone https://github.com/beonbeprime/zeus-media.git $installPath
    Set-Location $installPath
}

# Criar pastas de assets se nao existem
$folders = @(
    "assets\carousels",
    "assets\videos",
    "assets\icons\library",
    "assets\exports"
)

foreach ($folder in $folders) {
    $fullPath = Join-Path $installPath $folder
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  Zeus Media instalado com sucesso!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "  1. Abra o Claude Code" -ForegroundColor White
Write-Host "  2. Navegue ate: $installPath" -ForegroundColor White
Write-Host "  3. O sistema vai configurar tudo automaticamente" -ForegroundColor White
Write-Host ""
Write-Host "Ou rode direto:" -ForegroundColor Cyan
Write-Host "  cd $installPath" -ForegroundColor Yellow
Write-Host "  claude" -ForegroundColor Yellow
Write-Host ""
