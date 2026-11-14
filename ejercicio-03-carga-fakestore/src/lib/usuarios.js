// ---------------------------------------------------------------------------
// Datos de entrada parametrizados desde el archivo .csv del enunciado.
//
// El archivo se lee UNA sola vez, en el contexto de inicializacion de k6, y se
// guarda en un SharedArray: la memoria la comparten todos los VUs en lugar de
// duplicarse en cada uno.
// ---------------------------------------------------------------------------

import { SharedArray } from 'k6/data';

// La ruta se resuelve relativa a ESTE archivo (src/lib/), no al directorio de
// trabajo. Se puede apuntar a otro CSV con -e ARCHIVO_USUARIOS=...
const RUTA_CSV = (__ENV.ARCHIVO_USUARIOS || '').trim() || '../../datos/usuarios.csv';

const COLUMNA_USUARIO = 'user';
const COLUMNA_PASSWORD = 'passwd';

/**
 * Parser de CSV minimo y suficiente para el formato que fija el enunciado:
 * cabecera "user,passwd" y valores sin comas ni comillas embebidas.
 *
 * Es deliberado no usar papaparse desde https://jslib.k6.io: un import remoto
 * se descarga en tiempo de compilacion y convierte la reproducibilidad del
 * entregable en algo que depende de la red (y de los proxies) de quien lo
 * ejecute. 25 lineas propias eliminan esa dependencia y, ademas, validan los
 * datos: si el CSV viene mal, la prueba no arranca en lugar de medir sobre
 * credenciales vacias.
 */
function parsearCsv(contenido, ruta) {
  const lineas = contenido
    .split('\n')
    .map((linea) => linea.replace(/\r$/, '').trim())
    .filter((linea) => linea !== '');

  if (lineas.length < 2) {
    throw new Error(`El archivo ${ruta} no tiene filas de datos (solo cabecera o vacio)`);
  }

  const cabecera = lineas[0].split(',').map((columna) => columna.trim());
  const indiceUsuario = cabecera.indexOf(COLUMNA_USUARIO);
  const indicePassword = cabecera.indexOf(COLUMNA_PASSWORD);

  if (indiceUsuario === -1 || indicePassword === -1) {
    throw new Error(
      `El archivo ${ruta} debe tener la cabecera "${COLUMNA_USUARIO},${COLUMNA_PASSWORD}" ` +
        `y tiene "${lineas[0]}"`
    );
  }

  return lineas.slice(1).map(function (linea, posicion) {
    const campos = linea.split(',');
    const usuario = (campos[indiceUsuario] || '').trim();
    const password = (campos[indicePassword] || '').trim();

    if (usuario === '' || password === '') {
      throw new Error(`Fila ${posicion + 2} de ${ruta} incompleta: "${linea}"`);
    }
    return { usuario: usuario, password: password };
  });
}

/** Los usuarios del CSV, compartidos entre todos los VUs. */
export const usuarios = new SharedArray('usuarios del CSV', function () {
  return parsearCsv(open(RUTA_CSV), RUTA_CSV);
});

/**
 * Reparte los usuarios por turnos (round-robin) segun el numero global de
 * iteracion. Es deterministico a proposito: con 3.600 peticiones y 5 usuarios,
 * cada credencial se usa exactamente 720 veces. Elegir al azar daria un reparto
 * desigual y haria que dos ejecuciones no fueran comparables.
 */
export function usuarioDeLaIteracion(numeroDeIteracion) {
  return usuarios[numeroDeIteracion % usuarios.length];
}

export const rutaDelCsv = RUTA_CSV;
