package com.qa.saucedemo.stepdefinitions;

import io.cucumber.java.Before;
import net.serenitybdd.screenplay.actors.OnStage;
import net.serenitybdd.screenplay.actors.OnlineCast;

/**
 * Prepara el "escenario" de Screenplay antes de cada escenario de Cucumber.
 *
 * <p>OnlineCast entrega a cada actor su propia instancia de navegador, administrada
 * por Serenity: no hay que crear ni cerrar WebDrivers manualmente.</p>
 */
public class StageSetup {

    @Before
    public void prepararElEscenario() {
        OnStage.setTheStage(new OnlineCast());
    }
}
