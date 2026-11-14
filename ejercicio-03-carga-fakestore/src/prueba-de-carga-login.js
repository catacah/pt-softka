// ===========================================================================
//  EJERCICIO 3 - PRUEBA DE CARGA DEL SERVICIO DE LOGIN
//
//  Servicio bajo prueba (el CURL del enunciado):
//      curl -X POST https://fakestoreapi.com/auth/login \
//           -H "Content-Type: application/json" \
//           -d '{"username":"mor_2314","password":"83r5^_"}'
//
//  Escenario   : 20 TPS sostenidos (ejecutor constant-arrival-rate)
//  Datos       : datos/usuarios.csv  (columnas user,passwd)
//  Criterios   : >= 20 TPS | tiempo de respuesta <= 1,5 s | error < 3%
//
//  Ejecucion (desde la carpeta del ejercicio):
//      k6 run src/prueba-de-carga-login.js                  <- prueba de carga
//      k6 run -e ESCENARIO=smoke src/prueba-de-carga-login.js   <- verificacion
// ===========================================================================

import http from 'k6/http';
import exec from 'k6/execution';

import { entorno, urlLogin } from './config/entorno.js';
import {
  criterios,
  perfil,
  tpsMinimoAceptado,
  construirEscenarios,
  construirUmbrales,
} from './config/criterios.js';
import { usuarios, usuarioDeLaIteracion, rutaDelCsv } from './lib/usuarios.js';
import { validarYRegistrar } from './lib/validaciones.js';
import { generarReportes } from './lib/reporte.js';

export const options = {
  scenarios: construirEscenarios(entorno.escenario, usuarios.length),
  thresholds: construirUmbrales(entorno.escenario, usuarios),
  // Para que el resumen muestre p99 y el maximo, no solo el p95.
  summaryTrendStats: ['min', 'avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max', 'count'],
  // Identifica el origen del trafico en los logs del servicio.
  userAgent: 'k6-ejercicio-03-carga-login/1.0',
};

/** Se ejecuta una vez, antes de la prueba: deja el perfil asentado en la consola. */
export function setup() {
  const configuracion = {
    servicio: `POST ${urlLogin}`,
    escenario: entorno.escenario,
    credenciales: `${usuarios.length} usuarios desde ${rutaDelCsv}`,
    criterios: `>= ${criterios.tpsObjetivo} TPS (se acepta desde ${tpsMinimoAceptado}) | ` +
      `tiempo <= ${criterios.tiempoMaximoMs} ms | error < ${criterios.tasaErrorMaxima * 100}%`,
  };

  if (entorno.escenario === 'carga') {
    configuracion.perfil =
      `${criterios.tpsObjetivo} peticiones/s durante ${perfil.duracionMeseta} ` +
      `(${perfil.vusPreasignados} VUs pre-asignados, hasta ${perfil.vusMaximos})`;
  }

  console.log(`Configuracion de la prueba: ${JSON.stringify(configuracion, null, 2)}`);
  return { inicio: new Date().toISOString(), configuracion: configuracion };
}

/**
 * Una iteracion = una peticion de login con la siguiente credencial del CSV.
 */
export function iniciarSesion() {
  const usuario = usuarioDeLaIteracion(exec.scenario.iterationInTest);

  const cuerpo = JSON.stringify({
    username: usuario.usuario,
    password: usuario.password,
  });

  const parametros = {
    headers: { 'Content-Type': 'application/json' },
    tags: { servicio: 'login', usuario: usuario.usuario },
    // CLAVE: el login exitoso de este servicio responde 201, no 200. Por
    // defecto k6 considera "esperado" cualquier 2xx-3xx, asi que sin esta
    // linea la metrica http_req_failed daria por bueno, por ejemplo, un 204
    // sin token. Al declarar 201 como unico estado esperado, la tasa de error
    // del criterio 3 mide exactamente lo que pide el enunciado.
    responseCallback: http.expectedStatuses(criterios.estadoEsperado),
  };

  const respuesta = http.post(urlLogin, cuerpo, parametros);
  const valido = validarYRegistrar(respuesta, usuario);

  if (!valido) {
    // Las fallas se registran una por una: en el analisis importa saber si se
    // concentran en un usuario, en un momento o en un codigo de respuesta.
    console.warn(
      `Login fallido | usuario=${usuario.usuario} | status=${respuesta.status} | ` +
        `tiempo=${Math.round(respuesta.timings.duration)} ms | ` +
        `cuerpo=${String(respuesta.body).slice(0, 120)}`
    );
  }
}

/** Genera los reportes al terminar (HTML, JSON y texto). */
export function handleSummary(datos) {
  return generarReportes(datos, {
    escenario: entorno.escenario,
    carpeta: entorno.carpetaResultados,
    servicio: `POST ${urlLogin}`,
    usuarios: usuarios,
  });
}
