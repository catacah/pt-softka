package com.qa.saucedemo.stepdefinitions;

import com.qa.saucedemo.questions.OrderConfirmationMessage;
import com.qa.saucedemo.tasks.CompleteTheCheckoutForm;
import com.qa.saucedemo.tasks.FinishThePurchase;
import com.qa.saucedemo.tasks.ProceedToCheckout;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Entonces;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
import static org.hamcrest.Matchers.containsString;

/**
 * Pasos del formulario de compra y de la confirmacion del pedido.
 */
public class CheckoutStepDefinitions {

    @Cuando("completa el formulario de compra con los siguientes datos:")
    public void completaElFormularioDeCompraConLosSiguientesDatos(List<Map<String, String>> datos) {
        Map<String, String> comprador = datos.get(0);

        theActorInTheSpotlight().attemptsTo(
                ProceedToCheckout.now(),
                CompleteTheCheckoutForm.with(
                        comprador.get("nombre"),
                        comprador.get("apellido"),
                        comprador.get("codigoPostal")
                )
        );
    }

    @Cuando("finaliza la compra")
    public void finalizaLaCompra() {
        theActorInTheSpotlight().attemptsTo(FinishThePurchase.now());
    }

    @Entonces("debería ver el mensaje de confirmación {string}")
    public void deberiaVerElMensajeDeConfirmacion(String mensajeEsperado) {
        theActorInTheSpotlight().should(
                seeThat("el mensaje de confirmación del pedido",
                        OrderConfirmationMessage.displayed(),
                        containsString(mensajeEsperado.toUpperCase(Locale.ROOT)))
        );
    }
}
