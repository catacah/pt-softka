package com.qa.saucedemo.questions;

import com.qa.saucedemo.ui.CartPage;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

import java.util.List;

/**
 * Nombres de los productos listados en el carrito de compras.
 */
public class CartItemNames implements Question<List<String>> {

    @Override
    public List<String> answeredBy(Actor actor) {
        return Text.ofEach(CartPage.NOMBRES_DE_PRODUCTOS)
                .answeredBy(actor)
                .stream()
                .map(String::trim)
                .toList();
    }

    public static Question<List<String>> displayed() {
        return new CartItemNames();
    }
}
