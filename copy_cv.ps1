# copy_cv.ps1
# Copies CV PDF from Downloads (default) or specified path into assets/CV/

$default = Join-Path $env:USERPROFILE 'Downloads\CV_Faris_Nabil_v2.pdf'
$src = Read-Host "Path ke file CV (Enter untuk gunakan $default)"
if ([string]::IsNullOrWhiteSpace($src)) { $src = $default }

if (-not (Test-Path $src)) {
    Write-Host "File tidak ditemukan: $src" -ForegroundColor Red
    exit 1
}

$destDir = Join-Path $PSScriptRoot 'assets\CV'
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
$dest = Join-Path $destDir 'CV_Faris_Nabil_v2.pdf'

Copy-Item -Path $src -Destination $dest -Force
Write-Host "File telah disalin ke: $dest" -ForegroundColor Green
