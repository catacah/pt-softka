# language: es
@compra @e2e @smoke
Característica: Compra de productos en la tienda SauceDemo

  Como cliente registrado de la tienda SauceDemo
  quiero seleccionar productos del catálogo y pagarlos en línea
  para recibir la confirmación de mi pedido

  Antecedentes:
    Dado que Diego está en la página de inicio de sesión de SauceDemo

  @ejercicio-01
  Escenario: Compra exitosa de dos productos hasta la confirmación del pedido
    Cuando se autentica con el usuario "standard_user" y la contraseña "secret_sauce"
    Y agrega al carrito los siguientes productos:
      | producto              |
      | Sauce Labs Backpack   |
      | Sauce Labs Bike Light |
    Entonces el contador del carrito debería mostrar 2 productos
    Cuando visualiza el carrito de compras
    Entonces el carrito debería contener los productos que agregó
    Cuando completa el formulario de compra con los siguientes datos:
      | nombre | apellido | codigoPostal |
      | Diego  | Franco   | 110111       |
    Y finaliza la compra
    Entonces debería ver el mensaje de confirmación "THANK YOU FOR YOUR ORDER"
