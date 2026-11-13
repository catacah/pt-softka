package com.qa.saucedemo.tasks;

import com.qa.saucedemo.ui.InventoryPage;
import com.qa.saucedemo.ui.LoginPage;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.actions.Enter;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Autentica al actor en SauceDemo y espera a que el catalogo este disponible.
 */
public class Login implements Task {

    private final String usuario;
    private final String contrasena;

    public Login(String usuario, String contrasena) {
        this.usuario = usuario;
        this.contrasena = contrasena;
    }

    @Override
    @Step("{0} se autentica con el usuario '#usuario'")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                WaitUntil.the(LoginPage.CAMPO_USUARIO, isVisible()).forNoMoreThan(15).seconds(),
                Enter.theValue(usuario).into(LoginPage.CAMPO_USUARIO),
                Enter.theValue(contrasena).into(LoginPage.CAMPO_CONTRASENA),
                Click.on(LoginPage.BOTON_LOGIN),
                // El catalogo es la evidencia de que la autenticacion fue exitosa.
                WaitUntil.the(InventoryPage.LISTA_DE_PRODUCTOS, isVisible()).forNoMoreThan(15).seconds()
        );
    }

    public static Performable withCredentials(String usuario, String contrasena) {
        return instrumented(Login.class, usuario, contrasena);
    }
}
