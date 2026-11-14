package com.qa.demoblaze.utils;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Escribe en {@code target/evidencias/} un archivo por caso de prueba con la entrada
 * enviada y la salida recibida. El enunciado pide identificar las entradas y capturar
 * las salidas: estos archivos son esa captura, independiente del reporte HTML.
 */
public final class Evidencia {

    private static final Path CARPETA = Paths.get("target", "evidencias");

    private Evidencia() {
    }

    public static String guardar(String nombreArchivo, String contenido) {
        try {
            Files.createDirectories(CARPETA);
            Path archivo = CARPETA.resolve(nombreArchivo);
            Files.writeString(archivo, contenido, StandardCharsets.UTF_8);
            return archivo.toAbsolutePath().toString();
        } catch (IOException error) {
            throw new UncheckedIOException(
                    "No se pudo escribir la evidencia " + nombreArchivo, error);
        }
    }
}
