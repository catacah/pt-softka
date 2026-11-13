# Casos de prueba del servicio de REGISTRO de Demoblaze.
#
# Nota sobre el idioma: Karate no admite dialectos de Gherkin (no existe
# "# language: es"), por lo que las palabras clave estructurales -Feature,
# Background, Scenario, Given, When, Then, And- son las unicas en ingles.
# Todo lo demas (titulos, pasos, variables y comentarios) esta en espaniol.

@signup @ejercicio-02
Feature: Registro de usuarios - POST /signup

  Background:
    * url urlBase
    # ENTRADA comun: el usuario generado para esta ejecucion y el password en Base64,
    # porque el front de Demoblaze nunca envia el password en claro.
    * def credencialesNuevas = { username: '#(usuario)', password: '#(passwordBase64)' }

  @CP01 @smoke
  Scenario: CP01 - Crear un nuevo usuario en signup
    * print 'CP01 - entrada enviada:', credencialesNuevas

    Given path 'signup'
    And request credencialesNuevas
    When method post
    Then status 200
    And match header content-type contains 'application/json'

    # SALIDA observada: el cuerpo es la cadena JSON vacia ("") y NO trae errorMessage.
    # El exito solo se puede inferir por la AUSENCIA de error.
    * def cuerpoRecibido = response.trim()
    And match cuerpoRecibido == '""'
    And match response !contains 'errorMessage'
    * print 'CP01 - salida recibida:', cuerpoRecibido

  @CP02
  Scenario: CP02 - Intentar crear un usuario que ya existe
    # Este caso se apoya en CP01: reenvia el MISMO usuario que acaba de registrarse,
    # que es exactamente el escenario que pide el enunciado.
    * print 'CP02 - entrada enviada (usuario ya registrado en CP01):', credencialesNuevas

    Given path 'signup'
    And request credencialesNuevas
    When method post
    Then status 200

    # SALIDA observada: el error viaja en el cuerpo y el status sigue siendo 200 (no 409).
    And match response == { errorMessage: 'This user already exist.' }
    * print 'CP02 - salida recibida:', response
