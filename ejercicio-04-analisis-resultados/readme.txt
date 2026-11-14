================================================================================
 EJERCICIO 4 - ANALISIS DE RESULTADOS DE UNA PRUEBA DE CARGA
 Informe sobre una ejecucion de 140 usuarios virtuales durante 63 minutos
================================================================================

Repositorio : https://github.com/catacah/pt-softka
Entregable  : InformeResultados.doc (y las mismas paginas en .docx y .md)
Elaborado el 14/11/2026 sobre una prueba ejecutada el 24/04/2025.


--------------------------------------------------------------------------------
1. QUE ES ESTE EJERCICIO
--------------------------------------------------------------------------------

A diferencia de los tres anteriores, aqui no se automatiza ni se ejecuta nada:
el enunciado entrega los resultados de una prueba de carga ya realizada y pide
analizarlos.

Lo que se entrega, segun el enunciado:

    "Un archivo InformeResultados.doc con los hallazgos, conclusiones y
     recomendaciones de la prueba realizada, incluyendo datos relevantes del
     diagrama obtenido de la relacion entre los usuarios virtuales y el numero
     de peticiones por segundo."

Resultado del analisis, en una linea: la prueba no deberia darse por aprobada.
El servicio sufrio una degradacion de unos 9 minutos -el rendimiento cayo un
85 % sin que la carga cambiara- y las metricas agregadas la esconden casi por
completo.


--------------------------------------------------------------------------------
2. DE DONDE SALEN LOS DATOS
--------------------------------------------------------------------------------

El enunciado entrega dos insumos, los dos como imagenes dentro del documento
Word del enunciado:

  [1] textSummary.txt
      El resumen que imprime k6 al terminar una ejecucion: 276.650 peticiones,
      73,176857/s, 140 usuarios virtuales, 2,44 % de error, percentiles de
      tiempo de respuesta y cuatro contadores de error por etapa y codigo HTTP.
      Esta transcrito integro en el Anexo A del informe, para que se pueda
      verificar cada cifra sin depender de la imagen.

  [2] El diagrama de monitoreo
      Grafica de Grafana con dos series -usuarios virtuales y peticiones por
      segundo- a lo largo de la hora que duro la prueba. Es el archivo
      imagenes/diagrama-vus-vs-peticiones.png, extraido del documento original
      sin modificarlo, y va embebido en la seccion 4.4 del informe.

No se tuvo acceso al script de la prueba, a los registros del servicio ni a
metricas de infraestructura. El alcance y los supuestos del analisis estan
declarados en el Anexo C del informe.

Todo dato que no aparece literalmente en esos dos insumos esta calculado, y el
Anexo B lista el calculo de cada uno junto con la comprobacion por un segundo
camino independiente. Por ejemplo, la duracion de la prueba no figura en el
resumen: se deduce de 276.650 / 73,176857 = 3.780,6 s, y se confirma con las
tasas de los contadores de error, con el ancho de banda y con el eje del
diagrama.


--------------------------------------------------------------------------------
3. QUE HAY EN ESTA CARPETA
--------------------------------------------------------------------------------

  ejercicio-04-analisis-resultados/
  |
  |-- InformeResultados.doc ..... EL ENTREGABLE, en el formato que pide el
  |                               enunciado (Word 97-2003)
  |-- InformeResultados.docx .... el mismo informe en formato Word actual
  |-- InformeResultados.md ...... el mismo informe en texto, legible desde el
  |                               navegador en GitHub, sin descargar nada
  |-- readme.txt ................ este archivo
  |
  |-- imagenes/
      |-- diagrama-vus-vs-peticiones.png    el diagrama del enunciado, que el
                                            informe embebe en la seccion 4.4

  Los tres informes tienen exactamente el mismo contenido: 9 paginas, 4.278
  palabras, 5 tablas y el diagrama. Se produjeron en cadena desde un unico
  origen -el .md-, de modo que no pueden decir cosas distintas.

  Por que hay tres formatos
  --------------------------
  El enunciado pide un ".doc", que es el formato binario de Word 97-2003. Se
  entrega exactamente eso. Se acompana del .docx porque es el formato vigente
  desde 2007 (y el que conviene si el revisor abre el archivo con LibreOffice o
  Google Docs), y del .md porque GitHub no previsualiza ni .doc ni .docx: con el
  .md el informe se lee directamente desde el repositorio, de un clic, con el
  diagrama incluido.


--------------------------------------------------------------------------------
4. COMO LEERLO
--------------------------------------------------------------------------------

  Desde GitHub, sin descargar nada
  ---------------------------------
      Abrir InformeResultados.md en el navegador.

  Descargando el entregable
  --------------------------
      Abrir InformeResultados.doc con Microsoft Word, LibreOffice Writer o
      Google Docs. No requiere macros, fuentes especiales ni complementos.

  Por donde empezar
  ------------------
      Seccion 2 (Resumen ejecutivo) ..... el veredicto y por que, en media pagina
      Seccion 4.4 (El diagrama) ......... lo que pide expresamente el enunciado
      Seccion 5 (Hallazgos) ............. los 9 hallazgos con su severidad
      Seccion 7 (Recomendaciones) ....... 11 acciones, agrupadas y priorizadas
      Anexos A, B y C ................... los datos de origen, el calculo de
                                          cada cifra derivada y los supuestos


--------------------------------------------------------------------------------
5. INDICE DEL INFORME
--------------------------------------------------------------------------------

  1. Ficha de la prueba
  2. Resumen ejecutivo
  3. Que se ejecuto, segun lo que dicen los propios datos
  4. Analisis de los resultados
     4.1 Volumen y rendimiento
     4.2 Tiempos de respuesta
     4.3 Errores
     4.4 El diagrama de usuarios virtuales frente a peticiones por segundo
  5. Hallazgos (9, con severidad y evidencia)
  6. Conclusiones
  7. Recomendaciones (servicio y plataforma / criterios de aceptacion /
     diseno e instrumentacion de las pruebas)
  8. Anexos
     A. textSummary.txt transcrito integro
     B. Como se obtuvo cada dato derivado
     C. Alcance y supuestos del analisis


--------------------------------------------------------------------------------
6. VERSIONES Y HERRAMIENTAS UTILIZADAS
--------------------------------------------------------------------------------

  Para leer el informe NO hace falta instalar nada: basta un procesador de
  texto, o el navegador si se lee el .md.

  Herramientas con las que se produjo el entregable:

  Python ........................ 3.13.0
  python-docx ................... 1.2.0   (genera el .docx a partir del .md)
  Microsoft Word ................ 16.0    (exporta el .doc en formato 97-2003)
  Sistema operativo ............. Windows 11 Home 10.0.26300

  Prueba analizada (no se ejecuto en este ejercicio):
  Herramienta de la ejecucion ... k6 (formato del textSummary)
  Monitoreo ..................... Grafana
  Fecha de la ejecucion ......... 24/04/2025, de 01:35 a 02:38 aprox.


--------------------------------------------------------------------------------
7. NOTA SOBRE EL EJERCICIO 1 DEL MISMO ENUNCIADO
--------------------------------------------------------------------------------

El documento del enunciado contiene dos ejercicios. El primero -la prueba de
carga del servicio de login con el CURL de fakestoreapi.com, 20 TPS, tiempo de
respuesta maximo de 1,5 s y error menor al 3 %- esta resuelto en la carpeta
ejercicio-03-carga-fakestore de este mismo repositorio.

El CURL del documento incluye "--max-time 60", que coincide con el tiempo de
espera por defecto de k6, de modo que el script del ejercicio 3 ya replica ese
comportamiento.
