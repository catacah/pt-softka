package com.qa.saucedemo.tasks;

import com.qa.saucedemo.ui.CartPage;
import com.qa.saucedemo.ui.CheckoutInformationPage;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Avanza del carrito al formulario de compra.
 */
public class ProceedToCheckout implements Task {

    @Override
    @Step("{0} inicia el proceso de compra desde el carrito")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(CartPage.BOTON_CHECKOUT),
                WaitUntil.the(CheckoutInformationPage.FORMULARIO, isVisible()).forNoMoreThan(10).seconds()
        );
    }

    public static Performable now() {
        return instrumented(ProceedToCheckout.class);
    }
}
