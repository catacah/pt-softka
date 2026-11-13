package com.qa.saucedemo.tasks;

import com.qa.saucedemo.ui.CheckoutCompletePage;
import com.qa.saucedemo.ui.CheckoutOverviewPage;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Confirma el pedido desde el resumen de la compra.
 */
public class FinishThePurchase implements Task {

    @Override
    @Step("{0} finaliza la compra")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(CheckoutOverviewPage.BOTON_FINALIZAR),
                WaitUntil.the(CheckoutCompletePage.MENSAJE_DE_CONFIRMACION, isVisible())
                        .forNoMoreThan(15).seconds()
        );
    }

    public static Performable now() {
        return instrumented(FinishThePurchase.class);
    }
}
