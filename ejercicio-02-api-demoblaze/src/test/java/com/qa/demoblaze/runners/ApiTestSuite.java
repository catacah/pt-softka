package com.qa.demoblaze.runners;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

/**
 * Punto de entrada de la suite: ejecuta todos los features de
 * {@code com/qa/demoblaze/features} y falla si algun caso no pasa.
 *
 * <p>Se ejecuta con un solo hilo a proposito: son cuatro casos y dos de ellos
 * (CP01 y CP02) forman una cadena intencional -crear el usuario y luego intentar
 * crearlo otra vez-, por lo que el determinismo vale mas que el paralelismo.</p>
 *
 * <p>Filtrar casos:  mvnw test -Dkarate.tags="@CP01"</p>
 */
class ApiTestSuite {

    @Test
    void ejecutarCasosDePrueba() {
        String etiquetas = System.getProperty("karate.tags", "");

        Runner.Builder<?> ejecucion = Runner.path("classpath:com/qa/demoblaze/features")
                .outputCucumberJson(true);

        if (etiquetas != null && !etiquetas.isBlank()) {
            ejecucion = ejecucion.tags(etiquetas);
        }

        Results resultados = ejecucion.parallel(1);

        assertEquals(0, resultados.getFailCount(), resultados.getErrorMessages());
    }
}
