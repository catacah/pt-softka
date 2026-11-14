<#
.SYNOPSIS
    Instala k6 en Windows para poder ejecutar el ejercicio 3.

.DESCRIPTION
    Intenta tres caminos, en este orden:
      1. k6 ya esta disponible -> no hace nada.
      2. winget install --exact --id GrafanaLabs.k6  (instalacion del sistema).
      3. Descarga el zip oficial del release y deja k6.exe en herramientas/,
         sin instalar nada ni tocar el PATH (la carpeta esta en .gitignore y
         los scripts de ejecucion la buscan ahi).

.PARAMETER Version
    Version de k6 a descargar en el camino 3. Por defecto, la verificada en
    este ejercicio.

.PARAMETER Portable
    Saltea winget y usa directamente la descarga portable.

.EXAMPLE
    .\scripts\instalar-k6.ps1
.EXAMPLE
    .\scripts\instalar-k6.ps1 -Portable
#>
[CmdletBinding()]
param(
    [string]$Version = '2.4.0',
    [switch]$Portable
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot

# ---- 1. Ya esta instalado? ------------------------------------------------
$comando = Get-Command k6 -ErrorAction SilentlyContinue
if ($comando) {
    Write-Host "k6 ya esta disponible: $((& k6 version) -join ' ')" -ForegroundColor Green
    Write-Host "Ejecutable: $($comando.Source)"
    exit 0
}

$instalado = Join-Path $env:ProgramFiles 'k6\k6.exe'
if (Test-Path $instalado) {
    Write-Host "k6 ya esta instalado en $instalado" -ForegroundColor Green
    Write-Host 'Si "k6" no se reconoce en la consola, abrir una terminal nueva (el PATH se'
    Write-Host 'actualiza al iniciar sesion) o usar los scripts de scripts/, que lo resuelven solos.'
    exit 0
}

# ---- 2. winget ------------------------------------------------------------
if (-not $Portable) {
    if (Get-Command winget -ErrorAction SilentlyContinue) {
        Write-Host 'Instalando k6 con winget...' -ForegroundColor Cyan
        winget install --exact --id GrafanaLabs.k6 `
            --accept-package-agreements --accept-source-agreements --disable-interactivity
        if ($LASTEXITCODE -eq 0 -and (Test-Path $instalado)) {
            Write-Host ''
            Write-Host "k6 instalado en $instalado" -ForegroundColor Green
            Write-Host 'Abrir una terminal nueva para que "k6" quede en el PATH.'
            exit 0
        }
        Write-Host 'winget no pudo instalar k6; se intenta la descarga portable.' -ForegroundColor Yellow
    } else {
        Write-Host 'winget no esta disponible; se intenta la descarga portable.' -ForegroundColor Yellow
    }
}

# ---- 3. Descarga portable -------------------------------------------------
$carpeta = Join-Path $raiz 'herramientas'
if (-not (Test-Path $carpeta)) {
    $null = New-Item -ItemType Directory -Path $carpeta
}

$nombre = "k6-v$Version-windows-amd64"
$url = "https://github.com/grafana/k6/releases/download/v$Version/$nombre.zip"
$zip = Join-Path $carpeta "$nombre.zip"

Write-Host "Descargando $url" -ForegroundColor Cyan
Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing

Write-Host 'Descomprimiendo...' -ForegroundColor Cyan
Expand-Archive -Path $zip -DestinationPath $carpeta -Force

$exe = Get-ChildItem -Path $carpeta -Filter 'k6.exe' -Recurse | Select-Object -First 1
if (-not $exe) {
    Write-Host 'El zip no contenia k6.exe' -ForegroundColor Red
    exit 1
}

$destino = Join-Path $carpeta 'k6.exe'
if ($exe.FullName -ne $destino) {
    Move-Item -Path $exe.FullName -Destination $destino -Force
    Remove-Item -Path (Join-Path $carpeta $nombre) -Recurse -Force -ErrorAction SilentlyContinue
}
Remove-Item -Path $zip -Force

Write-Host ''
Write-Host "k6 portable listo: $destino" -ForegroundColor Green
Write-Host "Version: $((& $destino version) -join ' ')"
Write-Host 'Los scripts de scripts/ lo encuentran ahi automaticamente.'
