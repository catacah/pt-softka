package com.qa.saucedemo.ui;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Resumen de la compra - Checkout: Overview (/checkout-step-two.html).
 */
public final class CheckoutOverviewPage {

    private CheckoutOverviewPage() {
        // Clase de locators: no se instancia.
    }

    public static final Target RESUMEN_DE_LA_COMPRA = Target.the("resumen de la compra")
            .located(By.cssSelector("[data-test='checkout-summary-container']"));

    public static final Target SUBTOTAL = Target.the("subtotal del pedido")
            .located(By.cssSelector("[data-test='subtotal-label']"));

    public static final Target IMPUESTO = Target.the("impuesto del pedido")
            .located(By.cssSelector("[data-test='tax-label']"));

    public static final Target TOTAL = Target.the("total del pedido")
            .located(By.cssSelector("[data-test='total-label']"));

    public static final Target BOTON_FINALIZAR = Target.the("boton Finish")
            .located(By.cssSelector("[data-test='finish']"));
}
