package com.qa.saucedemo.tasks;

import com.qa.saucedemo.ui.CartPage;
import com.qa.saucedemo.ui.InventoryPage;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Abre el carrito de compras desde el icono del encabezado.
 */
public class OpenTheCart implements Task {

    @Override
    @Step("{0} visualiza el carrito de compras")
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
                Click.on(InventoryPage.ENLACE_DEL_CARRITO),
                WaitUntil.the(CartPage.CONTENEDOR_DEL_CARRITO, isVisible()).forNoMoreThan(10).seconds()
        );
    }

    public static Performable now() {
        return instrumented(OpenTheCart.class);
    }
}
