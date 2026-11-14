<#
.SYNOPSIS
    Ejecuta la prueba de carga del servicio de login (ejercicio 3) con k6.

.DESCRIPTION
    Resuelve el ejecutable de k6, prepara la carpeta de resultados, lanza el
    escenario pedido y deja el reporte HTML, el resumen en texto, el resumen en
    JSON y las metricas crudas en la carpeta resultados/.

    El codigo de salida es el de k6: 0 si se cumplieron todos los umbrales y
    99 si alguno no se cumplio.

.PARAMETER Escenario
    "carga" (por defecto) ejecuta la prueba del enunciado: 20 TPS sostenidos.
    "smoke" ejecuta una peticion por credencial del CSV para verificar el
    script, los datos y la conectividad.

.EXAMPLE
    .\scripts\run-load-test.ps1
.EXAMPLE
    .\scripts\run-load-test.ps1 -Escenario smoke
.EXAMPLE
    .\scripts\run-load-test.ps1 -Tps 30 -Duracion 1m
#>
[CmdletBinding()]
param(
    [ValidateSet('carga', 'smoke')]
    [string]$Escenario = 'carga',

    [ValidateRange(1, 1000)]
    [int]$Tps = 20,

    [string]$Duracion = '3m',

    [string]$BaseUrl = 'https://fakestoreapi.com',

    # No generar el csv con una fila por peticion (archivo grande).
    [switch]$SinCsv,

    # No abrir el reporte HTML al terminar.
    [switch]$NoAbrir
)

$ErrorActionPreference = 'Stop'

# La consola de Windows en UTF-8, para que los acentos y el signo de los
# umbrales de k6 se vean bien.
try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $null = chcp 65001
} catch {
    Write-Verbose "No se pudo cambiar la codificacion de la consola: $_"
}

# Todo se ejecuta desde la carpeta del ejercicio: las rutas de los reportes
# que genera el script de k6 son relativas al directorio de trabajo.
$raiz = Split-Path -Parent $PSScriptRoot
Push-Location $raiz

try {
    # ---- 1. Resolver k6 ---------------------------------------------------
    $k6 = $null
    $comando = Get-Command k6 -ErrorAction SilentlyContinue
    if ($comando) {
        $k6 = $comando.Source
    } else {
        foreach ($candidato in @(
                (Join-Path $env:ProgramFiles 'k6\k6.exe'),
                (Join-Path $raiz 'herramientas\k6.exe'))) {
            if (Test-Path $candidato) { $k6 = $candidato; break }
        }
    }

    if (-not $k6) {
        Write-Host ''
        Write-Host 'No se encontro k6.' -ForegroundColor Red
        Write-Host 'Instalarlo con:   .\scripts\instalar-k6.ps1'
        Write-Host 'O manualmente:    winget install --exact --id GrafanaLabs.k6'
        Write-Host ''
        exit 2
    }

    $version = (& $k6 version) -join ' '
    Write-Host ''
    Write-Host '==============================================================' -ForegroundColor Cyan
    Write-Host ' EJERCICIO 3 - PRUEBA DE CARGA DEL SERVICIO DE LOGIN' -ForegroundColor Cyan
    Write-Host '==============================================================' -ForegroundColor Cyan
    Write-Host " k6         : $version"
    Write-Host " Ejecutable : $k6"
    Write-Host " Escenario  : $Escenario"
    if ($Escenario -eq 'carga') {
        Write-Host " Perfil     : $Tps peticiones/s durante $Duracion"
    }
    Write-Host " Servicio   : POST $BaseUrl/auth/login"
    Write-Host ''

    # ---- 2. Preparar la carpeta de resultados -----------------------------
    $resultados = Join-Path $raiz 'resultados'
    if (-not (Test-Path $resultados)) {
        $null = New-Item -ItemType Directory -Path $resultados
    }

    # El log de k6 se abre en modo "append": si queda el de la corrida
    # anterior, la evidencia de esta mezclaria las dos.
    Remove-Item -Path (Join-Path $resultados "eventos-k6.log") -ErrorAction SilentlyContinue

    # ---- 3. Armar la invocacion -------------------------------------------
    $argumentos = @(
        'run',
        '--log-output', "file=resultados/eventos-k6.log",
        '-e', "ESCENARIO=$Escenario",
        '-e', "TPS=$Tps",
        '-e', "DURACION=$Duracion",
        '-e', "URL_BASE=$BaseUrl"
    )
    if (-not $SinCsv) {
        $argumentos += @('--out', 'csv=resultados/metricas-por-peticion.csv.gz')
    }
    $argumentos += 'src/prueba-de-carga-login.js'

    # ---- 4. Ejecutar ------------------------------------------------------
    & $k6 @argumentos
    $codigo = $LASTEXITCODE

    # ---- 5. Veredicto -----------------------------------------------------
    Write-Host ''
    switch ($codigo) {
        0 {
            Write-Host ' RESULTADO: todos los umbrales se cumplieron (codigo 0)' -ForegroundColor Green
        }
        99 {
            Write-Host ' RESULTADO: hay umbrales incumplidos (codigo 99)' -ForegroundColor Red
            Write-Host ' Revisar el detalle en el reporte: cual criterio fallo y con que valor.'
        }
        default {
            Write-Host " RESULTADO: k6 termino con un error (codigo $codigo)" -ForegroundColor Red
        }
    }

    $sufijo = if ($Escenario -eq 'carga') { '' } else { "-$Escenario" }
    $reporte = Join-Path $resultados "reporte-carga-login$sufijo.html"

    Write-Host ''
    Write-Host ' Resultados de esta ejecucion:'
    foreach ($archivo in @(
            "resultados/reporte-carga-login$sufijo.html   (reporte HTML)",
            "resultados/resumen$sufijo.txt                (lo mismo que se vio en consola)",
            "resultados/resumen$sufijo.json               (metricas crudas de k6)",
            'resultados/eventos-k6.log                    (avisos y logins fallidos)')) {
        Write-Host "   $archivo"
    }
    if (-not $SinCsv) {
        Write-Host '   resultados/metricas-por-peticion.csv.gz      (una fila por peticion)'
    }
    Write-Host ''

    # ---- 6. Abrir el reporte ---------------------------------------------
    if ((-not $NoAbrir) -and (Test-Path $reporte)) {
        Start-Process $reporte
    }

    exit $codigo
} finally {
    Pop-Location
}
