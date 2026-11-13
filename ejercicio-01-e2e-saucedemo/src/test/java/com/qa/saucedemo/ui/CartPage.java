package com.qa.saucedemo.ui;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Carrito de compras (/cart.html).
 */
public final class CartPage {

    private CartPage() {
        // Clase de locators: no se instancia.
    }

    public static final Target CONTENEDOR_DEL_CARRITO = Target.the("contenedor del carrito")
            .located(By.cssSelector("[data-test='cart-contents-container']"));

    public static final Target NOMBRES_DE_PRODUCTOS = Target.the("nombres de los productos del carrito")
            .located(By.cssSelector("[data-test='cart-list'] [data-test='inventory-item-name']"));

    public static final Target PRODUCTOS_EN_EL_CARRITO = Target.the("productos del carrito")
            .located(By.cssSelector("[data-test='cart-list'] [data-test='inventory-item']"));

    public static final Target BOTON_CHECKOUT = Target.the("boton Checkout")
            .located(By.cssSelector("[data-test='checkout']"));
}
