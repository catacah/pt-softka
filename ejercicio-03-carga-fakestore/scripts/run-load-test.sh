#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Ejecuta la prueba de carga del servicio de login (ejercicio 3) con k6.
#
# Uso:
#   ./scripts/run-load-test.sh                          # prueba de carga (20 TPS)
#   ./scripts/run-load-test.sh --escenario smoke        # verificacion previa
#   ./scripts/run-load-test.sh --tps 30 --duracion 1m
#
# Codigo de salida: el de k6 (0 = umbrales cumplidos, 99 = alguno incumplido).
# ---------------------------------------------------------------------------
set -u

ESCENARIO="carga"
TPS="20"
DURACION="3m"
BASE_URL="https://fakestoreapi.com"
GENERAR_CSV="si"

while [ $# -gt 0 ]; do
  case "$1" in
    --escenario) ESCENARIO="$2"; shift 2 ;;
    --tps)       TPS="$2";       shift 2 ;;
    --duracion)  DURACION="$2";  shift 2 ;;
    --base-url)  BASE_URL="$2";  shift 2 ;;
    --sin-csv)   GENERAR_CSV="no"; shift ;;
    -h|--help)
      sed -n '3,12p' "$0" | sed 's/^# \{0,1\}//'
      exit 0 ;;
    *)
      echo "Parametro no reconocido: $1" >&2
      echo "Ver: $0 --help" >&2
      exit 2 ;;
  esac
done

if [ "$ESCENARIO" != "carga" ] && [ "$ESCENARIO" != "smoke" ]; then
  echo "El escenario debe ser \"carga\" o \"smoke\", y se recibio \"$ESCENARIO\"" >&2
  exit 2
fi

# Todo se ejecuta desde la carpeta del ejercicio: las rutas de los reportes que
# genera el script de k6 son relativas al directorio de trabajo.
RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
cd "$RAIZ" || exit 2

# ---- 1. Resolver k6 -------------------------------------------------------
K6=""
if command -v k6 >/dev/null 2>&1; then
  K6="k6"
elif [ -x "./herramientas/k6" ]; then
  K6="./herramientas/k6"
else
  echo ""
  echo "No se encontro k6."
  echo "Instalarlo segun el sistema operativo:"
  echo "  Linux  : sudo gpg -k && sudo apt-get install k6   (ver readme.txt, paso 1)"
  echo "  macOS  : brew install k6"
  echo ""
  exit 2
fi

echo ""
echo "=============================================================="
echo " EJERCICIO 3 - PRUEBA DE CARGA DEL SERVICIO DE LOGIN"
echo "=============================================================="
echo " k6        : $($K6 version)"
echo " Escenario : $ESCENARIO"
if [ "$ESCENARIO" = "carga" ]; then
  echo " Perfil    : $TPS peticiones/s durante $DURACION"
fi
echo " Servicio  : POST $BASE_URL/auth/login"
echo ""

# ---- 2. Preparar la carpeta de resultados ---------------------------------
mkdir -p resultados
# El log de k6 se abre en modo "append": si queda el de la corrida anterior, la
# evidencia de esta mezclaria las dos.
rm -f resultados/eventos-k6.log

# ---- 3. Armar la invocacion ----------------------------------------------
ARGUMENTOS="run --log-output file=resultados/eventos-k6.log"
ARGUMENTOS="$ARGUMENTOS -e ESCENARIO=$ESCENARIO -e TPS=$TPS -e DURACION=$DURACION -e URL_BASE=$BASE_URL"
if [ "$GENERAR_CSV" = "si" ]; then
  ARGUMENTOS="$ARGUMENTOS --out csv=resultados/metricas-por-peticion.csv.gz"
fi

# ---- 4. Ejecutar ----------------------------------------------------------
# shellcheck disable=SC2086
$K6 $ARGUMENTOS src/prueba-de-carga-login.js
CODIGO=$?

# ---- 5. Veredicto ---------------------------------------------------------
SUFIJO=""
if [ "$ESCENARIO" != "carga" ]; then
  SUFIJO="-$ESCENARIO"
fi

echo ""
case "$CODIGO" in
  0)  echo " RESULTADO: todos los umbrales se cumplieron (codigo 0)" ;;
  99) echo " RESULTADO: hay umbrales incumplidos (codigo 99)"
      echo " Revisar el detalle en el reporte: cual criterio fallo y con que valor." ;;
  *)  echo " RESULTADO: k6 termino con un error (codigo $CODIGO)" ;;
esac

echo ""
echo " Resultados de esta ejecucion:"
echo "   resultados/reporte-carga-login$SUFIJO.html   (reporte HTML)"
echo "   resultados/resumen$SUFIJO.txt                (lo mismo que se vio en consola)"
echo "   resultados/resumen$SUFIJO.json               (metricas crudas de k6)"
echo "   resultados/eventos-k6.log                    (avisos y logins fallidos)"
if [ "$GENERAR_CSV" = "si" ]; then
  echo "   resultados/metricas-por-peticion.csv.gz      (una fila por peticion)"
fi
echo ""

exit $CODIGO
