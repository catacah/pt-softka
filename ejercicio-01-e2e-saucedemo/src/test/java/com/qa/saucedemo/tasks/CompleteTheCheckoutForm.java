package com.qa.saucedemo.tasks;

import com.qa.saucedemo.ui.CheckoutInformationPage;
import com.qa.saucedemo.ui.CheckoutOverviewPage;
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
 * Diligencia el formulario de compra (nombre, apellido y codigo postal) y avanza
 * al resumen del pedido.
 */
public class CompleteTheCheckoutForm implements Task {

    private final String nombre;
    private final String apellido;
    private final String codigoPostal;

    public CompleteTheCheckoutForm(String nombre, String apellido, String codigoPostal) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.codigoPostal = codigoPostal;
    }

    @Override
    @Step("{0} completa el formulario de compra con '#nombre #apellido' y codigo postal '#codigoPostal'")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Enter.theValue(nombre).into(CheckoutInformationPage.CAMPO_NOMBRE),
                Enter.theValue(apellido).into(CheckoutInformationPage.CAMPO_APELLIDO),
                Enter.theValue(codigoPostal).into(CheckoutInformationPage.CAMPO_CODIGO_POSTAL),
                Click.on(CheckoutInformationPage.BOTON_CONTINUAR),
                WaitUntil.the(CheckoutOverviewPage.RESUMEN_DE_LA_COMPRA, isVisible())
                        .forNoMoreThan(10).seconds()
        );
    }

    public static Performable with(String nombre, String apellido, String codigoPostal) {
        return instrumented(CompleteTheCheckoutForm.class, nombre, apellido, codigoPostal);
    }
}
