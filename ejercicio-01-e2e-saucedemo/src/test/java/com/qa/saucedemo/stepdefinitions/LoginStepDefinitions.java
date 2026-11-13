package com.qa.saucedemo.stepdefinitions;

import com.qa.saucedemo.navigation.NavigateTo;
import com.qa.saucedemo.tasks.Login;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Dado;

import static net.serenitybdd.screenplay.actors.OnStage.theActorCalled;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

/**
 * Pasos de navegacion inicial y autenticacion.
 */
public class LoginStepDefinitions {

    @Dado("que {word} está en la página de inicio de sesión de SauceDemo")
    public void queElActorEstaEnLaPaginaDeInicioDeSesion(String actor) {
        theActorCalled(actor).attemptsTo(NavigateTo.theLoginPage());
    }

    @Cuando("se autentica con el usuario {string} y la contraseña {string}")
    public void seAutenticaConElUsuarioYLaContrasena(String usuario, String contrasena) {
        theActorInTheSpotlight().attemptsTo(Login.withCredentials(usuario, contrasena));
    }
}
