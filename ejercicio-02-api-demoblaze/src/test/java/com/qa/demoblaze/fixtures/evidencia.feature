# Fixture (captura de evidencia), no es un caso de prueba: por eso esta marcado
# con @ignore y vive fuera de la carpeta features.
#
# Escribe en target/evidencias/<caso>.json la ENTRADA enviada y la SALIDA recibida,
# que es lo que el enunciado pide identificar y capturar.

@ignore
Feature: Evidencia - capturar la entrada y la salida de un caso

  Scenario: Guardar la evidencia del caso en target/evidencias
    * def Evidencia = Java.type('com.qa.demoblaze.utils.Evidencia')
    * def Codificador = Java.type('com.qa.demoblaze.utils.Codificador')

    * def evidencia =
      """
      {
        "caso": "#(caso)",
        "descripcion": "#(descripcion)",
        "ejecutado": "#(Codificador.marcaDeTiempo())",
        "resultadoEsperado": "#(resultadoEsperado)",
        "observaciones": "#(karate.get('observaciones', '-'))",
        "entrada": {
          "metodo": "POST",
          "url": "#(urlBase + servicio)",
          "cabeceras": { "Content-Type": "application/json" },
          "cuerpo": #(entrada),
          "passwordEnClaro": "#(passwordPlano)"
        },
        "salida": {
          "statusHttp": #(statusHttp),
          "cabeceras": #(cabecerasSalida),
          "cuerpo": #(cuerpoSalida),
          "tiempoRespuestaMs": #(tiempoRespuestaMs)
        }
      }
      """
    * def rutaArchivo = Evidencia.guardar(caso + '.json', karate.pretty(evidencia))
    * print 'Evidencia de', caso, 'escrita en', rutaArchivo
