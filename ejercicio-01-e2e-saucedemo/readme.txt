================================================================================
 EJERCICIO 1 - PRUEBA FUNCIONAL AUTOMATIZADA E2E
 Flujo de compra en https://www.saucedemo.com/
 Serenity BDD + Cucumber + Patron Screenplay
================================================================================

Repositorio : https://github.com/catacah/pt-softka
Ejecutado y verificado el 13/11/2026 - Resultado: 1 escenario, 1 exitoso.


--------------------------------------------------------------------------------
1. QUE AUTOMATIZA ESTA PRUEBA
--------------------------------------------------------------------------------

Un unico escenario E2E que cubre, de punta a punta, lo solicitado en el enunciado:

  1. Autenticarse con el usuario standard_user / secret_sauce
  2. Agregar dos productos al carrito
     (Sauce Labs Backpack y Sauce Labs Bike Light)
  3. Visualizar el carrito
  4. Completar el formulario de compra
  5. Finalizar la compra hasta la confirmacion "THANK YOU FOR YOUR ORDER"

Ademas se verifica, dentro del mismo flujo:
  - que el contador del icono del carrito muestre 2 productos;
  - que el carrito contenga exactamente los dos productos agregados.


--------------------------------------------------------------------------------
2. PRERREQUISITOS
--------------------------------------------------------------------------------

  OBLIGATORIOS
  ------------
  [1] JDK 17 o superior, con la variable JAVA_HOME o "java" en el PATH.
      Verificar con:   java -version
      Probado con:     Oracle JDK 25.0.2

  [2] Google Chrome instalado.
      Probado con:     Chrome 157.0.8103.50
      No hay que descargar chromedriver: Selenium Manager (incluido en Selenium)
      resuelve y descarga el driver que corresponde a la version de Chrome.

  [3] Conexion a internet (para descargar dependencias y para acceder al sitio
      bajo prueba).

  NO SE NECESITA
  --------------
  - Maven: el proyecto incluye Maven Wrapper (mvnw / mvnw.cmd). La primera
    ejecucion descarga Apache Maven 3.9.16 automaticamente.
  - Ningun binario de driver versionado en el repositorio.
  - Ningun IDE.


--------------------------------------------------------------------------------
3. EJECUCION PASO A PASO
--------------------------------------------------------------------------------

  PASO 1 - Clonar el repositorio
  -------------------------------
      git clone https://github.com/catacah/pt-softka.git

  PASO 2 - Entrar a la carpeta del ejercicio
  -------------------------------------------
      cd pt-softka/ejercicio-01-e2e-saucedemo

  PASO 3 - Ejecutar la prueba

      Opcion A (recomendada) - script de ejecucion
      --------------------------------------------
      Windows (PowerShell):
          .\scripts\run-tests.ps1

      Linux / macOS / Git Bash:
          chmod +x scripts/run-tests.sh
          ./scripts/run-tests.sh

      El script ejecuta la prueba, imprime el resultado y en Windows abre el
      reporte HTML al terminar.

      Opcion B - Maven Wrapper directo
      ---------------------------------
      Windows (PowerShell o CMD):
          .\mvnw.cmd clean verify

      Linux / macOS / Git Bash:
          ./mvnw clean verify

  PASO 4 - Revisar el reporte
  ----------------------------
  Al finalizar, abrir en el navegador:

      target/site/serenity/index.html            (reporte interactivo)
      target/site/serenity/serenity-summary.html (resumen en una sola pagina)

  NOTA: la primera ejecucion tarda mas (descarga Maven y las dependencias,
  aprox. 2-4 minutos segun la conexion). Las siguientes tardan ~20 segundos.


--------------------------------------------------------------------------------
4. OPCIONES DE EJECUCION
--------------------------------------------------------------------------------

  Ver el navegador en pantalla (por defecto corre headless)
  ---------------------------------------------------------
      .\scripts\run-tests.ps1 -Visible
      ./scripts/run-tests.sh --visible
      .\mvnw.cmd clean verify -Dheadless.mode=false

  Filtrar por etiqueta de Cucumber
  ---------------------------------
  Etiquetas disponibles: @compra  @e2e  @smoke  @ejercicio-01

      .\scripts\run-tests.ps1 -Tags "@smoke"
      ./scripts/run-tests.sh --tags @smoke
      .\mvnw.cmd clean verify "-Dtags=@smoke"

  Apuntar a otra URL base
  ------------------------
      .\mvnw.cmd clean verify -Dwebdriver.base.url=https://www.saucedemo.com

  Solo compilar, sin ejecutar
  ----------------------------
      .\mvnw.cmd clean test-compile


--------------------------------------------------------------------------------
5. ESTRUCTURA DEL PROYECTO
--------------------------------------------------------------------------------

  ejercicio-01-e2e-saucedemo/
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
  |   |-- LEEME.txt ............. como abrir la evidencia
  |   |-- reporte-serenity.zip .. reporte HTML de la ejecucion verificada
  |   |                           (descomprimir y abrir index.html)
  |   |-- capturas/ ............. 7 capturas clave del flujo, renombradas
  |
  |-- src/test/
      |-- java/com/qa/saucedemo/
      |   |-- runners/ .......... CucumberTestSuite: punto de entrada
      |   |-- navigation/ ....... navegacion por URL
      |   |-- ui/ ............... locators por pantalla (Targets)
      |   |-- tasks/ ............ acciones de negocio (Screenplay Tasks)
      |   |-- questions/ ........ consultas sobre el estado de la UI
      |   |-- stepdefinitions/ .. union entre el Gherkin y las Tasks
      |
      |-- resources/
          |-- features/compra/compra_exitosa.feature ... escenario en Gherkin
          |-- serenity.conf ........................... navegador, capturas, URL
          |-- junit-platform.properties ............... configuracion de Cucumber
          |-- logback-test.xml ........................ nivel de logs


--------------------------------------------------------------------------------
6. VERSIONES UTILIZADAS
--------------------------------------------------------------------------------

  Serenity BDD .................. 5.4.2
  Cucumber ...................... 8.0.4
  JUnit Platform / Jupiter ...... 6.1.3
  Selenium ...................... 4.52.0 (transitiva de Serenity)
  AssertJ ....................... 3.27.6
  Maven ......................... 3.9.16 (via Maven Wrapper 3.3.4)
  Maven Compiler / Surefire ..... 3.16.0 / 3.6.1
  JDK de compilacion (release) .. 17
  JDK de ejecucion probado ...... Oracle JDK 25.0.2
  Navegador probado ............. Google Chrome 157.0.8103.50
  Sistema operativo probado ..... Windows 11


--------------------------------------------------------------------------------
7. RESULTADO ESPERADO
--------------------------------------------------------------------------------

En consola:

    Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
    ...
    Serenity BDD Test Results
      - Results: 1 tests | 1 passed | 0 failed | 0 errors
    BUILD SUCCESS

En el reporte: el escenario "Compra exitosa de dos productos hasta la
confirmacion del pedido" en estado PASSED, con los 9 pasos del flujo narrados
en lenguaje de negocio y una captura de pantalla por cada accion ejecutada
(29 capturas en la ejecucion de referencia).


--------------------------------------------------------------------------------
8. SOLUCION DE PROBLEMAS
--------------------------------------------------------------------------------

  "java no se reconoce como comando" / "JAVA_HOME is not set"
      Instalar un JDK 17+ y agregar su carpeta bin al PATH.

  "session not created: This version of ChromeDriver only supports Chrome
  version XXX"
      Chrome esta desactualizado respecto al driver. Actualizar Google Chrome
      (Ayuda > Informacion de Google Chrome) y volver a ejecutar.

  La descarga de dependencias falla detras de un proxy corporativo
      Configurar el proxy en ~/.m2/settings.xml, o ejecutar desde una red sin
      restricciones. El wrapper descarga desde repo.maven.apache.org.

  "Unable to find an exact match for CDP version 157"
      Es solo una advertencia de Selenium: la version de Chrome es mas nueva
      que el soporte de DevTools incluido en Selenium 4.52. No afecta esta
      prueba, que no usa el protocolo CDP.

  La prueba falla por timeout en el primer paso
      Verificar el acceso a https://www.saucedemo.com/ desde el navegador.
      La prueba depende de un sitio publico de terceros.

  Caracteres raros en la consola de Windows (ó, í, etc.)
      Ejecutar con el script run-tests.ps1, que fuerza la consola a UTF-8, o
      ejecutar "chcp 65001" antes de usar mvnw. Los acentos del reporte HTML
      se muestran correctamente en cualquier caso.
