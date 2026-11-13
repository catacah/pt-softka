<#
.SYNOPSIS
    Ejecuta la prueba E2E de compra en SauceDemo y abre el reporte de Serenity.

.DESCRIPTION
    Envoltura sobre "mvnw clean verify". No requiere Maven instalado: el Maven
    Wrapper descarga la distribucion la primera vez que se ejecuta.

.PARAMETER Visible
    Ejecuta Chrome en modo visible (por defecto corre headless).

.PARAMETER Tags
    Filtra los escenarios por etiqueta de Cucumber, por ejemplo "@smoke".

.PARAMETER NoReport
    No abre el reporte HTML al terminar.

.EXAMPLE
    .\scripts\run-tests.ps1

.EXAMPLE
    .\scripts\run-tests.ps1 -Visible -Tags "@ejercicio-01"
#>
[CmdletBinding()]
param(
    [switch]$Visible,
    [string]$Tags = "",
    [switch]$NoReport
)

$ErrorActionPreference = "Stop"

# Consola en UTF-8 para que los acentos del Gherkin en espanol se vean bien
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }

# El script vive en /scripts, el proyecto es la carpeta padre
$proyecto = Split-Path -Parent $PSScriptRoot
Set-Location $proyecto

$headless = if ($Visible) { "false" } else { "true" }

$argumentos = @("-B", "clean", "verify", "-Dheadless.mode=$headless")
if ($Tags) { $argumentos += "-Dtags=$Tags" }

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Ejercicio 01 - E2E compra SauceDemo (Serenity BDD)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Proyecto : $proyecto"
Write-Host " Navegador: Chrome ($(if ($Visible) { 'visible' } else { 'headless' }))"
if ($Tags) { Write-Host " Etiquetas: $Tags" }
Write-Host ""

& "$proyecto\mvnw.cmd" @argumentos
$resultado = $LASTEXITCODE

$reporte = Join-Path $proyecto "target\site\serenity\index.html"

Write-Host ""
if ($resultado -eq 0) {
    Write-Host "RESULTADO: pruebas ejecutadas correctamente." -ForegroundColor Green
} else {
    Write-Host "RESULTADO: la ejecucion fallo (codigo $resultado). Revise el reporte." -ForegroundColor Red
}

if (Test-Path $reporte) {
    Write-Host "Reporte Serenity: $reporte"
    if (-not $NoReport) { Start-Process $reporte }
} else {
    Write-Host "No se genero el reporte de Serenity." -ForegroundColor Yellow
}

exit $resultado
