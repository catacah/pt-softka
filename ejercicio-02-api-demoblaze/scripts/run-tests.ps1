<#
.SYNOPSIS
    Ejecuta las pruebas REST de signup y login de Demoblaze y abre el reporte de Karate.

.DESCRIPTION
    Envoltura sobre "mvnw clean test". No requiere Maven instalado: el Maven Wrapper
    descarga la distribucion la primera vez que se ejecuta. Tampoco requiere navegador:
    son pruebas de servicios.

.PARAMETER Tags
    Filtra los casos por etiqueta, por ejemplo "@smoke", "@signup", "@login" o "@CP03".

.PARAMETER BaseUrl
    Apunta las pruebas a otra URL base (por defecto https://api.demoblaze.com).

.PARAMETER NoReport
    No abre el reporte HTML al terminar.

.EXAMPLE
    .\scripts\run-tests.ps1

.EXAMPLE
    .\scripts\run-tests.ps1 -Tags "@login"
#>
[CmdletBinding()]
param(
    [string]$Tags = "",
    [string]$BaseUrl = "",
    [switch]$NoReport
)

$ErrorActionPreference = "Stop"

# Consola en UTF-8 para que los acentos de los nombres de los casos se vean bien
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }

# El script vive en /scripts, el proyecto es la carpeta padre
$proyecto = Split-Path -Parent $PSScriptRoot
Set-Location $proyecto

$argumentos = @("-B", "clean", "test")
if ($Tags)    { $argumentos += "-Dkarate.tags=$Tags" }
if ($BaseUrl) { $argumentos += "-Dapi.base.url=$BaseUrl" }

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Ejercicio 02 - Pruebas REST signup y login (Karate)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Proyecto : $proyecto"
Write-Host " Servicios: $(if ($BaseUrl) { $BaseUrl } else { 'https://api.demoblaze.com' })"
if ($Tags) { Write-Host " Etiquetas: $Tags" }
Write-Host ""

& "$proyecto\mvnw.cmd" @argumentos
$resultado = $LASTEXITCODE

$reporte = Join-Path $proyecto "target\karate-reports\karate-summary.html"

Write-Host ""
if ($resultado -eq 0) {
    Write-Host "RESULTADO: pruebas ejecutadas correctamente." -ForegroundColor Green
} else {
    Write-Host "RESULTADO: la ejecucion fallo (codigo $resultado). Revise el reporte." -ForegroundColor Red
}

Write-Host "Salidas capturadas por caso: $proyecto\target\evidencias\"

if (Test-Path $reporte) {
    Write-Host "Reporte Karate: $reporte"
    if (-not $NoReport) { Start-Process $reporte }
} else {
    Write-Host "No se genero el reporte de Karate." -ForegroundColor Yellow
}

exit $resultado
