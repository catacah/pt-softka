package com.qa.demoblaze.utils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * Utilidades de datos de prueba.
 *
 * <p>Los servicios de Demoblaze NO reciben el password en claro: el front
 * (funcion {@code b64EncodeUnicode} de /js/index.js) lo codifica en Base64 antes de
 * enviarlo. Esta clase replica esa codificacion para que las pruebas usen exactamente
 * la misma entrada que la aplicacion real.</p>
 */
public final class Codificador {

    private static final DateTimeFormatter MARCA_USUARIO =
            DateTimeFormatter.ofPattern("yyyyMMdd.HHmmssSSS");

    private Codificador() {
    }

    /** Codifica en Base64, igual que el front de Demoblaze. */
    public static String aBase64(String texto) {
        return Base64.getEncoder().encodeToString(texto.getBytes(StandardCharsets.UTF_8));
    }

    /** Decodifica Base64. Se usa para evidenciar que la codificacion es reversible. */
    public static String desdeBase64(String codificado) {
        return new String(Base64.getDecoder().decode(codificado), StandardCharsets.UTF_8);
    }

    /**
     * Genera un usuario distinto en cada ejecucion. Es necesario porque la API no
     * expone ningun servicio para eliminar usuarios: sin un nombre nuevo, el caso
     * "crear un nuevo usuario" solo podria pasar la primera vez.
     */
    public static String usuarioUnico(String prefijo) {
        return prefijo + "." + LocalDateTime.now().format(MARCA_USUARIO);
    }

    /** Marca de tiempo legible para la evidencia. */
    public static String marcaDeTiempo() {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    }
}
