// ---------------------------------------------------------------------------
// Criterios de aceptacion del enunciado y perfil de carga.
//
// Los tres criterios se expresan como "thresholds" de k6, es decir: la propia
// herramienta dictamina si la prueba paso o fallo y termina con codigo de
// salida 99 si alguno se incumple. No queda a interpretacion de quien lee el
// reporte.
// ---------------------------------------------------------------------------

import { numero, texto } from './entorno.js';

export const criterios = {
  // "El escenario de la prueba al menos debe alcanzar los 20 TPS"
  tpsObjetivo: numero('TPS', 20),
  // Margen de tolerancia sobre el TPS medido: la ultima iteracion de la ventana
  // y el cierre de conexiones hacen que el promedio real sea 19,9x y no 20,00.
  toleranciaTps: numero('TOLERANCIA_TPS', 0.5),
  // "El tiempo de respuesta permitido es de maximo 1,5 segundos"
  tiempoMaximoMs: numero('TIEMPO_MAXIMO_MS', 1500),
  // "Tasa de error aceptable, menor al 3% del total de peticiones"
  tasaErrorMaxima: numero('TASA_ERROR_MAXIMA', 0.03),
  // Codigo HTTP que el servicio devuelve en un login exitoso. Es 201 y no 200:
  // ver el hallazgo 1 de conclusiones.txt.
  estadoEsperado: numero('ESTADO_ESPERADO', 201),
};

/** TPS minimo que se acepta como "se alcanzaron los 20 TPS". */
export const tpsMinimoAceptado = criterios.tpsObjetivo - criterios.toleranciaTps;

export const perfil = {
  duracionMeseta: texto('DURACION', '3m'),
  vusPreasignados: numero('VUS_PREASIGNADOS', 30),
  vusMaximos: numero('VUS_MAXIMOS', 100),
};

/**
 * Escenarios disponibles.
 *
 * carga  -> el del enunciado. Usa el ejecutor "constant-arrival-rate": k6 lanza
 *           un numero fijo de peticiones por segundo (TPS reales, no usuarios
 *           concurrentes) y agrega VUs si el servicio se pone lento, hasta
 *           vusMaximos. Es el unico ejecutor que permite fijar el TPS.
 *
 *           Se usa una meseta plana, sin rampa, a proposito: la metrica
 *           http_reqs.rate que mide el criterio de TPS se calcula como
 *           peticiones / duracion TOTAL de la ejecucion, asi que una rampa
 *           dentro del mismo escenario ensuciaria el promedio y haria el
 *           criterio inmedible (p.ej. 30s de rampa + 3m a 20 TPS promedian
 *           18,3 TPS). Los VUs se pre-asignan antes de arrancar, por lo que la
 *           meseta arranca a 20 TPS desde el primer segundo.
 *
 * smoke  -> verificacion previa: una peticion por cada usuario del CSV, en
 *           serie. Valida script, datos y conectividad en 5 peticiones antes de
 *           lanzar las ~3.600 de la prueba de carga.
 */
export function construirEscenarios(nombre, cantidadDeUsuarios) {
  const escenarios = {
    carga: {
      carga_20tps: {
        executor: 'constant-arrival-rate',
        exec: 'iniciarSesion',
        rate: criterios.tpsObjetivo,
        timeUnit: '1s',
        duration: perfil.duracionMeseta,
        preAllocatedVUs: perfil.vusPreasignados,
        maxVUs: perfil.vusMaximos,
        gracefulStop: '30s',
        tags: { escenario: 'carga' },
      },
    },
    smoke: {
      verificacion_smoke: {
        executor: 'per-vu-iterations',
        exec: 'iniciarSesion',
        vus: 1,
        iterations: cantidadDeUsuarios,
        maxDuration: '1m',
        tags: { escenario: 'smoke' },
      },
    },
  };

  if (!escenarios[nombre]) {
    throw new Error(
      `ESCENARIO="${nombre}" no existe. Valores validos: ${Object.keys(escenarios).join(', ')}`
    );
  }
  return escenarios[nombre];
}

/**
 * Umbrales por escenario.
 *
 * En "carga" son los tres criterios del enunciado. En "smoke" se exige
 * perfeccion (5 de 5), porque es una verificacion del script, no una medicion.
 */
export function construirUmbrales(nombre, usuarios) {
  // Deja a la vista en el resumen que el CSV roto efectivamente los 5 usuarios:
  // cada submetrica aparece con su propio conteo.
  const porUsuario = {};
  for (const usuario of usuarios) {
    porUsuario[`peticiones_por_usuario{usuario:${usuario.usuario}}`] = ['count>0'];
  }

  if (nombre === 'smoke') {
    return Object.assign(
      {
        checks: ['rate==1.00'],
        http_req_failed: ['rate==0.00'],
        login_exitoso: ['rate==1.00'],
      },
      porUsuario
    );
  }

  return Object.assign(
    {
      // --- CRITERIO 1: al menos 20 TPS -----------------------------------
      // http_reqs.rate = peticiones / duracion total de la ejecucion.
      http_reqs: [`rate>=${tpsMinimoAceptado}`],
      // Si k6 no logra mantener el ritmo (servicio lento y VUs agotados)
      // descarta iteraciones: con una sola iteracion descartada el TPS
      // configurado deja de ser el TPS real y la prueba no es valida.
      dropped_iterations: ['count==0'],

      // --- CRITERIO 2: tiempo de respuesta maximo 1,5 s ------------------
      // Criterio que dictamina: el 95% y el 99% de las peticiones por debajo
      // de 1,5 s. El valor maximo absoluto se reporta aparte (ver
      // conclusiones.txt, seccion de decisiones): un unico pico de red no
      // invalida una medicion de miles de peticiones.
      http_req_duration: [
        `p(95)<${criterios.tiempoMaximoMs}`,
        `p(99)<${criterios.tiempoMaximoMs}`,
      ],
      // Porcentaje de peticiones que respetaron el umbral, medido peticion a
      // peticion. Es la lectura estricta del criterio, acotada al 3% que el
      // propio enunciado considera tolerable.
      peticiones_dentro_del_umbral: [`rate>${1 - criterios.tasaErrorMaxima}`],

      // --- CRITERIO 3: tasa de error menor al 3% -------------------------
      // http_req_failed cuenta como fallida toda respuesta distinta de 201
      // (ver responseCallback en el script principal).
      http_req_failed: [`rate<${criterios.tasaErrorMaxima}`],
      // Lo mismo visto desde la funcionalidad: no basta con que responda 201,
      // tiene que entregar un token valido.
      login_exitoso: [`rate>${1 - criterios.tasaErrorMaxima}`],
      checks: [`rate>${1 - criterios.tasaErrorMaxima}`],
    },
    porUsuario
  );
}
