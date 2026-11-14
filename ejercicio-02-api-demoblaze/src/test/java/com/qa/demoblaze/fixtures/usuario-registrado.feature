# Fixture (dato de prueba), no es un caso de prueba: por eso vive fuera de la carpeta
# features y esta marcado con @ignore, para que la suite no lo ejecute por su cuenta.

@ignore
Feature: Dato de prueba - registrar el usuario con el que se probara el login

  Scenario: Registrar usuarioRegistrado si todavia no existe
    # Tolera las dos respuestas posibles (creado o ya existente) porque su objetivo es
    # solo dejar el dato listo; validar el registro es responsabilidad de CP01 y CP02.
    Given url urlBase
    And path 'signup'
    And request { username: '#(usuarioRegistrado)', password: '#(passwordBase64)' }
    When method post
    Then status 200
    * def yaExistia = karate.match(response, { errorMessage: '#string' }).pass
    * print 'Dato de prueba listo. Usuario:', usuarioRegistrado, '- ya existia:', yaExistia
