// ---------------------------------------------------------------------------
// Entorno de la prueba.
//
// Todo lo que puede cambiar entre ejecuciones se lee de variables de k6
// (-e CLAVE=valor), para no tener que tocar el codigo: el servicio bajo
// prueba, el escenario a ejecutar y donde quedan los reportes.
// ---------------------------------------------------------------------------

/** Devuelve la variable de entorno si viene con contenido, o el valor por defecto. */
export function texto(clave, porDefecto) {
  const valor = (__ENV[clave] || '').trim();
  return valor !== '' ? valor : porDefecto;
}

/** Igual que texto(), pero valida que sea un numero. */
export function numero(clave, porDefecto) {
  const valor = parseFloat(__ENV[clave]);
  if ((__ENV[clave] || '').trim() === '') {
    return porDefecto;
  }
  if (!isFinite(valor)) {
    throw new Error(`La variable ${clave}="${__ENV[clave]}" no es un numero valido`);
  }
  return valor;
}

export const entorno = {
  // Servicio bajo prueba (el CURL del enunciado).
  urlBase: texto('URL_BASE', 'https://fakestoreapi.com'),
  rutaLogin: texto('RUTA_LOGIN', '/auth/login'),

  // Escenario a ejecutar: "carga" (el del enunciado) o "smoke" (verificacion).
  escenario: texto('ESCENARIO', 'carga').toLowerCase(),

  // Carpeta donde se escriben los reportes. Es relativa al directorio desde el
  // que se invoca k6, no al del script: los scripts de scripts/ se encargan de
  // ejecutar siempre desde la carpeta del ejercicio.
  carpetaResultados: texto('CARPETA_RESULTADOS', 'resultados'),
};

export const urlLogin = `${entorno.urlBase}${entorno.rutaLogin}`;
