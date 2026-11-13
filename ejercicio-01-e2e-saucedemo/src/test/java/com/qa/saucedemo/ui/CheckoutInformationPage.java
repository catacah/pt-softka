package com.qa.saucedemo.ui;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Formulario de compra - Checkout: Your Information (/checkout-step-one.html).
 */
public final class CheckoutInformationPage {

    private CheckoutInformationPage() {
        // Clase de locators: no se instancia.
    }

    public static final Target FORMULARIO = Target.the("formulario de compra")
            .located(By.cssSelector("[data-test='checkout-info-container']"));

    public static final Target CAMPO_NOMBRE = Target.the("campo First Name")
            .located(By.cssSelector("[data-test='firstName']"));

    public static final Target CAMPO_APELLIDO = Target.the("campo Last Name")
            .located(By.cssSelector("[data-test='lastName']"));

    public static final Target CAMPO_CODIGO_POSTAL = Target.the("campo Zip/Postal Code")
            .located(By.cssSelector("[data-test='postalCode']"));

    public static final Target BOTON_CONTINUAR = Target.the("boton Continue")
            .located(By.cssSelector("[data-test='continue']"));
}
