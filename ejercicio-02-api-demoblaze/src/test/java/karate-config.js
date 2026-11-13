/**
 * Configuracion global de la ejecucion.
 *
 * Deja disponibles para todos los casos los DATOS DE ENTRADA:
 *   - urlBase          : raiz de los servicios (sobreescribible con -Dapi.base.url)
 *   - usuario          : nombre de usuario distinto en cada ejecucion
 *   - passwordBase64   : el password tal como lo envia el front de Demoblaze (Base64)
 */
function fn() {

  var Codificador = Java.type('com.qa.demoblaze.utils.Codificador');

  var urlBase = karate.properties['api.base.url'];
  if (!urlBase) {
    urlBase = 'https://api.demoblaze.com';
  }

  var passwordPlano = 'Prueba.2026';
  var passwordIncorrectoPlano = 'PasswordIncorrecto.999';

  var configuracion = {
    urlBase: urlBase,
    usuario: Codificador.usuarioUnico('qa.auto'),
    passwordPlano: passwordPlano,
    passwordBase64: Codificador.aBase64(passwordPlano),
    passwordIncorrectoPlano: passwordIncorrectoPlano,
    passwordIncorrectoBase64: Codificador.aBase64(passwordIncorrectoPlano)
  };

  karate.configure('connectTimeout', 20000);
  karate.configure('readTimeout', 20000);

  karate.log('=== Datos de entrada de esta ejecucion ===');
  karate.log('URL base ........ ' + configuracion.urlBase);
  karate.log('Usuario ......... ' + configuracion.usuario);

  return configuracion;
}
