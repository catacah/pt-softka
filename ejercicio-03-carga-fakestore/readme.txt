================================================================================
 EJERCICIO 3 - PRUEBA DE CARGA DEL SERVICIO DE LOGIN
 POST https://fakestoreapi.com/auth/login
 k6 2.4.0
================================================================================

Repositorio : https://github.com/catacah/pt-softka
Ejecutado y verificado el 14/11/2026 - Resultado: los 3 criterios se cumplen.
            3.601 peticiones | 19,95 TPS | p95 483 ms | 0,00 % de error

Servicio bajo prueba (el CURL del enunciado):

    curl -X POST https://fakestoreapi.com/auth/login \
         -H "Content-Type: application/json" \
         -d '{"username":"mor_2314","password":"83r5^_"}'


--------------------------------------------------------------------------------
1. QUE PRUEBA ESTE PROYECTO
--------------------------------------------------------------------------------

Una prueba de carga del servicio de login sosteniendo 20 TPS (transacciones por
segundo) durante 3 minutos, con las credenciales parametrizadas desde un archivo
.csv, y con los tres criterios del enunciado convertidos en umbrales que evalua
k6 por su cuenta:

    CRITERIO 1  El escenario alcanza al menos 20 TPS
    CRITERIO 2  El tiempo de respuesta es como maximo 1,5 segundos
    CRITERIO 3  La tasa de error es menor al 3 % del total de peticiones

Si alguno no se cumple, k6 termina con codigo de salida 99 y el reporte marca
cual fallo y con que valor. No queda a interpretacion de quien lee el resultado.

Hay dos escenarios:

    carga   el del enunciado: 20 peticiones por segundo durante 3 minutos
            (~3.600 peticiones).
    smoke   verificacion previa: una peticion por cada credencial del CSV, en
            serie. Sirve para validar el script, los datos y la conectividad en
            5 peticiones antes de lanzar la prueba de carga.

Dato importante del contrato, verificado en la ejecucion: el login exitoso
responde HTTP 201 Created, no 200, y con una credencial invalida responde 401
con texto plano (no JSON). Las validaciones estan escritas sobre ese
comportamiento real; ver conclusiones.txt, hallazgos 1 y 2.


--------------------------------------------------------------------------------
2. PRERREQUISITOS
--------------------------------------------------------------------------------

  OBLIGATORIOS
  ------------
  [1] k6 2.4.0 o superior.
      Verificar con:   k6 version
      Probado con:     k6 v2.4.0 (commit/dd9395906d, go1.26.11, windows/amd64)

      k6 es un ejecutable unico, sin dependencias. Instalacion:

        Windows (opcion A, recomendada): el script que viene en el proyecto
            .\scripts\instalar-k6.ps1
            (usa winget y, si no esta disponible, descarga el zip oficial y
             deja k6.exe en herramientas/ sin instalar nada)

        Windows (opcion B):
            winget install --exact --id GrafanaLabs.k6
            NOTA: abrir una terminal nueva despues de instalar, para que "k6"
            quede en el PATH.

        macOS:
            brew install k6

        Linux (Debian/Ubuntu):
            sudo gpg -k
            sudo gpg --no-default-keyring \
                 --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
                 --keyserver hkp://keyserver.ubuntu.com:80 \
                 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
            echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] \
                 https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
            sudo apt-get update && sudo apt-get install k6

        Cualquier sistema (portable, sin instalar):
            descargar el binario de https://github.com/grafana/k6/releases

  [2] Conexion a internet: la prueba corre contra el servicio publico
      https://fakestoreapi.com

  NO SE NECESITA
  --------------
  - Node.js, Java, Python ni ningun runtime: k6 trae su propio motor de
    JavaScript. El proyecto no tiene package.json ni node_modules.
  - Ninguna descarga en tiempo de ejecucion: el script no importa modulos
    remotos (ver conclusiones.txt, decision 3). Funciona detras de un proxy
    que solo permita llegar al servicio bajo prueba.
  - Ningun plugin ni extension de k6.
  - Ningun IDE.
  - Ningun usuario de prueba por crear: las 5 credenciales del enunciado ya
    existen en el servicio.


--------------------------------------------------------------------------------
3. EJECUCION PASO A PASO
--------------------------------------------------------------------------------

  PASO 1 - Clonar el repositorio
  -------------------------------
      git clone https://github.com/catacah/pt-softka.git

  PASO 2 - Entrar a la carpeta del ejercicio
  -------------------------------------------
      cd pt-softka/ejercicio-03-carga-fakestore

      IMPORTANTE: los comandos se ejecutan desde esta carpeta. Las rutas de los
      reportes son relativas al directorio de trabajo.

  PASO 3 - Verificar que k6 esta disponible
  ------------------------------------------
      k6 version

      Si no esta instalado, ver el punto 2 (en Windows:
      .\scripts\instalar-k6.ps1).

  PASO 4 - Verificacion previa (opcional, 5 peticiones, ~3 segundos)
  -------------------------------------------------------------------
      Windows (PowerShell):
          .\scripts\run-load-test.ps1 -Escenario smoke

      Linux / macOS / Git Bash:
          chmod +x scripts/run-load-test.sh
          ./scripts/run-load-test.sh --escenario smoke

      Confirma que el servicio responde, que el CSV se leyo bien y que las 5
      credenciales autentican: 5 peticiones, 15 validaciones, 0 errores.

  PASO 5 - Ejecutar la prueba de carga (3 minutos)
  -------------------------------------------------
      Opcion A (recomendada) - script de ejecucion
      --------------------------------------------
      Windows (PowerShell):
          .\scripts\run-load-test.ps1

      Linux / macOS / Git Bash:
          ./scripts/run-load-test.sh

      El script resuelve el ejecutable de k6, crea la carpeta de resultados,
      lanza el escenario, imprime el veredicto y en Windows abre el reporte HTML
      al terminar.

      Opcion B - k6 directo
      ----------------------
          k6 run src/prueba-de-carga-login.js

      (Equivale a la opcion A sin el csv de metricas crudas ni el log de
      eventos. La carpeta resultados/ ya viene en el repositorio, asi que k6
      puede escribir los reportes ahi.)

  PASO 6 - Revisar los resultados
  --------------------------------
      resultados/reporte-carga-login.html .... reporte HTML: veredicto por
                                               criterio, tiempos, validaciones,
                                               reparto por credencial y umbrales
      resultados/resumen.txt ................. el mismo resumen que se vio en
                                               consola
      resultados/resumen.json ................ metricas crudas de k6
      resultados/eventos-k6.log .............. avisos y, si hubiera, el detalle
                                               de cada login fallido
      resultados/metricas-por-peticion.csv.gz  una fila por cada medicion
                                               (~76.000 filas), para analizar
                                               la distribucion segundo a segundo

      El codigo de salida de k6 es el veredicto:
          0   todos los umbrales se cumplieron
          99  algun umbral no se cumplio
          otro   error de ejecucion (script, red, parametros)

  La evidencia de la ejecucion de referencia ya viene versionada en la carpeta
  evidencias/ (ver evidencias/LEEME.txt).


--------------------------------------------------------------------------------
4. OPCIONES DE EJECUCION
--------------------------------------------------------------------------------

  Cambiar el TPS o la duracion
  -----------------------------
      .\scripts\run-load-test.ps1 -Tps 30 -Duracion 1m
      ./scripts/run-load-test.sh --tps 30 --duracion 1m
      k6 run -e TPS=30 -e DURACION=1m src/prueba-de-carga-login.js

  Apuntar a otra URL base (por ejemplo, a un mock)
  -------------------------------------------------
      .\scripts\run-load-test.ps1 -BaseUrl "http://localhost:8080"
      ./scripts/run-load-test.sh --base-url http://localhost:8080
      k6 run -e URL_BASE=http://localhost:8080 src/prueba-de-carga-login.js

  No generar el csv de metricas crudas (es el archivo mas grande)
  ---------------------------------------------------------------
      .\scripts\run-load-test.ps1 -SinCsv
      ./scripts/run-load-test.sh --sin-csv

  No abrir el reporte al terminar (Windows)
  ------------------------------------------
      .\scripts\run-load-test.ps1 -NoAbrir

  Otras variables que acepta el script (todas con -e CLAVE=valor)
  ----------------------------------------------------------------
      ESCENARIO ............ carga | smoke                  (por defecto carga)
      TPS .................. peticiones por segundo                       (20)
      DURACION ............. duracion de la meseta                        (3m)
      URL_BASE ............. servicio bajo prueba     (https://fakestoreapi.com)
      RUTA_LOGIN ........... ruta del servicio                  (/auth/login)
      ARCHIVO_USUARIOS ..... otro CSV de credenciales  (../../datos/usuarios.csv,
                             la ruta es relativa a src/lib/)
      TIEMPO_MAXIMO_MS ..... umbral de tiempo de respuesta              (1500)
      TASA_ERROR_MAXIMA .... tasa de error aceptable                     (0.03)
      VUS_PREASIGNADOS ..... VUs reservados antes de arrancar             (100)
      VUS_MAXIMOS .......... techo de VUs                                 (200)
      CARPETA_RESULTADOS ... donde se escriben los reportes        (resultados)

  Usar otras credenciales
  ------------------------
  Editar datos/usuarios.csv manteniendo la cabecera "user,passwd". El script
  reparte las credenciales por turnos, asi que acepta cualquier cantidad de
  filas: con 5 filas y 3.600 peticiones, cada credencial se usa 720 veces.


--------------------------------------------------------------------------------
5. ESTRUCTURA DEL PROYECTO
--------------------------------------------------------------------------------

  ejercicio-03-carga-fakestore/
  |
  |-- readme.txt ................ este archivo
  |-- conclusiones.txt .......... hallazgos y conclusiones del ejercicio
  |
  |-- datos/
  |   |-- usuarios.csv .......... credenciales del enunciado (user,passwd)
  |
  |-- src/
  |   |-- prueba-de-carga-login.js .. script principal: escenarios, peticion
  |   |                                HTTP y punto de entrada de los reportes
  |   |-- config/
  |   |   |-- entorno.js ............ servicio bajo prueba y variables
  |   |   |-- criterios.js .......... criterios del enunciado como umbrales,
  |   |   |                           perfil de carga y escenarios
  |   |-- lib/
  |       |-- usuarios.js .......... lectura y validacion del CSV (SharedArray)
  |       |-- metricas.js .......... metricas propias (TPS, token, umbral)
  |       |-- validaciones.js ...... las 3 validaciones por peticion
  |       |-- reporte.js .......... genera el HTML, el texto y el JSON
  |
  |-- scripts/
  |   |-- run-load-test.ps1 ..... ejecucion en Windows
  |   |-- run-load-test.sh ...... ejecucion en Linux / macOS
  |   |-- instalar-k6.ps1 ....... instala k6 en Windows (winget o portable)
  |
  |-- evidencias/ ............... ejecucion verificada del 14/11/2026
  |   |-- LEEME.txt ............. como leer la evidencia
  |   |-- reporte-carga-login.html
  |   |-- resumen.txt / resumen.json
  |   |-- consola-ejecucion.txt
  |   |-- eventos-k6.log
  |   |-- metricas-por-peticion.csv.gz
  |   |-- corrida-previa-generador-subdimensionado/
  |                              la corrida descartada por un problema del
  |                              generador de carga (hallazgo 6)
  |
  |-- resultados/ ............... salida de cada ejecucion (no se versiona,
                                  solo el .gitkeep para que la carpeta exista)

  Por que el script esta partido en modulos: el enunciado pide un entregable
  reproducible y revisable. Separar los criterios (config/criterios.js) de la
  mecanica de la peticion (prueba-de-carga-login.js) permite leer y auditar los
  umbrales sin tener que leer el codigo de la prueba, y cambiar el perfil de
  carga sin tocar las validaciones.


--------------------------------------------------------------------------------
6. VERSIONES UTILIZADAS
--------------------------------------------------------------------------------

  k6 ............................ 2.4.0 (commit dd9395906d, compilado con Go
                                  1.26.11, windows/amd64)
  Motor de JavaScript ........... el que trae k6 (sobek, ES2023)
  Dependencias externas ......... ninguna (ver conclusiones.txt, decision 3)
  Instalador usado .............. winget 1.29.380 / paquete GrafanaLabs.k6
  Servicio bajo prueba .......... https://fakestoreapi.com/auth/login
                                  (Express detras de Cloudflare)
  Sistema operativo probado ..... Windows 11 Home 10.0.26300
  Consola probada ............... PowerShell 5.1 y Git Bash 5.2
  Fecha de la ejecucion ......... 14/11/2026


--------------------------------------------------------------------------------
7. RESULTADO ESPERADO
--------------------------------------------------------------------------------

En consola, al final de la prueba de carga:

    --------------------------------------------------------------------------
     CRITERIOS DE ACEPTACION DEL ENUNCIADO
    --------------------------------------------------------------------------

     [CUMPLE   ]  1. Alcanzar al menos 20 TPS
                    Medido: 19,95 TPS (3.601 peticiones en 180,5 s)
                    (minimo aceptado 19,50 TPS, iteraciones descartadas 0)

     [CUMPLE   ]  2. Tiempo de respuesta maximo 1,5 s
                    Medido: p95 482,69 ms | p99 751,23 ms | maximo 1.236,74 ms
                    (0 de 3.601 peticiones sobre el umbral (0,00 %))

     [CUMPLE   ]  3. Tasa de error menor al 3 % del total
                    Medido: 0,00 % (0 de 3.601 peticiones)
                    (logins exitosos con token 100,00 %)

    ==========================================================================
     RESULTADO: PRUEBA EXITOSA - todos los umbrales se cumplen
    ==========================================================================

Los numeros exactos varian en cada ejecucion: el servicio es publico, gratuito
y compartido. En la corrida de referencia el p95 fue de 483 ms, y en una corrida
previa hecha 10 minutos antes el p99 fue de 1.708 ms (ver conclusiones.txt,
hallazgo 5). Lo que no deberia variar es el veredicto de los criterios 1 y 3.

El TPS medido es 19,95 y no 20,00 porque la metrica se calcula como peticiones
dividido la duracion total de la ejecucion, que incluye la fraccion de segundo
que tarda en cerrar la ultima iteracion. El umbral acepta desde 19,50 TPS por
ese motivo (parametro TOLERANCIA_TPS).


--------------------------------------------------------------------------------
8. SOLUCION DE PROBLEMAS
--------------------------------------------------------------------------------

  "k6 no se reconoce como comando" / "command not found: k6"
      En Windows, abrir una terminal NUEVA despues de instalar (el PATH se
      refresca al iniciar sesion) o ejecutar .\scripts\instalar-k6.ps1, que deja
      k6.exe en herramientas/ y es encontrado por los scripts sin tocar el PATH.

  k6 termina con codigo 99
      No es un error de ejecucion: significa que la prueba corrio completa y
      algun umbral no se cumplio. El reporte indica cual criterio fallo y con
      que valor medido. Es el comportamiento esperado de una prueba de carga
      cuando el servicio no cumple el acuerdo.

  "El archivo ... no tiene filas de datos" o "debe tener la cabecera user,passwd"
      El CSV de credenciales esta vacio, mal formado o le falta la cabecera. El
      script valida los datos antes de arrancar a proposito, para no medir sobre
      credenciales vacias.

  Aparecen iteraciones descartadas (dropped_iterations > 0)
      k6 no pudo lanzar alguna peticion en el momento que le correspondia, con
      lo cual el TPS real fue menor que el configurado y la medicion no
      representa el escenario pedido. Pasa cuando el servicio se degrada y la
      concurrencia necesaria supera los VUs pre-asignados. Subir el margen:
          .\scripts\run-load-test.ps1   (ya usa 100 VUs pre-asignados)
          k6 run -e VUS_PREASIGNADOS=200 -e VUS_MAXIMOS=400 src/prueba-de-carga-login.js
      Ver conclusiones.txt, hallazgo 6: es exactamente lo que paso en la primera
      corrida de este ejercicio.

  Muchos errores 429, o la tasa de error se dispara
      El servicio es publico y esta detras de Cloudflare: puede aplicar limites
      de uso. Bajar el TPS o la duracion, o esperar unos minutos. No reintentar
      en bucle contra un servicio de terceros.

  Todas las peticiones fallan con timeout o "connection refused"
      Verificar el acceso a https://fakestoreapi.com desde la red actual:
          curl -X POST https://fakestoreapi.com/auth/login \
               -H "Content-Type: application/json" \
               -d "{\"username\":\"donero\",\"password\":\"ewedon\"}"
      Deberia responder HTTP 201 con un token.

  El reporte HTML no se genera
      k6 escribe los reportes en resultados/, que debe existir: la carpeta viene
      versionada en el repositorio. Si se borro, crearla (mkdir resultados) o
      usar los scripts de scripts/, que la crean solos.

  Caracteres raros en la consola de Windows
      Usar el script run-load-test.ps1, que fuerza la consola a UTF-8, o
      ejecutar "chcp 65001" antes de invocar k6 directamente.
