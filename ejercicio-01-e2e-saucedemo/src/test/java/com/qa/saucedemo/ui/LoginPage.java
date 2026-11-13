package com.qa.saucedemo.ui;

import net.serenitybdd.annotations.DefaultUrl;
import net.serenitybdd.core.pages.PageObject;
import net.serenitybdd.screenplay.targets.Target;
import org.openqa.selenium.By;

/**
 * Pagina de inicio de sesion.
 *
 * <p>Es la unica clase que extiende PageObject, porque Screenplay la necesita para
 * resolver la URL inicial del navegador ({@code Open.browserOn()}). La URL puede
 * sobreescribirse con {@code -Dwebdriver.base.url=...}.</p>
 */
@DefaultUrl("https://www.saucedemo.com/")
public class LoginPage extends PageObject {

    public static final Target CAMPO_USUARIO = Target.the("campo Username")
            .located(By.cssSelector("[data-test='username']"));

    public static final Target CAMPO_CONTRASENA = Target.the("campo Password")
            .located(By.cssSelector("[data-test='password']"));

    public static final Target BOTON_LOGIN = Target.the("boton Login")
            .located(By.cssSelector("[data-test='login-button']"));

    public static final Target MENSAJE_DE_ERROR = Target.the("mensaje de error del login")
            .located(By.cssSelector("[data-test='error']"));
}
