package com.qa.saucedemo.questions;

import com.qa.saucedemo.ui.CheckoutCompletePage;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Question;
import net.serenitybdd.screenplay.questions.Text;

import java.util.Locale;

/**
 * Mensaje de confirmacion del pedido, normalizado a mayusculas.
 *
 * <p>El enunciado del ejercicio pide verificar "THANK YOU FOR YOUR ORDER", pero el
 * DOM de la aplicacion entrega "Thank you for your order!" (la capitalizacion que se
 * ve en pantalla la aplica la hoja de estilos con text-transform). Normalizar aqui
 * evita que la prueba dependa de una decision de presentacion y deja la asercion
 * del step definition expresada en los mismos terminos del requerimiento.</p>
 */
public class OrderConfirmationMessage implements Question<String> {

    @Override
    public String answeredBy(Actor actor) {
        return Text.of(CheckoutCompletePage.MENSAJE_DE_CONFIRMACION)
                .answeredBy(actor)
                .trim()
                .toUpperCase(Locale.ROOT);
    }

    public static Question<String> displayed() {
        return new OrderConfirmationMessage();
    }
}
