// ---------------------------------------------------------------------------
// Reportes de la ejecucion: HTML, JSON y texto.
//
// Se generan a mano, sin dependencias externas: los reportes HTML habituales
// de k6 (k6-reporter) se importan desde una URL y se descargan en tiempo de
// compilacion, lo que ataria la reproducibilidad del entregable a la red de
// quien lo ejecute. Ademas, asi el reporte dictamina en espaniol los tres
// criterios del enunciado, que es lo que se tiene que poder leer de un golpe.
// ---------------------------------------------------------------------------

import { criterios, tpsMinimoAceptado } from '../config/criterios.js';

// --------------------------- utilidades de formato -------------------------

/** Numero con separador de miles y coma decimal (convencion en espaniol). */
function num(valor, decimales) {
  if (valor === null || valor === undefined || isNaN(valor)) {
    return 'n/d';
  }
  const partes = Number(valor)
    .toFixed(decimales === undefined ? 2 : decimales)
    .split('.');
  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return partes.length > 1 ? partes[0] + ',' + partes[1] : partes[0];
}

function entero(valor) {
  return num(valor, 0);
}

function ms(valor) {
  return valor === null || valor === undefined ? 'n/d' : num(valor, 2) + ' ms';
}

function porcentaje(valor) {
  return valor === null || valor === undefined ? 'n/d' : num(valor * 100, 2) + ' %';
}

function rellenar(texto, ancho) {
  let salida = String(texto);
  while (salida.length < ancho) {
    salida += ' ';
  }
  return salida;
}

function dosDigitos(valor) {
  return String(valor).length < 2 ? '0' + valor : String(valor);
}

function fechaLegible(fecha) {
  const dia = dosDigitos(fecha.getDate());
  const mes = dosDigitos(fecha.getMonth() + 1);
  const hora = dosDigitos(fecha.getHours());
  const minuto = dosDigitos(fecha.getMinutes());
  const segundo = dosDigitos(fecha.getSeconds());
  return dia + '/' + mes + '/' + fecha.getFullYear() + ' ' + hora + ':' + minuto + ':' + segundo;
}

function escaparHtml(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --------------------------- lectura del resumen ---------------------------

function valorDe(datos, metrica, clave) {
  const medida = datos.metrics[metrica];
  if (!medida || medida.values[clave] === undefined || medida.values[clave] === null) {
    return null;
  }
  return medida.values[clave];
}

const ESTADISTICAS = ['min', 'avg', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'];

/** Peticiones por credencial, leidas de peticiones_por_usuario{usuario:X}. */
function repartoPorUsuario(datos) {
  const reparto = [];
  for (const nombre of Object.keys(datos.metrics)) {
    const coincidencia = nombre.match(/^peticiones_por_usuario\{usuario:(.+)\}$/);
    if (coincidencia) {
      reparto.push({
        usuario: coincidencia[1],
        peticiones: valorDe(datos, nombre, 'count') || 0,
      });
    }
  }
  return reparto.sort((a, b) => b.peticiones - a.peticiones);
}

/** Todos los umbrales declarados, con su resultado. */
function umbralesEvaluados(datos) {
  const lista = [];
  for (const nombre of Object.keys(datos.metrics)) {
    const umbrales = datos.metrics[nombre].thresholds;
    if (!umbrales) {
      continue;
    }
    for (const expresion of Object.keys(umbrales)) {
      lista.push({
        metrica: nombre,
        expresion: expresion,
        cumple: umbrales[expresion].ok === true,
      });
    }
  }
  // Primero lo que falla: es lo que hay que mirar.
  return lista.sort((a, b) => (a.cumple === b.cumple ? 0 : a.cumple ? 1 : -1));
}

function validaciones(datos) {
  const raiz = datos.root_group || {};
  const lista = (raiz.checks || []).map((check) => ({
    nombre: check.name,
    exitos: check.passes || 0,
    fallas: check.fails || 0,
  }));
  for (const grupo of raiz.groups || []) {
    for (const check of grupo.checks || []) {
      lista.push({ nombre: check.name, exitos: check.passes || 0, fallas: check.fails || 0 });
    }
  }
  return lista;
}

// --------------------------- evaluacion de criterios -----------------------

function evaluar(datos) {
  const duracionSegundos = (datos.state.testRunDurationMs || 0) / 1000;
  const peticiones = valorDe(datos, 'http_reqs', 'count') || 0;
  const tps = duracionSegundos > 0 ? peticiones / duracionSegundos : 0;

  const p95 = valorDe(datos, 'http_req_duration', 'p(95)');
  const p99 = valorDe(datos, 'http_req_duration', 'p(99)');
  const maximo = valorDe(datos, 'http_req_duration', 'max');

  const dentro = valorDe(datos, 'peticiones_dentro_del_umbral', 'passes') || 0;
  const fuera = valorDe(datos, 'peticiones_dentro_del_umbral', 'fails') || 0;
  const tasaDentro = valorDe(datos, 'peticiones_dentro_del_umbral', 'rate');

  const tasaError = valorDe(datos, 'http_req_failed', 'rate') || 0;
  // En una metrica Rate, "passes" son las veces que la condicion fue cierta:
  // en http_req_failed eso es, justamente, la peticion fallida.
  const fallidas = valorDe(datos, 'http_req_failed', 'passes') || 0;
  const tasaLoginExitoso = valorDe(datos, 'login_exitoso', 'rate');
  const descartadas = valorDe(datos, 'dropped_iterations', 'count') || 0;

  const criteriosEvaluados = [
    {
      titulo: 'Alcanzar al menos ' + criterios.tpsObjetivo + ' TPS',
      cumple: tps >= tpsMinimoAceptado && descartadas === 0,
      medido:
        num(tps, 2) + ' TPS (' + entero(peticiones) + ' peticiones en ' + num(duracionSegundos, 1) + ' s)',
      referencia:
        'minimo aceptado ' + num(tpsMinimoAceptado, 2) + ' TPS, iteraciones descartadas ' + entero(descartadas),
    },
    {
      titulo: 'Tiempo de respuesta maximo ' + num(criterios.tiempoMaximoMs / 1000, 1) + ' s',
      cumple:
        p95 !== null && p95 < criterios.tiempoMaximoMs && p99 !== null && p99 < criterios.tiempoMaximoMs,
      medido: 'p95 ' + ms(p95) + ' | p99 ' + ms(p99) + ' | maximo ' + ms(maximo),
      referencia:
        entero(fuera) +
        ' de ' +
        entero(dentro + fuera) +
        ' peticiones sobre el umbral (' +
        porcentaje(tasaDentro === null ? 0 : 1 - tasaDentro) +
        ')',
    },
    {
      titulo: 'Tasa de error menor al ' + num(criterios.tasaErrorMaxima * 100, 0) + ' % del total',
      cumple: tasaError < criterios.tasaErrorMaxima,
      medido: porcentaje(tasaError) + ' (' + entero(fallidas) + ' de ' + entero(peticiones) + ' peticiones)',
      referencia: 'logins exitosos con token ' + porcentaje(tasaLoginExitoso),
    },
  ];

  const umbrales = umbralesEvaluados(datos);

  return {
    duracionSegundos: duracionSegundos,
    peticiones: peticiones,
    tps: tps,
    p95: p95,
    p99: p99,
    maximo: maximo,
    tasaError: tasaError,
    fallidas: fallidas,
    fuera: fuera,
    descartadas: descartadas,
    criterios: criteriosEvaluados,
    umbrales: umbrales,
    validaciones: validaciones(datos),
    reparto: repartoPorUsuario(datos),
    todosLosUmbralesCumplen: umbrales.every((umbral) => umbral.cumple),
    todosLosCriteriosCumplen: criteriosEvaluados.every((criterio) => criterio.cumple),
  };
}

// --------------------------- reporte de texto ------------------------------

const ANCHO = 80;

function linea(caracter) {
  let salida = '';
  while (salida.length < ANCHO) {
    salida += caracter;
  }
  return salida;
}

function reporteDeTexto(datos, contexto, resultado) {
  const esCarga = contexto.escenario === 'carga';
  const salida = [];

  salida.push(linea('='));
  salida.push(' EJERCICIO 3 - PRUEBA DE CARGA DEL SERVICIO DE LOGIN');
  salida.push(' ' + contexto.servicio);
  salida.push(linea('='));
  salida.push('');
  salida.push(
    ' Escenario ........... ' +
      contexto.escenario +
      (esCarga ? '' : '   (verificacion previa, no es la medicion)')
  );
  salida.push(' Fecha ............... ' + fechaLegible(new Date()));
  salida.push(' Duracion ............ ' + num(resultado.duracionSegundos, 1) + ' s');
  salida.push(' Peticiones .......... ' + entero(resultado.peticiones));
  salida.push(
    ' Credenciales ........ ' + contexto.usuarios.length + ' usuarios parametrizados desde el CSV'
  );
  salida.push('');

  if (esCarga) {
    salida.push(linea('-'));
    salida.push(' CRITERIOS DE ACEPTACION DEL ENUNCIADO');
    salida.push(linea('-'));
    salida.push('');
    resultado.criterios.forEach(function (criterio, indice) {
      salida.push(
        ' [' + (criterio.cumple ? 'CUMPLE   ' : 'NO CUMPLE') + ']  ' + (indice + 1) + '. ' + criterio.titulo
      );
      salida.push('                Medido: ' + criterio.medido);
      salida.push('                (' + criterio.referencia + ')');
      salida.push('');
    });
  }

  salida.push(linea('-'));
  salida.push(' TIEMPO DE RESPUESTA (ms)');
  salida.push(linea('-'));
  salida.push('');
  const tiempos = datos.metrics.http_req_duration;
  if (tiempos) {
    salida.push('   ' + ESTADISTICAS.map((estadistica) => rellenar(estadistica, 10)).join(''));
    salida.push(
      '   ' + ESTADISTICAS.map((estadistica) => rellenar(num(tiempos.values[estadistica], 0), 10)).join('')
    );
  }
  salida.push('');
  salida.push(
    ' Espera del servidor (http_req_waiting) p95 ... ' + ms(valorDe(datos, 'http_req_waiting', 'p(95)'))
  );
  salida.push(
    ' Conexion TCP (http_req_connecting) maximo .... ' + ms(valorDe(datos, 'http_req_connecting', 'max'))
  );
  salida.push(
    ' Handshake TLS (http_req_tls_handshaking) max . ' +
      ms(valorDe(datos, 'http_req_tls_handshaking', 'max'))
  );
  salida.push('');

  salida.push(linea('-'));
  salida.push(' VALIDACIONES POR PETICION');
  salida.push(linea('-'));
  salida.push('');
  for (const validacion of resultado.validaciones) {
    const total = validacion.exitos + validacion.fallas;
    salida.push(
      ' ' +
        (validacion.fallas === 0 ? '[OK]   ' : '[FALLA]') +
        ' ' +
        rellenar(validacion.nombre, 50) +
        ' ' +
        entero(validacion.exitos) +
        '/' +
        entero(total)
    );
  }
  salida.push('');

  salida.push(linea('-'));
  salida.push(' REPARTO POR CREDENCIAL DEL CSV');
  salida.push(linea('-'));
  salida.push('');
  for (const fila of resultado.reparto) {
    const plural = fila.peticiones === 1 ? ' peticion' : ' peticiones';
    salida.push(' ' + rellenar(fila.usuario, 20) + entero(fila.peticiones) + plural);
  }
  salida.push('');

  salida.push(linea('-'));
  salida.push(' UMBRALES DECLARADOS (los evalua k6)');
  salida.push(linea('-'));
  salida.push('');
  for (const umbral of resultado.umbrales) {
    salida.push(
      ' ' +
        (umbral.cumple ? '[OK]   ' : '[FALLA]') +
        ' ' +
        rellenar(umbral.metrica, 44) +
        ' ' +
        umbral.expresion
    );
  }
  salida.push('');

  salida.push(linea('='));
  salida.push(
    ' RESULTADO: ' +
      (resultado.todosLosUmbralesCumplen
        ? 'PRUEBA EXITOSA - todos los umbrales se cumplen'
        : 'PRUEBA FALLIDA - hay umbrales incumplidos (k6 sale con codigo 99)')
  );
  salida.push(linea('='));
  salida.push('');

  return salida.join('\n');
}

// --------------------------- reporte HTML ----------------------------------

const METRICAS_DE_TIEMPO = [
  ['Tiempo de respuesta total (http_req_duration)', 'http_req_duration'],
  ['Tiempo de respuesta del login (metrica propia)', 'tiempo_respuesta_login'],
  ['Espera del servidor (http_req_waiting)', 'http_req_waiting'],
  ['Envio de la peticion (http_req_sending)', 'http_req_sending'],
  ['Recepcion de la respuesta (http_req_receiving)', 'http_req_receiving'],
  ['Conexion TCP (http_req_connecting)', 'http_req_connecting'],
  ['Handshake TLS (http_req_tls_handshaking)', 'http_req_tls_handshaking'],
  ['Duracion de la iteracion (iteration_duration)', 'iteration_duration'],
];

function tablaDeTiempos(datos) {
  const filas = METRICAS_DE_TIEMPO.filter((par) => datos.metrics[par[1]])
    .map(function (par) {
      const celdas = ESTADISTICAS.map(
        (estadistica) => '<td class="num">' + num(datos.metrics[par[1]].values[estadistica], 1) + '</td>'
      ).join('');
      return '<tr><th scope="row">' + escaparHtml(par[0]) + '</th>' + celdas + '</tr>';
    })
    .join('\n');

  const encabezados = ESTADISTICAS.map(
    (estadistica) => '<th scope="col" class="num">' + estadistica + '</th>'
  ).join('');

  return (
    '<table>\n  <thead><tr><th scope="col">Métrica (ms)</th>' +
    encabezados +
    '</tr></thead>\n  <tbody>\n' +
    filas +
    '\n  </tbody>\n</table>'
  );
}

const ESTILOS = [
  ':root{--tinta:#16202b;--suave:#5d6b7a;--borde:#dfe5ec;--fondo:#f5f7fa;',
  '--ok:#1f7a4d;--ok-suave:#e8f5ee;--falla:#b3261e;--falla-suave:#fdeceb;--acento:#1b4f91}',
  '*{box-sizing:border-box}',
  'body{margin:0;padding:32px 20px 64px;background:var(--fondo);color:var(--tinta);',
  'font:15px/1.55 "Segoe UI",Roboto,Helvetica,Arial,sans-serif}',
  'main{max-width:1060px;margin:0 auto}',
  'header.portada{background:#fff;border:1px solid var(--borde);border-radius:10px;padding:24px 28px}',
  'header.portada h1{margin:0 0 4px;font-size:22px}',
  'p.servicio{margin:0 0 18px;color:var(--suave);font-family:ui-monospace,Consolas,monospace;font-size:13px}',
  '.veredicto-global{display:inline-block;padding:6px 14px;border-radius:999px;font-weight:700;',
  'font-size:13px;letter-spacing:.04em}',
  '.veredicto-global.ok{background:var(--ok-suave);color:var(--ok)}',
  '.veredicto-global.falla{background:var(--falla-suave);color:var(--falla)}',
  'dl.ficha{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px 24px;margin:20px 0 0}',
  'dl.ficha dt{color:var(--suave);font-size:11.5px;text-transform:uppercase;letter-spacing:.05em}',
  'dl.ficha dd{margin:2px 0 0;font-size:17px;font-weight:600}',
  'h2{font-size:14px;text-transform:uppercase;letter-spacing:.06em;color:var(--suave);margin:32px 0 12px}',
  'section.criterios{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px}',
  'article.criterio{background:#fff;border:1px solid var(--borde);border-left:5px solid var(--ok);',
  'border-radius:10px;padding:18px 20px}',
  'article.criterio.falla{border-left-color:var(--falla)}',
  'article.criterio .etiqueta{margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--suave)}',
  'article.criterio h3{margin:4px 0 12px;font-size:16px}',
  'article.criterio .medido{margin:0;font-family:ui-monospace,Consolas,monospace;font-size:13px}',
  'article.criterio .referencia{margin:6px 0 14px;color:var(--suave);font-size:12.5px}',
  'article.criterio .veredicto{margin:0;font-weight:700;font-size:13px;letter-spacing:.04em;color:var(--ok)}',
  'article.criterio.falla .veredicto{color:var(--falla)}',
  'table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--borde);',
  'border-radius:10px;overflow:hidden;font-size:13.5px}',
  'caption{caption-side:bottom;text-align:left;color:var(--suave);font-size:12.5px;padding:8px 2px}',
  'th,td{padding:9px 12px;text-align:left;border-bottom:1px solid var(--borde)}',
  'thead th{background:#eef2f7;font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--suave)}',
  'tbody tr:last-child th,tbody tr:last-child td{border-bottom:0}',
  'td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;font-family:ui-monospace,Consolas,monospace}',
  'tbody tr.falla{background:var(--falla-suave)}',
  'td.estado{font-weight:600}tr.ok td.estado{color:var(--ok)}tr.falla td.estado{color:var(--falla)}',
  'td.barra{width:34%}td.barra span{display:block;height:9px;border-radius:5px;background:var(--acento);min-width:2px}',
  'code{font-family:ui-monospace,Consolas,monospace;font-size:12.5px}',
  '.desbordable{overflow-x:auto}',
  'footer{margin-top:36px;color:var(--suave);font-size:12.5px}',
  '@media(max-width:620px){body{padding:18px 14px 40px}dl.ficha dd{font-size:15px}}',
].join('');

function reporteHtml(datos, contexto, resultado) {
  const esCarga = contexto.escenario === 'carga';
  const veredicto = resultado.todosLosUmbralesCumplen;

  const tarjetas = resultado.criterios
    .map(function (criterio, indice) {
      return [
        '  <article class="criterio ' + (criterio.cumple ? 'ok' : 'falla') + '">',
        '    <p class="etiqueta">Criterio ' + (indice + 1) + '</p>',
        '    <h3>' + escaparHtml(criterio.titulo) + '</h3>',
        '    <p class="medido">' + escaparHtml(criterio.medido) + '</p>',
        '    <p class="referencia">' + escaparHtml(criterio.referencia) + '</p>',
        '    <p class="veredicto">' + (criterio.cumple ? 'CUMPLE' : 'NO CUMPLE') + '</p>',
        '  </article>',
      ].join('\n');
    })
    .join('\n');

  const filasValidaciones = resultado.validaciones
    .map(function (validacion) {
      const total = validacion.exitos + validacion.fallas;
      return (
        '<tr class="' +
        (validacion.fallas === 0 ? 'ok' : 'falla') +
        '"><th scope="row">' +
        escaparHtml(validacion.nombre) +
        '</th><td class="num">' +
        entero(validacion.exitos) +
        '</td><td class="num">' +
        entero(validacion.fallas) +
        '</td><td class="num">' +
        porcentaje(total === 0 ? 0 : validacion.exitos / total) +
        '</td></tr>'
      );
    })
    .join('\n');

  const filasUmbrales = resultado.umbrales
    .map(function (umbral) {
      return (
        '<tr class="' +
        (umbral.cumple ? 'ok' : 'falla') +
        '"><th scope="row"><code>' +
        escaparHtml(umbral.metrica) +
        '</code></th><td><code>' +
        escaparHtml(umbral.expresion) +
        '</code></td><td class="estado">' +
        (umbral.cumple ? 'cumple' : 'no cumple') +
        '</td></tr>'
      );
    })
    .join('\n');

  const totalReparto = resultado.reparto.reduce((suma, fila) => suma + fila.peticiones, 0) || 1;
  const filasReparto = resultado.reparto
    .map(function (fila) {
      return (
        '<tr><th scope="row"><code>' +
        escaparHtml(fila.usuario) +
        '</code></th><td class="num">' +
        entero(fila.peticiones) +
        '</td><td class="barra"><span style="width:' +
        ((fila.peticiones / totalReparto) * 100).toFixed(1) +
        '%"></span></td><td class="num">' +
        porcentaje(fila.peticiones / totalReparto) +
        '</td></tr>'
      );
    })
    .join('\n');

  const bloqueCriterios = esCarga
    ? '  <h2>Criterios de aceptación del enunciado</h2>\n  <section class="criterios">\n' +
      tarjetas +
      '\n  </section>'
    : '  <h2>Verificación previa (smoke)</h2>\n' +
      '  <p>Verificación del script, de los datos y de la conectividad: una petición por credencial\n' +
      '     del CSV. Los criterios de carga se miden en el escenario <code>carga</code>.</p>';

  return [
    '<!DOCTYPE html>',
    '<html lang="es">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>Prueba de carga del login - Ejercicio 3</title>',
    '<style>' + ESTILOS + '</style>',
    '</head>',
    '<body>',
    '<main>',
    '  <header class="portada">',
    '    <h1>Ejercicio 3 &mdash; Prueba de carga del servicio de login</h1>',
    '    <p class="servicio">' + escaparHtml(contexto.servicio) + '</p>',
    '    <span class="veredicto-global ' +
      (veredicto ? 'ok' : 'falla') +
      '">' +
      (veredicto ? 'PRUEBA EXITOSA' : 'PRUEBA FALLIDA') +
      '</span>',
    '    <dl class="ficha">',
    '      <div><dt>Escenario</dt><dd>' + escaparHtml(contexto.escenario) + '</dd></div>',
    '      <div><dt>Peticiones</dt><dd>' + entero(resultado.peticiones) + '</dd></div>',
    '      <div><dt>TPS alcanzado</dt><dd>' + num(resultado.tps, 2) + '</dd></div>',
    '      <div><dt>p95</dt><dd>' + ms(resultado.p95) + '</dd></div>',
    '      <div><dt>Tasa de error</dt><dd>' + porcentaje(resultado.tasaError) + '</dd></div>',
    '      <div><dt>Duración</dt><dd>' + num(resultado.duracionSegundos, 1) + ' s</dd></div>',
    '      <div><dt>Ejecutado</dt><dd>' + fechaLegible(new Date()) + '</dd></div>',
    '    </dl>',
    '  </header>',
    '',
    bloqueCriterios,
    '',
    '  <h2>Tiempos de respuesta</h2>',
    '  <div class="desbordable">',
    tablaDeTiempos(datos),
    '  </div>',
    '',
    '  <h2>Validaciones por petición</h2>',
    '  <table>',
    '    <thead><tr><th scope="col">Validación</th><th scope="col" class="num">Éxitos</th>' +
      '<th scope="col" class="num">Fallas</th><th scope="col" class="num">%</th></tr></thead>',
    '    <tbody>',
    filasValidaciones,
    '    </tbody>',
    '  </table>',
    '',
    '  <h2>Parametrización: peticiones por credencial del CSV</h2>',
    '  <table>',
    '    <thead><tr><th scope="col">Usuario</th><th scope="col" class="num">Peticiones</th>' +
      '<th scope="col">Reparto</th><th scope="col" class="num">%</th></tr></thead>',
    '    <tbody>',
    filasReparto,
    '    </tbody>',
    '    <caption>Reparto round-robin determinista: cada credencial de <code>datos/usuarios.csv</code>',
    '    se usa la misma cantidad de veces.</caption>',
    '  </table>',
    '',
    '  <h2>Umbrales declarados</h2>',
    '  <table>',
    '    <thead><tr><th scope="col">Métrica</th><th scope="col">Condición</th>' +
      '<th scope="col">Resultado</th></tr></thead>',
    '    <tbody>',
    filasUmbrales,
    '    </tbody>',
    '    <caption>Los evalúa k6: si alguno no se cumple, el proceso termina con código de salida 99.</caption>',
    '  </table>',
    '',
    '  <footer>',
    '    Generado por <code>src/lib/reporte.js</code> a partir del resumen de k6, sin dependencias',
    '    externas. Datos crudos en <code>resultados/resumen.json</code> y una fila por petición en',
    '    <code>resultados/metricas-por-peticion.csv.gz</code>.',
    '  </footer>',
    '</main>',
    '</body>',
    '</html>',
    '',
  ].join('\n');
}

// --------------------------- punto de entrada ------------------------------

/**
 * Devuelve el mapa {ruta: contenido} que k6 escribe al terminar la prueba.
 * La clave "stdout" es lo que se imprime en consola.
 */
export function generarReportes(datos, contexto) {
  const resultado = evaluar(datos);
  const texto = reporteDeTexto(datos, contexto, resultado);
  const sufijo = contexto.escenario === 'carga' ? '' : '-' + contexto.escenario;
  const salida = {};

  salida.stdout = '\n' + texto;
  salida[contexto.carpeta + '/resumen' + sufijo + '.txt'] = texto;
  salida[contexto.carpeta + '/resumen' + sufijo + '.json'] = JSON.stringify(datos, null, 2);
  salida[contexto.carpeta + '/reporte-carga-login' + sufijo + '.html'] = reporteHtml(
    datos,
    contexto,
    resultado
  );

  return salida;
}
