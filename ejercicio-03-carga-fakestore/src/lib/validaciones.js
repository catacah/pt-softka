// ---------------------------------------------------------------------------
// Validaciones que se aplican a CADA peticion, y registro de las metricas.
// ---------------------------------------------------------------------------

import { check } from 'k6';
import { criterios } from '../config/criterios.js';
import {
  tiempoDeRespuestaLogin,
  loginExitoso,
  peticionesDentroDelUmbral,
  tokensObtenidos,
  peticionesPorUsuario,
} from './metricas.js';

/**
 * Saca el token del cuerpo de la respuesta.
 *
 * Va con try/catch porque el servicio NO siempre responde JSON: con una
 * credencial invalida devuelve 401 con el texto plano "username or password is
 * incorrect", y en ese caso respuesta.json() lanza una excepcion. Sin este
 * manejo, una sola respuesta de error abortaria la iteracion y la prueba de
 * carga mediria menos peticiones de las que lanzo.
 */
export function extraerToken(respuesta) {
  try {
    const cuerpo = respuesta.json();
    if (cuerpo && typeof cuerpo.token === 'string' && cuerpo.token !== '') {
      return cuerpo.token;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/** Un JWT tiene tres partes separadas por punto: cabecera, payload y firma. */
function esJwtBienFormado(token) {
  return token !== null && token.split('.').length === 3;
}

/**
 * Valida la respuesta del login y registra las metricas de la peticion.
 * Devuelve true si el login fue exitoso de punta a punta.
 */
export function validarYRegistrar(respuesta, usuario) {
  const token = extraerToken(respuesta);
  const tiempo = respuesta.timings.duration;
  const dentroDelUmbral = tiempo < criterios.tiempoMaximoMs;
  const etiquetas = { usuario: usuario.usuario };

  const valido = check(
    respuesta,
    {
      'el login responde HTTP 201 Created': (r) => r.status === criterios.estadoEsperado,
      'la respuesta entrega un token JWT valido': () => esJwtBienFormado(token),
      'el tiempo de respuesta es menor a 1,5 s': () => dentroDelUmbral,
    },
    etiquetas
  );

  tiempoDeRespuestaLogin.add(tiempo, etiquetas);
  peticionesDentroDelUmbral.add(dentroDelUmbral, etiquetas);
  peticionesPorUsuario.add(1, etiquetas);

  const exitoso = respuesta.status === criterios.estadoEsperado && esJwtBienFormado(token);
  loginExitoso.add(exitoso, etiquetas);
  if (exitoso) {
    tokensObtenidos.add(1, etiquetas);
  }

  return valido;
}
