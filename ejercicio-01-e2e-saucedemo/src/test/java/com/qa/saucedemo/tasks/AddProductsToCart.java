package com.qa.saucedemo.tasks;

import com.qa.saucedemo.ui.InventoryPage;
import net.serenitybdd.annotations.Step;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Performable;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.actions.Click;
import net.serenitybdd.screenplay.waits.WaitUntil;

import java.util.List;

import static net.serenitybdd.screenplay.Tasks.instrumented;
import static net.serenitybdd.screenplay.matchers.WebElementStateMatchers.isVisible;

/**
 * Agrega al carrito uno o varios productos, identificandolos por su nombre visible.
 */
public class AddProductsToCart implements Task {

    private final List<String> productos;

    public AddProductsToCart(List<String> productos) {
        this.productos = productos;
    }

    @Override
    @Step("{0} agrega al carrito los productos #productos")
    public <T extends Actor> void performAs(T actor) {
        productos.forEach(producto -> actor.attemptsTo(
                WaitUntil.the(InventoryPage.BOTON_AGREGAR_AL_CARRITO.of(producto), isVisible())
                        .forNoMoreThan(10).seconds(),
                Click.on(InventoryPage.BOTON_AGREGAR_AL_CARRITO.of(producto))
        ));
    }

    public static Performable theProducts(List<String> productos) {
        return instrumented(AddProductsToCart.class, productos);
    }
}
