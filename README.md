# Pruebas técnicas QA Developer

Repositorio con la solución de las pruebas técnicas de automatización de QA.
Cada ejercicio vive en su propia carpeta y es **autocontenido**: tiene sus
propias instrucciones, dependencias, scripts y evidencias.

## Cómo está organizado el trabajo

El repositorio sigue **GitFlow**, para que se pueda seguir el avance de cada
ejercicio:

| Rama | Para qué sirve |
|------|----------------|
| `main` | Solo versiones terminadas y revisadas. Cada entrega queda marcada con una etiqueta (`v1.0.0`, `v1.1.0`, ...) |
| `develop` | Donde se integra el trabajo del día a día |
| `feature/*` | Una rama por ejercicio; ahí van los commits pequeños del desarrollo |
| `release/*` | Preparación de la entrega: se actualiza la documentación y se publica en `main` |

Las ramas de `feature` se integran con *merge* sin *fast-forward*, así el
historial muestra claramente dónde empieza y dónde termina cada ejercicio.

## Entregables por ejercicio

| Archivo | Contenido |
|---------|-----------|
| `readme.txt` | Instrucciones paso a paso de ejecución |
| `conclusiones.txt` | Hallazgos y conclusiones del ejercicio |
| `evidencias/` | Reporte de la ejecución verificada y evidencia revisable desde GitHub |
| `scripts/` | Scripts de ejecución para Windows y Linux/macOS |
