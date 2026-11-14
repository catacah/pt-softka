/**
 * Datos de prueba de la ejecucion. Se evalua UNA SOLA VEZ por ejecucion porque
 * karate-config.js lo invoca con karate.callSingle() (karate-config.js, en cambio,
 * se evalua para CADA escenario, asi que generar los usuarios alla produciria un
 * usuario distinto por caso).
 *
 * Se preparan DOS usuarios con roles distintos, para que ningun caso dependa del
 * orden en que se ejecuten los features:
 *   - usuarioNuevo       : no existe todavia. Lo crea CP01 y lo reintenta CP02.
 *   - usuarioRegistrado  : lo registra el fixture usuario-registrado.feature para
 *                          que CP03 y CP04 tengan contra quien autenticarse.
 */
function fn() {

  var Codificador = Java.type('com.qa.demoblaze.utils.Codificador');

  var passwordPlano = 'Prueba.2026';
  var passwordIncorrectoPlano = 'PasswordIncorrecto.999';

  return {
    usuarioNuevo: Codificador.usuarioUnico('qa.nuevo'),
    usuarioRegistrado: Codificador.usuarioUnico('qa.login'),
    passwordPlano: passwordPlano,
    passwordBase64: Codificador.aBase64(passwordPlano),
    passwordIncorrectoPlano: passwordIncorrectoPlano,
    passwordIncorrectoBase64: Codificador.aBase64(passwordIncorrectoPlano)
  };
}
