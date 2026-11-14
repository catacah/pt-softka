# Casos de prueba del servicio de AUTENTICACION de Demoblaze.
# (Sobre el idioma de las palabras clave, ver la nota de registro-signup.feature)

@login @ejercicio-02
Feature: Autenticacion de usuarios - POST /login

  Background:
    * url urlBase
    # Dato de prueba: para autenticarse, el usuario debe existir. El fixture lo
    # garantiza una sola vez por ejecucion (callonce), de modo que estos casos tambien
    # se pueden ejecutar aislados con -Dkarate.tags="@login".
    * def registrado = callonce read('classpath:com/qa/demoblaze/fixtures/usuario-registrado.feature')

    # ENTRADAS de los dos casos: el mismo usuario con password correcto e incorrecto
    * def credencialesCorrectas = { username: '#(usuarioRegistrado)', password: '#(passwordBase64)' }
    * def credencialesIncorrectas = { username: '#(usuarioRegistrado)', password: '#(passwordIncorrectoBase64)' }

  @CP03 @smoke
  Scenario: CP03 - Autenticarse con usuario y password correctos
    * print 'CP03 - entrada enviada:', credencialesCorrectas

    Given path 'login'
    And request credencialesCorrectas
    When method post
    Then status 200
    And match header content-type contains 'application/json'

    # SALIDA observada: una cadena JSON con el texto "Auth_token: <token>", no un
    # objeto; por eso el cuerpo llega entre comillas y hay que tratarlo como texto.
    * def cuerpoRecibido = response.trim()
    And match cuerpoRecibido == '#regex ^"Auth_token: .+"$'
    And match response !contains 'errorMessage'
    * print 'CP03 - salida recibida:', cuerpoRecibido

    * def token = cuerpoRecibido.replace('Auth_token: ', '').replace(/"/g, '')
    And match token == '#notnull'

    # El token no esta firmado: es Base64 reversible que contiene el propio usuario.
    # Se comprueba aqui y se documenta como hallazgo de seguridad en conclusiones.txt.
    * def Codificador = Java.type('com.qa.demoblaze.utils.Codificador')
    * def tokenDecodificado = Codificador.desdeBase64(token)
    And match tokenDecodificado contains usuarioRegistrado
    * print 'CP03 - token decodificado:', tokenDecodificado

  @CP04
  Scenario: CP04 - Intentar autenticarse con password incorrecto
    * print 'CP04 - entrada enviada:', credencialesIncorrectas

    Given path 'login'
    And request credencialesIncorrectas
    When method post
    Then status 200

    # SALIDA observada: el rechazo viaja en el cuerpo y el status sigue siendo 200
    # (no 401). Al comparar con == de forma estricta se verifica, ademas, que la
    # respuesta NO contiene ningun token.
    And match response == { errorMessage: 'Wrong password.' }
    * print 'CP04 - salida recibida:', response

