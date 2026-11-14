// ---------------------------------------------------------------------------
// Metricas propias, ademas de las que k6 trae de serie.
//
// Las de k6 miden el transporte (http_req_duration, http_req_failed); estas
// miden el negocio: si el login realmente autentico y entrego un token.
// ---------------------------------------------------------------------------

import { Trend, Rate, Counter } from 'k6/metrics';

/** Tiempo de respuesta del login, aislado de cualquier otra peticion. */
export const tiempoDeRespuestaLogin = new Trend('tiempo_respuesta_login', true);

/** Porcentaje de logins que devolvieron 201 CON un token JWT valido. */
export const loginExitoso = new Rate('login_exitoso');

/** Porcentaje de peticiones que respondieron por debajo del umbral de 1,5 s. */
export const peticionesDentroDelUmbral = new Rate('peticiones_dentro_del_umbral');

/** Tokens efectivamente obtenidos (debe coincidir con los logins exitosos). */
export const tokensObtenidos = new Counter('tokens_obtenidos');

/** Peticiones por credencial del CSV: evidencia de la parametrizacion. */
export const peticionesPorUsuario = new Counter('peticiones_por_usuario');
