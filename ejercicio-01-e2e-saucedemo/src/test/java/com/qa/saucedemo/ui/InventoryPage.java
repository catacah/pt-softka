package com.qa.saucedemo.ui;

import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Catalogo de productos (pantalla posterior al login).
 */
public final class InventoryPage {

    private InventoryPage() {
        // Clase de locators: no se instancia.
    }

    public static final Target TITULO_DE_LA_PAGINA = Target.the("titulo de la pagina")
            .located(By.cssSelector("[data-test='title']"));

    public static final Target LISTA_DE_PRODUCTOS = Target.the("lista de productos")
            .located(By.cssSelector("[data-test='inventory-list']"));

    /**
     * Boton "Add to cart" del producto indicado.
     *
     * <p>Se localiza por el nombre visible del producto y no por el atributo
     * {@code data-test="add-to-cart-<slug>"}: ese slug se genera en tiempo de
     * ejecucion a partir del nombre del producto, por lo que un cambio de nombre
     * o de la regla de normalizacion rompe el localizador. Bajar al contenedor
     * del producto y desde ahi al boton mantiene la prueba estable.</p>
     */
    public static final Target BOTON_AGREGAR_AL_CARRITO = Target.the("boton Add to cart del producto {0}")
            .locatedBy("//div[@data-test='inventory-item']"
                    + "[.//*[@data-test='inventory-item-name' and normalize-space()='{0}']]"
                    + "//button[starts-with(@data-test,'add-to-cart')]");

    public static final Target CONTADOR_DEL_CARRITO = Target.the("contador de productos del carrito")
            .located(By.cssSelector("[data-test='shopping-cart-badge']"));

    public static final Target ENLACE_DEL_CARRITO = Target.the("enlace del carrito de compras")
            .located(By.cssSelector("[data-test='shopping-cart-link']"));
}
