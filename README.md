# Pruebas técnicas QA Developer

Repositorio con la solución de las pruebas técnicas de automatización de QA.
Cada ejercicio vive en su propia carpeta y es **autocontenido**: tiene sus
propias instrucciones, dependencias, scripts y evidencias.

## Ejercicios

| # | Ejercicio | Alcance | Stack | Estado |
|---|-----------|---------|-------|--------|
| 01 | [E2E compra en SauceDemo](ejercicio-01-e2e-saucedemo/) | Prueba funcional automatizada del flujo de compra en `saucedemo.com`: login, dos productos al carrito, carrito, formulario y confirmación del pedido | Serenity BDD 5.4.2 + Cucumber 8 + Screenplay (Java 17) | ✅ 1 escenario / 1 exitoso |
| 02 | [Servicios REST de Demoblaze](ejercicio-02-api-demoblaze/) | Pruebas de los servicios `POST /signup` y `POST /login` de `api.demoblaze.com`: crear usuario, usuario duplicado, login correcto y login incorrecto, con las entradas y salidas capturadas | Karate 1.5.2 + JUnit 5 (Java 17) | ✅ 4 casos / 4 exitosos |
| 03 | [Carga del login de FakeStoreAPI](ejercicio-03-carga-fakestore/) | Prueba de carga de `POST /auth/login` a **20 TPS durante 3 minutos** con las credenciales parametrizadas desde un `.csv`, validando tiempo de respuesta ≤ 1,5 s y tasa de error < 3% | k6 2.4.0 | ✅ 3 criterios / 3 cumplidos |

## Cómo ejecutar

Cada ejercicio se ejecuta desde su propia carpeta:

```bash
# Ejercicio 01 - E2E con navegador
cd ejercicio-01-e2e-saucedemo
./mvnw clean verify            # Linux / macOS / Git Bash
.\mvnw.cmd clean verify        # Windows

# Ejercicio 02 - Servicios REST
cd ejercicio-02-api-demoblaze
./mvnw clean test              # Linux / macOS / Git Bash
.\mvnw.cmd clean test          # Windows

# Ejercicio 03 - Prueba de carga (3 minutos)
cd ejercicio-03-carga-fakestore
./scripts/run-load-test.sh     # Linux / macOS / Git Bash
.\scripts\run-load-test.ps1    # Windows
```

Los ejercicios 01 y 02 no necesitan Maven instalado: cada proyecto incluye
**Maven Wrapper**, y solo se requiere **JDK 17+** (y **Google Chrome** únicamente
para el ejercicio 01). El ejercicio 03 no usa Java: solo necesita **k6 2.4.0+**,
que es un ejecutable único (`.\scripts\instalar-k6.ps1` lo instala en Windows).

Instrucciones detalladas paso a paso, opciones de ejecución y solución de
problemas en el `readme.txt` de cada ejercicio:
[ejercicio 01](ejercicio-01-e2e-saucedemo/readme.txt) ·
[ejercicio 02](ejercicio-02-api-demoblaze/readme.txt) ·
[ejercicio 03](ejercicio-03-carga-fakestore/readme.txt).

## Cómo está organizado el trabajo

El repositorio sigue **GitFlow**, para que se pueda seguir el avance de cada
ejercicio:

| Rama | Para qué sirve |
|------|----------------|
| `main` | Solo versiones terminadas y revisadas. Cada entrega queda marcada con una etiqueta (`v1.0.0`, `v1.1.0`, ...) |
| `develop` | Donde se integra el trabajo del día a día |
| `feature/*` | Una rama por ejercicio; ahí van los commits pequeños del desarrollo |
| `release/*` | Preparación de la entrega: se actualiza la documentación y se publica en `main` |
| `hotfix/*` | Correcciones puntuales que tienen que llegar directo a `main` |

Las ramas de `feature` y de `release` se integran con *merge* sin *fast-forward*
y se borran al terminar. El historial no pierde nada: el grafo sigue mostrando
dónde empieza y dónde termina cada ejercicio, con todos sus commits.

Para ver el avance de un ejercicio:

```bash
git log --oneline --graph --all      # el mapa completo, con sus ramas
git log --oneline v1.0.0             # los pasos hasta la primera entrega
git log --oneline v1.0.0..v1.1.0     # lo que agregó la segunda entrega
git log --oneline v1.1.1..v1.2.0     # lo que agregó la tercera entrega
git tag -n                           # las entregas
```

## Entregables por ejercicio

| Archivo | Contenido |
|---------|-----------|
| `readme.txt` | Instrucciones paso a paso de ejecución |
| `conclusiones.txt` | Hallazgos y conclusiones del ejercicio |
| `evidencias/` | Evidencia de la ejecución verificada: reporte HTML (en `.zip` si son varios archivos, o suelto si es autocontenido como en el ej. 03), consola completa y métricas o salidas capturadas |
| `evidencias/capturas/`, `salidas/` o `metricas-*` | Evidencia revisable directamente desde GitHub: capturas del flujo (ej. 01), entradas y salidas por caso (ej. 02) o las métricas de cada petición (ej. 03) |
| `evidencias/LEEME.txt` | Qué es cada archivo de evidencia y cómo leerlo |
| `scripts/` | Scripts de ejecución para Windows y Linux/macOS |
