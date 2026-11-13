package com.qa.saucedemo.runners;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectPackages;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;

/**
 * Punto de entrada de la ejecucion.
 *
 * <p>Maven Failsafe detecta esta clase por el sufijo *TestSuite y delega en el motor
 * de Cucumber del JUnit Platform. El plugin SerenityReporterParallel es el que alimenta
 * el reporte HTML de Serenity con los resultados y las capturas de pantalla.</p>
 */
@Suite
@IncludeEngines("cucumber")
@SelectPackages("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.qa.saucedemo.stepdefinitions")
@ConfigurationParameter(
        key = PLUGIN_PROPERTY_NAME,
        value = "net.serenitybdd.cucumber.core.plugin.SerenityReporterParallel,pretty"
)
public class CucumberTestSuite {
}
