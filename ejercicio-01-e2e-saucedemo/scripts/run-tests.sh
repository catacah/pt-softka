#!/usr/bin/env bash
#
# Ejecuta la prueba E2E de compra en SauceDemo (Linux / macOS / Git Bash).
#
# Uso:
#   ./scripts/run-tests.sh                 # headless (por defecto)
#   ./scripts/run-tests.sh --visible       # con navegador visible
#   ./scripts/run-tests.sh --tags @smoke   # filtra por etiqueta
#
# No requiere Maven instalado: el Maven Wrapper descarga la distribucion
# la primera vez que se ejecuta.

set -euo pipefail

HEADLESS="true"
TAGS=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --visible)  HEADLESS="false"; shift ;;
    --tags)     TAGS="${2:-}"; shift 2 ;;
    -h|--help)  sed -n '3,14p' "$0"; exit 0 ;;
    *)          echo "Opcion no reconocida: $1" >&2; exit 2 ;;
  esac
done

# El script vive en /scripts, el proyecto es la carpeta padre
PROYECTO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROYECTO"

echo
echo "=========================================================="
echo " Ejercicio 01 - E2E compra SauceDemo (Serenity BDD)"
echo "=========================================================="
echo " Proyecto : $PROYECTO"
echo " Navegador: Chrome ($([ "$HEADLESS" = "true" ] && echo headless || echo visible))"
[[ -n "$TAGS" ]] && echo " Etiquetas: $TAGS"
echo

ARGS=(-B clean verify "-Dheadless.mode=${HEADLESS}")
[[ -n "$TAGS" ]] && ARGS+=("-Dtags=${TAGS}")

set +e
./mvnw "${ARGS[@]}"
RESULTADO=$?
set -e

REPORTE="$PROYECTO/target/site/serenity/index.html"

echo
if [[ $RESULTADO -eq 0 ]]; then
  echo "RESULTADO: pruebas ejecutadas correctamente."
else
  echo "RESULTADO: la ejecucion fallo (codigo $RESULTADO). Revise el reporte."
fi

if [[ -f "$REPORTE" ]]; then
  echo "Reporte Serenity: $REPORTE"
else
  echo "No se genero el reporte de Serenity."
fi

exit $RESULTADO
