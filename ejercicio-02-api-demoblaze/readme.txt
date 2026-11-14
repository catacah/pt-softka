================================================================================
 EJERCICIO 2 - PRUEBAS DE SERVICIOS REST
 Signup y login de https://www.demoblaze.com/
 Karate 1.5.2 (JUnit 5)
================================================================================

Repositorio : https://github.com/catacah/pt-softka
Ejecutado y verificado el 13/11/2026 - Resultado: 4 casos, 4 exitosos.

Servicios bajo prueba:
    POST https://api.demoblaze.com/signup
    POST https://api.demoblaze.com/login


--------------------------------------------------------------------------------
1. QUE PRUEBA ESTE PROYECTO
--------------------------------------------------------------------------------

Los cuatro casos que pide el enunciado, uno por escenario:

  CP01  Crear un nuevo usuario en signup
  CP02  Intentar crear un usuario ya existente
  CP03  Usuario y password correctos en login
  CP04  Usuario y password incorrectos en login

De cada caso se identifican las ENTRADAS (metodo, URL, cabeceras y cuerpo
enviado) y se capturan las SALIDAS (codigo HTTP, cabeceras, cuerpo y tiempo de
respuesta) en un archivo JSON independiente, ademas del reporte HTML.

Dato importante del contrato (verificado en https://www.demoblaze.com/js/index.js):
la aplicacion NO envia el password en claro, lo codifica en Base64 con la funcion
b64EncodeUnicode(). Las pruebas replican esa codificacion para enviar exactamente
la misma entrada que el front real.


--------------------------------------------------------------------------------
2. PRERREQUISITOS
--------------------------------------------------------------------------------

  OBLIGATORIOS
  ------------
  [1] JDK 17 o superior, con la variable JAVA_HOME o "java" en el PATH.
      Verificar con:   java -version
      Probado con:     Oracle JDK 25.0.2

  [2] Conexion a internet (para descargar dependencias y para llegar a
      api.demoblaze.com).

  NO SE NECESITA
  --------------
  - Maven: el proyecto incluye Maven Wrapper (mvnw / mvnw.cmd). La primera
    ejecucion descarga Apache Maven 3.9.16 automaticamente.
  - Navegador ni driver: son pruebas de servicios, no de interfaz.
  - Ningun IDE.
  - Ningun usuario precargado: cada ejecucion crea sus propios usuarios.


--------------------------------------------------------------------------------
3. EJECUCION PASO A PASO
--------------------------------------------------------------------------------

  PASO 1 - Clonar el repositorio
  -------------------------------
      git clone https://github.com/catacah/pt-softka.git

  PASO 2 - Entrar a la carpeta del ejercicio
  -------------------------------------------
      cd pt-softka/ejercicio-02-api-demoblaze

  PASO 3 - Ejecutar las pruebas

      Opcion A (recomendada) - script de ejecucion
      --------------------------------------------
      Windows (PowerShell):
          .\scripts\run-tests.ps1

      Linux / macOS / Git Bash:
          chmod +x scripts/run-tests.sh
          ./scripts/run-tests.sh

      El script ejecuta los cuatro casos, imprime el resultado y en Windows abre
      el reporte HTML al terminar.

      Opcion B - Maven Wrapper directo
      ---------------------------------
      Windows (PowerShell o CMD):
          .\mvnw.cmd clean test

      Linux / macOS / Git Bash:
          ./mvnw clean test

  PASO 4 - Revisar los resultados
  --------------------------------
  Reporte HTML (narra cada peticion y cada respuesta):

      target/karate-reports/karate-summary.html    (resumen y acceso a los casos)
      target/karate-reports/karate-tags.html       (resultados por etiqueta)
      target/karate-reports/karate-timeline.html   (linea de tiempo)

  Salidas capturadas, un archivo por caso:

      target/evidencias/CP01.json
      target/evidencias/CP02.json
      target/evidencias/CP03.json
      target/evidencias/CP04.json

  La evidencia de la ejecucion de referencia ya viene versionada en la carpeta
  evidencias/ (ver evidencias/LEEME.txt).

  NOTA: la primera ejecucion tarda mas (descarga Maven y las dependencias, aprox.
  2-4 minutos segun la conexion). Las siguientes tardan ~12 segundos.


--------------------------------------------------------------------------------
4. OPCIONES DE EJECUCION
--------------------------------------------------------------------------------

  Filtrar por etiqueta
  ---------------------
  Etiquetas disponibles:
      @signup @login             por servicio
      @CP01 @CP02 @CP03 @CP04    por caso
      @smoke                     CP01 y CP03 (los dos caminos felices)
      @ejercicio-02              todos

      .\scripts\run-tests.ps1 -Tags "@login"
      ./scripts/run-tests.sh --tags @login
      .\mvnw.cmd clean test "-Dkarate.tags=@login"

  Aviso: CP02 reutiliza a proposito el usuario que crea CP01, por lo que
  "-Dkarate.tags=@CP02" por si solo no tiene un usuario previo que repetir.
  Para ejecutar ese caso usar "@signup" (CP01 + CP02) o la suite completa.
  CP03 y CP04 si son autonomos: registran su propio usuario antes de empezar.

  Apuntar a otra URL base (por ejemplo, a un mock)
  -------------------------------------------------
      .\scripts\run-tests.ps1 -BaseUrl "http://localhost:8080"
      ./scripts/run-tests.sh --base-url http://localhost:8080
      .\mvnw.cmd clean test -Dapi.base.url=http://localhost:8080

  Solo compilar, sin ejecutar
  ----------------------------
      .\mvnw.cmd clean test-compile


--------------------------------------------------------------------------------
5. ESTRUCTURA DEL PROYECTO
--------------------------------------------------------------------------------

  ejercicio-02-api-demoblaze/
  |
  |-- readme.txt ................ este archivo
  |-- conclusiones.txt .......... hallazgos y conclusiones del ejercicio
  |-- pom.xml ................... dependencias y plugins (Maven)
  |-- mvnw / mvnw.cmd ........... Maven Wrapper (no requiere Maven instalado)
  |-- .mvn/wrapper/ ............. configuracion del wrapper
  |
  |-- scripts/
  |   |-- run-tests.ps1 ......... ejecucion en Windows
  |   |-- run-tests.sh .......... ejecucion en Linux / macOS
  |
  |-- evidencias/
  |   |-- LEEME.txt ............. como leer la evidencia
  |   |-- reporte-karate.zip .... reporte HTML de la ejecucion verificada
  |   |-- salidas/ .............. entradas y salidas capturadas por caso (JSON)
  |   |                           + consola-ejecucion.txt (traza HTTP completa)
  |
  |-- src/test/
      |-- java/
      |   |-- karate-config.js ........................ datos de entrada globales
      |   |-- com/qa/demoblaze/
      |       |-- runners/ApiTestSuite.java ........... punto de entrada (JUnit 5)
      |       |-- features/registro-signup.feature .... CP01 y CP02
      |       |-- features/autenticacion-login.feature  CP03 y CP04
      |       |-- fixtures/datos-de-prueba.js ......... usuarios de la ejecucion
      |       |-- fixtures/usuario-registrado.feature . dato de prueba del login
      |       |-- fixtures/evidencia.feature .......... captura entrada/salida
      |       |-- utils/Codificador.java .............. Base64 y usuario unico
      |       |-- utils/Evidencia.java ................ escribe las salidas
      |
      |-- resources/
          |-- logback-test.xml ........................ nivel de logs

  Por que los .feature estan en src/test/java: es la convencion que recomienda
  Karate (feature y runner juntos). El pom.xml declara src/test/java como
  testResource para que los .feature y karate-config.js lleguen al classpath.

  Por que los fixtures estan fuera de features/: no son casos de prueba, son
  datos y utilidades. Estan ademas marcados con @ignore para que la suite no los
  ejecute por su cuenta.


--------------------------------------------------------------------------------
6. SOBRE EL IDIOMA DE LOS CASOS
--------------------------------------------------------------------------------

Los casos estan redactados en espaniol: titulos, pasos, variables, mensajes y
comentarios. Las unicas palabras en ingles son las palabras clave estructurales
de Gherkin (Feature, Background, Scenario, Given, When, Then, And), porque
Karate -a diferencia de Cucumber- no soporta dialectos: no existe la directiva
"# language: es". Se aprovecha el paso universal "*" de Karate para que las
frases se lean en espaniol.


--------------------------------------------------------------------------------
7. VERSIONES UTILIZADAS
--------------------------------------------------------------------------------

  Karate ........................ 1.5.2 (io.karatelabs:karate-junit5)
  JUnit Jupiter ................. 5.11.4 (transitiva de Karate)
  Apache HttpClient ............. 4.5.14 (transitiva de Karate)
  GraalVM JS (motor de JS) ...... 24.0.0 (transitiva de Karate)
  Logback ....................... 1.5.20
  Maven ......................... 3.9.16 (via Maven Wrapper 3.3.4)
  Maven Compiler / Surefire ..... 3.16.0 / 3.6.1
  JDK de compilacion (release) .. 17
  JDK de ejecucion probado ...... Oracle JDK 25.0.2
  Sistema operativo probado ..... Windows 11


--------------------------------------------------------------------------------
8. RESULTADO ESPERADO
--------------------------------------------------------------------------------

En consola:

    ======================================================
    elapsed:   5,38 | threads:    1 | thread time: 2,44
    features:     2 | skipped:    0 | efficiency: 0,45
    scenarios:    4 | passed:     4 | failed: 0
    ======================================================
    Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
    BUILD SUCCESS

("Tests run: 1" es correcto: el runner de JUnit es uno y agrega los cuatro
escenarios de Karate; el conteo de casos es la linea "scenarios: 4 | passed: 4").

En el reporte: 2 features y 4 escenarios en estado passed, con el detalle de
cada peticion y cada respuesta paso a paso.


--------------------------------------------------------------------------------
9. SOLUCION DE PROBLEMAS
--------------------------------------------------------------------------------

  "java no se reconoce como comando" / "JAVA_HOME is not set"
      Instalar un JDK 17+ y agregar su carpeta bin al PATH.

  WARNING: sun.misc.Unsafe::objectFieldOffset has been called by
  com.oracle.truffle.api... (truffle-api-24.0.0.jar)
      Advertencia del motor de JavaScript de Karate (GraalVM) sobre JDK 25. No
      afecta la ejecucion; desaparece al ejecutar con JDK 17 o 21.

  Falla CP01 con errorMessage "This user already exist."
      Solo puede pasar si se fuerza el mismo nombre de usuario dos veces (por
      ejemplo repitiendo una ejecucion con el reloj detenido). El usuario se
      genera con marca de tiempo al milisegundo, asi que en condiciones normales
      siempre es nuevo.

  Falla CP03 o CP04 con errorMessage "User does not exist."
      El usuario de login no quedo registrado: revisar en el reporte el paso
      "callonce ... usuario-registrado.feature" del Background y la conectividad
      con api.demoblaze.com.

  Todos los casos fallan por timeout o por "Connection refused"
      Verificar el acceso a https://api.demoblaze.com desde la red actual. Las
      pruebas dependen de un servicio publico de terceros.

  La descarga de dependencias falla detras de un proxy corporativo
      Configurar el proxy en ~/.m2/settings.xml, o ejecutar desde una red sin
      restricciones. El wrapper descarga desde repo.maven.apache.org.

  Caracteres raros en la consola de Windows
      Ejecutar con el script run-tests.ps1, que fuerza la consola a UTF-8, o
      ejecutar "chcp 65001" antes de usar mvnw.
