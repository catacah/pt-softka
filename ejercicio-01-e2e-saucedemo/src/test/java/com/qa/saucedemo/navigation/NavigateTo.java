package com.qa.saucedemo.navigation;

import com.qa.saucedemo.ui.LoginPage;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Open;

import static net.serenitybdd.screenplay.Tasks.instrumented;

/**
 * Tareas de navegacion directa por URL.
 */
public class NavigateTo implements Task {

    @Override
    @Step("{0} abre la pagina de inicio de sesion de SauceDemo")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(Open.browserOn().the(LoginPage.class));
    }

    public static Performable theLoginPage() {
        return instrumented(NavigateTo.class);
    }
}
