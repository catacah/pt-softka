package com.qa.saucedemo.questions;

import com.qa.saucedemo.ui.InventoryPage;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

/**
 * Cantidad de productos que muestra el contador del icono del carrito.
 * Devuelve 0 cuando el contador no se esta mostrando (carrito vacio).
 */
public class CartBadgeCount implements Question<Integer> {

    @Override
    public Integer answeredBy(Actor actor) {
        if (!InventoryPage.CONTADOR_DEL_CARRITO.resolveFor(actor).isCurrentlyVisible()) {
            return 0;
        }
        String contador = Text.of(InventoryPage.CONTADOR_DEL_CARRITO).answeredBy(actor).trim();
        return contador.isEmpty() ? 0 : Integer.parseInt(contador);
    }

    public static Question<Integer> displayed() {
        return new CartBadgeCount();
    }
}
