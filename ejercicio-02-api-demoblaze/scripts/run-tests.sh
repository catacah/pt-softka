#!/usr/bin/env bash
#
# Ejecuta las pruebas REST de signup y login de Demoblaze (Linux / macOS / Git Bash).
#
# Uso:
#   ./scripts/run-tests.sh                      # los cuatro casos
#   ./scripts/run-tests.sh --tags @login        # filtra por etiqueta
#   ./scripts/run-tests.sh --base-url https://...   # apunta a otra URL base
#
# No requiere Maven instalado (Maven Wrapper) ni navegador: son pruebas de servicios.

set -euo pipefail

TAGS=""
BASE_URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --tags)      TAGS="${2:-}"; shift 2 ;;
    --base-url)  BASE_URL="${2:-}"; shift 2 ;;
    -h|--help)   sed -n '3,11p' "$0"; exit 0 ;;
    *)           echo "Opcion no reconocida: $1" >&2; exit 2 ;;
  esac
done

# El script vive en /scripts, el proyecto es la carpeta padre
PROYECTO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROYECTO"

echo
echo "=========================================================="
echo " Ejercicio 02 - Pruebas REST signup y login (Karate)"
echo "=========================================================="
echo " Proyecto : $PROYECTO"
echo " Servicios: ${BASE_URL:-https://api.demoblaze.com}"
[[ -n "$TAGS" ]] && echo " Etiquetas: $TAGS"
echo

ARGS=(-B clean test)
[[ -n "$TAGS" ]] && ARGS+=("-Dkarate.tags=${TAGS}")
[[ -n "$BASE_URL" ]] && ARGS+=("-Dapi.base.url=${BASE_URL}")

set +e
./mvnw "${ARGS[@]}"
RESULTADO=$?
set -e

REPORTE="$PROYECTO/target/karate-reports/karate-summary.html"

echo
if [[ $RESULTADO -eq 0 ]]; then
  echo "RESULTADO: pruebas ejecutadas correctamente."
else
  echo "RESULTADO: la ejecucion fallo (codigo $RESULTADO). Revise el reporte."
fi

echo "Salidas capturadas por caso: $PROYECTO/target/evidencias/"

if [[ -f "$REPORTE" ]]; then
  echo "Reporte Karate: $REPORTE"
else
  echo "No se genero el reporte de Karate."
fi

exit $RESULTADO
