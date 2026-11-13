# Pruebas técnicas QA Developer

Repositorio con la solución de las pruebas técnicas de automatización de QA.
Cada ejercicio vive en su propia carpeta y es **autocontenido**: tiene sus
propias instrucciones, dependencias, scripts y evidencias.

## Ejercicios

| # | Ejercicio | Alcance | Stack | Estado |
|---|-----------|---------|-------|--------|
| 01 | [E2E compra en SauceDemo](ejercicio-01-e2e-saucedemo/) | Prueba funcional automatizada del flujo de compra en `saucedemo.com`: login, dos productos al carrito, carrito, formulario y confirmación del pedido | Serenity BDD 5.4.2 + Cucumber 8 + Screenplay (Java 17) | ✅ 1 escenario / 1 exitoso |

## Cómo ejecutar

Cada ejercicio se ejecuta desde su propia carpeta. Para el ejercicio 01:

```bash
cd ejercicio-01-e2e-saucedemo
./mvnw clean verify            # Linux / macOS / Git Bash
.\mvnw.cmd clean verify        # Windows
```

No hace falta tener Maven instalado: el proyecto incluye **Maven Wrapper**.
Solo se requiere **JDK 17+** y **Google Chrome**.

Instrucciones detalladas paso a paso, opciones de ejecución y solución de
problemas en [`ejercicio-01-e2e-saucedemo/readme.txt`](ejercicio-01-e2e-saucedemo/readme.txt).

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
| `evidencias/reporte-serenity.zip` | Reporte HTML de la ejecución verificada (descomprimir y abrir `index.html`) |
| `evidencias/capturas/` | Capturas clave del flujo, renombradas |
| `scripts/` | Scripts de ejecución para Windows y Linux/macOS |
