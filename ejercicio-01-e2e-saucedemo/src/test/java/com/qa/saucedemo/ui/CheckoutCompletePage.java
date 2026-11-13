package com.qa.saucedemo.ui;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Confirmacion del pedido - Checkout: Complete! (/checkout-complete.html).
 */
public final class CheckoutCompletePage {

    private CheckoutCompletePage() {
        // Clase de locators: no se instancia.
    }

    public static final Target CONTENEDOR_DE_CONFIRMACION = Target.the("contenedor de la confirmacion")
            .located(By.cssSelector("[data-test='checkout-complete-container']"));

    /** Encabezado con el mensaje de agradecimiento del pedido. */
    public static final Target MENSAJE_DE_CONFIRMACION = Target.the("mensaje de confirmacion del pedido")
            .located(By.cssSelector("[data-test='complete-header']"));

    public static final Target DETALLE_DE_CONFIRMACION = Target.the("detalle de la confirmacion")
            .located(By.cssSelector("[data-test='complete-text']"));
}
