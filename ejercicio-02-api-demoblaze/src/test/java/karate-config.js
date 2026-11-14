/**
 * Configuracion global de la ejecucion.
 *
 * Deja disponibles para todos los casos los DATOS DE ENTRADA:
 *   - urlBase                  : raiz de los servicios (-Dapi.base.url para cambiarla)
 *   - usuarioNuevo             : usuario que todavia no existe (CP01 y CP02)
 *   - usuarioRegistrado        : usuario ya registrado (CP03 y CP04)
 *   - passwordBase64           : el password tal como lo envia el front (Base64)
 *   - passwordIncorrectoBase64 : password valido que no corresponde al usuario
 */
function fn() {

  var urlBase = karate.properties['api.base.url'];
  if (!urlBase) {
    urlBase = 'https://api.demoblaze.com';
  }

  var datos = karate.callSingle('classpath:com/qa/demoblaze/fixtures/datos-de-prueba.js');

  var configuracion = {
    urlBase: urlBase,
    usuarioNuevo: datos.usuarioNuevo,
    usuarioRegistrado: datos.usuarioRegistrado,
    passwordPlano: datos.passwordPlano,
    passwordBase64: datos.passwordBase64,
    passwordIncorrectoPlano: datos.passwordIncorrectoPlano,
    passwordIncorrectoBase64: datos.passwordIncorrectoBase64
  };

  karate.configure('connectTimeout', 20000);
  karate.configure('readTimeout', 20000);

  return configuracion;
}
