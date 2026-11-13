package com.qa.saucedemo.stepdefinitions;

import com.qa.saucedemo.questions.CartBadgeCount;
import com.qa.saucedemo.questions.CartItemNames;
import com.qa.saucedemo.tasks.AddProductsToCart;
import com.qa.saucedemo.tasks.OpenTheCart;
import io.cucumber.java.es.Cuando;
import io.cucumber.java.es.Entonces;

import java.util.List;
import java.util.Map;

import static net.serenitybdd.screenplay.GivenWhenThen.seeThat;
import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;

/**
 * Pasos de seleccion de productos y visualizacion del carrito.
 *
 * <p>Los productos agregados quedan en el estado de la clase para contrastarlos
 * despues contra el contenido real del carrito, sin repetir los datos en el .feature.
 * Cucumber crea una instancia nueva por escenario, asi que no hay estado compartido
 * entre pruebas.</p>
 */
public class CartStepDefinitions {

    private List<String> productosAgregados;

    @Cuando("agrega al carrito los siguientes productos:")
    public void agregaAlCarritoLosSiguientesProductos(List<Map<String, String>> productos) {
        productosAgregados = productos.stream()
                .map(fila -> fila.get("producto"))
                .toList();

        theActorInTheSpotlight().attemptsTo(AddProductsToCart.theProducts(productosAgregados));
    }

    @Entonces("el contador del carrito debería mostrar {int} productos")
    public void elContadorDelCarritoDeberiaMostrarProductos(int cantidadEsperada) {
        theActorInTheSpotlight().should(
                seeThat("el contador del carrito", CartBadgeCount.displayed(), equalTo(cantidadEsperada))
        );
    }

    @Cuando("visualiza el carrito de compras")
    public void visualizaElCarritoDeCompras() {
        theActorInTheSpotlight().attemptsTo(OpenTheCart.now());
    }

    @Entonces("el carrito debería contener los productos que agregó")
    public void elCarritoDeberiaContenerLosProductosQueAgrego() {
        theActorInTheSpotlight().should(
                seeThat("los productos del carrito", CartItemNames.displayed(),
                        containsInAnyOrder(productosAgregados.toArray(new String[0])))
        );
    }
}
