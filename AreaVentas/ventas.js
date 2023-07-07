// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDrzCRyT3S-SY7Vvh58jkPtstVSLMvsStQ",
  authDomain: "gestorinventarios-e37f6.firebaseapp.com",
  databaseURL: "https://gestorinventarios-e37f6-default-rtdb.firebaseio.com",
  projectId: "gestorinventarios-e37f6",
  storageBucket: "gestorinventarios-e37f6.appspot.com",
  messagingSenderId: "968579423727",
  appId: "1:968579423727:web:04d75d7fda53cfd8086a1a",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Obtiene las referencias a los servicios de autenticación y base de datos de Firebase
var auth = firebase.auth();
var database = firebase.database();
var uid = localStorage.getItem("uid");

// Función para mostrar el popup de clientes
function mostrarPopupClientes() {
  $("#popup-clientes").modal("show");
}
// Función para mostrar el popup de productos
function mostrarPopupProductos() {
  $("#popup-productos").modal("show");
}

// Variable para almacenar la fila seleccionada de clientes
var filaSeleccionadaClientes = null;
// Variable para almacenar la fila seleccionada de productos
var filaSeleccionadaProductos = null;
// Variable para almacenar el precio del producto seleccionado
var precioProductoSeleccionado = 0;
// Variable para almacenar el valor total de la venta
var totalVenta = 0;

var filaSeleccionadaTablaPrincipal = null;

document.addEventListener("DOMContentLoaded", function () {
  //==============PARTE CLIENTES==============
  // CLICK BUSCAR CLIENTES
  $("#btn-buscarclientes").on("click", function () {
    buscarClientes();
  });
  seleccionarFilaClientes();
  // CLICK AGREGAR CLIENTES
  $("#btnAgregarClientes").on("click", function () {
    agregarCliente();
  });

  // CLICK CANCELAR CLIENTES
  $("#btnCancelarClientes").on("click", function () {
    cancelarBusquedaClientes();
  });

  //==========PARTE PRODUCTOS==============
  // CLICK BUSCAR CLIENTES
  $("#btn-buscarproductos").on("click", function () {
    buscarProducto();
  });
  seleccionarFilaProducto();
  // CLICK AGREGAR CLIENTES
  $("#btnInsertarProducto").on("click", function () {
    agregarProducto();
  });
  // CLICK CANCELAR CLIENTES
  $("#btnCancelarProducto").on("click", function () {
    cancelarBusquedaProductos();
  });

  // CALCULAR SUBTOTAL EN EL POPUP
  $("#cantidadInput").on("change", function () {
    calcularSubtotal();
  });

  //===========================BOTONES==========================
  seleccionarProductoTabla();
  seleccionarInputCliente();

  // Evento para el botón de eliminar
  $("#btn-eliminarventa").on("click", function () {
    if (filaSeleccionadaTablaPrincipal) {
      // Se ha seleccionado una fila en la tabla principal
      $(filaSeleccionadaTablaPrincipal).remove();
      filaSeleccionadaTablaPrincipal = null;
      calcularTotalVenta();
    } else {
      if ($("#validationCustom06").val().trim() !== "") {
        $("#validationCustom04").val("");
        $("#validationCustom05").val("");
        $("#validationCustom06").val("");
        $("#validationCustom07").val("");
      } else {
        // ALERTA NO HAY CLIENTE SELECCIONADO
        alert("No se ha seleccionado ningún cliente o fila.");
      }
    }
  });

  // BOTON CANCELAR VENTA
  $("#btn-cancelarventa").on("click", function () {
    $("#validationCustom01").val("");
    $("#validationCustom02").val("");
    $("#validationCustom03").val("");
    $("#validationCustom04").val("");
    $("#validationCustom05").val("");
    $("#validationCustom06").val("");
    $("#validationCustom07").val("");
    $("#validationCustom08").val("");
    // Limpiar la tabla de resultados de productos
    $("#tbody_productos").empty();

    totalVenta = 0;
    filaSeleccionadaProductos = null;
  });

  $("#btn-registrarventa").on("click", function () {
    guardarVenta();
  });
});

//====================== FUNCIONES CLIENTE ======================
// FUNCION PARA BUSCAR CLIENTES
function buscarClientes() {
  var criterioBusqueda = $("#validationCustom01").val();

  // Verificar si el campo de búsqueda está vacío
  if (!criterioBusqueda || criterioBusqueda.trim() === "") {
    alert("Ingresa un criterio de búsqueda");
    return;
  } else {
    criterioBusqueda = criterioBusqueda.toLowerCase(); // Convertir a minúsculas

    var clientesRef = database.ref("Usuarios/" + uid + "/Clientes");
    clientesRef.once("value", function (snapshot) {
      var clientesEncontrados = [];
      $("#tbody_resultadosclientes").empty(); // Vaciar solo el cuerpo de la tabla
      snapshot.forEach(function (childSnapshot) {
        var cliente = childSnapshot.val();

        if (
          cliente.Nombre.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          cliente.Apellido.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          cliente.DNI.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          cliente.Telefono.toLowerCase().indexOf(criterioBusqueda) !== -1
        ) {
          clientesEncontrados.push(cliente);
          mostrarResultadoCliente(
            cliente,
            childSnapshot.key,
            clientesEncontrados.length
          );
        }
      });

      if (clientesEncontrados.length > 0) {
        console.log("Clientes encontrados:", clientesEncontrados);
        // Mostrar el popup de clientes
        mostrarPopupClientes();
      } else {
        alert("No se encontró ningún cliente con el dato ingresado");
      }
    });
  }
}

// FUNCION PARA MOSTRAR LOS RESULTADOS DE CLIENTES EN LA TABLA
function mostrarResultadoCliente(cliente, key, numeroFila) {
  var row = $("<tr>");
  row.attr("data-key", key);
  row.addClass("selectable-row"); // Agregar la clase selectable-row

  var cellNumero = $("<td>").text(numeroFila);
  var cellNombre = $("<td>").text(cliente.Nombre);
  var cellApellido = $("<td>").text(cliente.Apellido);
  var cellDNI = $("<td>").text(cliente.DNI);
  var cellTelefono = $("<td>").text(cliente.Telefono);

  row.append(cellNumero, cellNombre, cellApellido, cellDNI, cellTelefono);
  $("#tablaResultadosClientes").append(row);
}

// FUNCION PARA SELECCIONAR UNA FILA
function seleccionarFilaClientes() {
  // Evento de clic en una fila
  $("#tablaResultadosClientes").on("click", "tr.selectable-row", function () {
    // Desmarca todas las filas previamente seleccionadas
    $("tr.selectable-row.selected").removeClass("selected");

    // Marca la fila actual como seleccionada
    $(this).addClass("selected");

    // Cambia el color de fondo de la fila seleccionada
    $(this).css("--bs-table-bg", "#e1dfff");

    // Restablece el color de fondo de las demás filas
    $("tr.selectable-row").not(this).css("--bs-table-bg", "");

    // Almacena la fila seleccionada
    filaSeleccionadaClientes = this;

    // Obtener los datos de la fila seleccionada
    var nombre = $(this).find("td:nth-child(2)").text();
    var apellido = $(this).find("td:nth-child(3)").text();
    var dni = $(this).find("td:nth-child(4)").text();
    var telefono = $(this).find("td:nth-child(5)").text();

    // Cargar los datos en el formulario
    $("#validationCustom04").val(nombre);
    $("#validationCustom05").val(apellido);
    $("#validationCustom06").val(dni);
    $("#validationCustom07").val(telefono);
  });
}

// Evento clic para mostrar el popup de clientes cuando se hace clic en el botón de agregar clientes
function agregarCliente() {
  if (filaSeleccionadaClientes) {
    // Obtener los datos de la fila seleccionada
    var nombre = $(filaSeleccionadaClientes).find("td:nth-child(2)").text();
    var apellido = $(filaSeleccionadaClientes).find("td:nth-child(3)").text();
    var dni = $(filaSeleccionadaClientes).find("td:nth-child(4)").text();
    var telefono = $(filaSeleccionadaClientes).find("td:nth-child(5)").text();

    // Cargar los datos en los campos correspondientes
    $("#validationCustom04").val(nombre);
    $("#validationCustom05").val(apellido);
    $("#validationCustom06").val(dni);
    $("#validationCustom07").val(telefono);

    // Cerrar el popup de clientes
    $("#popup-clientes").modal("hide");
  } else {
    alert("Selecciona un cliente de la tabla antes de agregarlo.");
  }
}

// FUNCION PARA CANCELAR LA BUSQUEDA DE CLIENTES
function cancelarBusquedaClientes() {
  // Borrar el contenido del campo de búsqueda
  $("#validationCustom01").val("");

  // Limpiar la tabla de resultados
  $("#tbody_resultadosclientes").empty();
  filaSeleccionadaClientes = null; // Restablecer la fila seleccionada

  // Cerrar el popup de clientes
  $("#popup-clientes").modal("hide");
}
//====================== FUNCIONES PRODUCTOS ======================
// FUNCION PARA BUSCAR PRODUCTOS
function buscarProducto() {
  var criterioBusqueda = $("#validationCustom02").val().toLowerCase();

  // Verificar si el campo de búsqueda está vacío
  if (criterioBusqueda.trim() === "") {
    alert("Ingresa un criterio de búsqueda");
    return;
  } else {
    var uid = localStorage.getItem("uid");
    var productosRef = database.ref("Usuarios/" + uid + "/Productos");
    productosRef.once("value", function (snapshot) {
      var productosEncontrados = [];
      $("#tbody_resultadosproductos").empty(); // Vaciar solo el cuerpo de la tabla
      snapshot.forEach(function (childSnapshot) {
        var producto = childSnapshot.val();

        if (
          producto.Descripcion.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          producto.codigoProducto.toLowerCase().indexOf(criterioBusqueda) !==
            -1 ||
          producto.Stock.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          producto.Precio.toLowerCase().indexOf(criterioBusqueda) !== -1
        ) {
          productosEncontrados.push(producto);
          mostrarResultadoProducto(
            producto,
            childSnapshot.key,
            productosEncontrados.length
          );
        }
      });

      if (productosEncontrados.length > 0) {
        console.log("Productos encontrados:", productosEncontrados);
        mostrarPopupProductos();
      } else {
        alert("No se encontró ningún producto con el dato ingresado");
      }
    });
  }
}
// Función para mostrar los resultados de productos en la tabla
function mostrarResultadoProducto(producto, key, numeroFila) {
  var row = $("<tr>");
  row.attr("data-key", key);
  row.addClass("selectable-row");

  var cellNumero = $("<td>").text(numeroFila);
  var cellCodigoProducto = $("<td>").text(producto.codigoProducto);
  var cellDescripcion = $("<td>").text(producto.Descripcion);
  var cellStock = $("<td>").text(producto.Stock);
  var cellPrecio = $("<td>").text(producto.Precio);

  row.append(
    cellNumero,
    cellCodigoProducto,
    cellDescripcion,
    cellStock,
    cellPrecio
  );
  $("#tbody_resultadosproductos").append(row);
}

// Función para seleccionar una fila de productos
function seleccionarFilaProducto() {
  $("#tablaResultadosProductos").on("click", "tr.selectable-row", function () {
    $("tr.selectable-row.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).css("--bs-table-bg", "#e1dfff");
    $("tr.selectable-row").not(this).css("--bs-table-bg", "");
    filaSeleccionadaProductos = this;

    var nombre = $(this).find("td:nth-child(2)").text();
    var descripcion = $(this).find("td:nth-child(3)").text();
    var stock = $(this).find("td:nth-child(4)").text();
    var precio = $(this).find("td:nth-child(5)").text();

    $("#validationCustom08").val(nombre);
    $("#validationCustom09").val(descripcion);
    $("#validationCustom10").val(precio);

    // Guardar el precio y stock del producto seleccionado
    precioProductoSeleccionado = parseFloat(precio.replace(/\$/g, ""));
    stockProductoSeleccionado = parseInt(stock);
  });
}

// Función para agregar un producto seleccionado
function agregarProducto() {
  if (filaSeleccionadaProductos) {
    var key = $(filaSeleccionadaProductos).data("key"); // Obtener la clave de la fila seleccionada
    var codigo = $(filaSeleccionadaProductos).find("td:nth-child(2)").text();
    var descripcion = $(filaSeleccionadaProductos)
      .find("td:nth-child(3)")
      .text();
    var stock = $(filaSeleccionadaProductos).find("td:nth-child(4)").text();
    var precio = $(filaSeleccionadaProductos).find("td:nth-child(5)").text();

    var cantidad = parseInt($("#cantidadInput").val());
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Ingresa una cantidad válida.");
      return;
    }

    var subtotal = cantidad * parseFloat(precio);

    // Insertar la información del producto en la tabla principal
    var fila = $("<tr>");
    fila.attr("data-key", key); // Asignar la clave a la fila
    fila.addClass("selectable-row");

    var celdaNumero = $("<td>").text(
      $("#tbody_productos tr.selectable-row").length + 1
    );
    var celdaCodigoProducto = $("<td>").text(codigo);
    var celdaDescripcion = $("<td>").text(descripcion);
    var celdaStock = $("<td>").text(stock);
    var celdaPrecio = $("<td>").text(precio);
    var celdaCantidad = $("<td>").text(cantidad);
    var celdaSubtotal = $("<td>").text(subtotal);

    fila.append(
      celdaNumero,
      celdaCodigoProducto,
      celdaDescripcion,

      celdaPrecio,
      celdaCantidad,
      celdaSubtotal
    );
    $("#tbody_productos").append(fila);
    calcularTotalVenta();
    // Cerrar el popup de productos
    $("#popup-productos").modal("hide");
  } else {
    alert("Selecciona un producto de la tabla antes de agregarlo.");
  }
}

// Función para cancelar la búsqueda de productos
function cancelarBusquedaProductos() {
  // Borrar el contenido del campo de búsqueda de productos
  $("#validationCustom02").val("");
  $("#cantidadInput").val("");
  $("#subtotal_resultados").val("");

  // Limpiar la tabla de resultados de productos
  $("#tbody_resultadosproductos").empty();

  filaSeleccionadaProductos = null;

  // Cerrar el popup de productos
  $("#popup-productos").modal("hide");
}
// Función para calcular el subtotal y actualizarlo cuando se cambie la cantidad
function calcularSubtotal() {
  var cantidad = parseInt($("#cantidadInput").val());
  var subtotal = cantidad * precioProductoSeleccionado;

  // Verificar si la cantidad ingresada es mayor al stock
  if (cantidad > stockProductoSeleccionado) {
    alert("La cantidad ingresada supera el stock disponible");
    $("#cantidadInput").val(stockProductoSeleccionado); // Restablecer la cantidad al stock disponible
    subtotal = stockProductoSeleccionado * precioProductoSeleccionado; // Actualizar el subtotal con el stock disponible
  }

  $("#subtotal_resultados").val(subtotal.toFixed(2)); // Mostrar el subtotal con 2 decimales
}

// Función para almacenar la información del cliente al seleccionar un input
function seleccionarInputCliente() {
  $(
    "#validationCustom04, #validationCustom05, #validationCustom06, #validationCustom07"
  ).on("change", function () {
    var nombre = $("#validationCustom04").val();
    var apellido = $("#validationCustom05").val();
    var dni = $("#validationCustom06").val();
    var telefono = $("#validationCustom07").val();
  });
  var inputsCliente = $(
    "#validationCustom04, #validationCustom05, #validationCustom06, #validationCustom07"
  );
  var dniInput = $("#validationCustom06");
  var inputsCliente = $(
    "#validationCustom04, #validationCustom05, #validationCustom06, #validationCustom07"
  );

  inputsCliente.on("click", function () {
    if (dniInput.val().trim() !== "") {
      dniInput.focus(); // Aplicar efecto de enfoque solo si hay datos en el input del DNI
    } else {
      alert("No hay ningun cliente ingresado!!!");
    }
  });
}

// Función para seleccionar una fila de productos
function seleccionarProductoTabla() {
  $("#tablaprincipal").on("click", "tr.selectable-row", function () {
    $("tr.selectable-row.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).css("--bs-table-bg", "#e1dfff");
    $("tr.selectable-row").not(this).css("--bs-table-bg", "");
    filaSeleccionadaTablaPrincipal = this;

    var nombre = $(this).find("td:nth-child(2)").text();
    var descripcion = $(this).find("td:nth-child(3)").text();
    var stock = $(this).find("td:nth-child(4)").text();
    var precio = $(this).find("td:nth-child(5)").text();
  });
}
// Función para calcular el valor total de la venta
function calcularTotalVenta() {
  totalVenta = 0; // Reiniciar el valor total de la venta

  // Iterar sobre todas las filas de la tabla principal
  $("#tbody_productos tr.selectable-row").each(function () {
    var subtotal = parseFloat($(this).find("td:nth-child(6)").text());
    totalVenta += subtotal;
  });

  // Actualizar el valor total de la venta en el input
  $("#validationCustom08").val(totalVenta.toFixed(2));
}

function guardarVenta() {
  // Obtener el UID del usuario almacenado en el Local Storage
  var uid = localStorage.getItem("uid");

  // Obtener la información de los inputs
  var nombres = $("#validationCustom04").val();
  var apellidos = $("#validationCustom05").val();
  var dni = $("#validationCustom06").val();
  var telefonos = $("#validationCustom07").val();
  var totalVenta = parseFloat($("#validationCustom08").val());

  // Validar que se ingresen los datos necesarios
  if (!nombres || !apellidos || !dni || !telefonos || isNaN(totalVenta)) {
    alert("Completa todos los campos requeridos");
    return;
  }

  // Crear una referencia a la base de datos utilizando el UID del usuario
  var dbRef = firebase.database().ref("Usuarios/" + uid);

  // Obtener el siguiente número de boleta
  obtenerSiguienteNumeroBoleta(uid, function (siguienteNumeroBoleta) {
    // Generar un nuevo ID único para la venta
    var nuevaVentaRef = dbRef.child("Ventas").push();

    // Crear el objeto de venta con los datos necesarios
    var venta = {
      Fecha: obtenerFechaActual(), // Agregar la fecha actual obtenida
      ClienteID: dni,
      Total: totalVenta.toFixed(2),
      Productos: obtenerProductosVenta(),
      Boleta: {
        Numero: siguienteNumeroBoleta,
        Total: totalVenta.toFixed(2),
        Detalle: "Detalles de la boleta...",
      },
    };

    // Actualizar el campo de entrada con el número de boleta actualizado
    $("#validationCustom03").val(siguienteNumeroBoleta);

    // Obtener los productos de la venta
    var productosVenta = venta.Productos;

    // Actualizar el stock de los productos en la base de datos
    for (var productoID in productosVenta) {
      if (productosVenta.hasOwnProperty(productoID)) {
        var cantidadVenta = parseInt(productosVenta[productoID].Cantidad);

        // Obtener la referencia al producto en la base de datos
        var productoRef = dbRef.child("Productos/" + productoID);

        // Obtener el valor actual del stock del producto
        productoRef.child("Stock").once("value", function (snapshot) {
          var stockActual = snapshot.val();

          // Calcular el nuevo stock restando la cantidad vendida
          var nuevoStock = stockActual - cantidadVenta;

          // Actualizar el stock del producto en la base de datos
          productoRef.update({ Stock: nuevoStock });
        });
      }
    }

    // Guardar la venta en la base de datos
    nuevaVentaRef
      .set(venta)
      .then(function () {
        alert("Venta guardada exitosamente");
        // Redirigir a la página principal o realizar alguna otra acción
      })
      .catch(function (error) {
        alert("Error al guardar la venta: " + error.message);
      });
  });
}
function obtenerFechaActual() {
  var fecha = new Date();
  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1; // Los meses comienzan desde 0
  var año = fecha.getFullYear();

  // Formatear la fecha como DD/MM/AAAA
  var fechaFormateada =
    (dia < 10 ? "0" + dia : dia) +
    "/" +
    (mes < 10 ? "0" + mes : mes) +
    "/" +
    año;

  return fechaFormateada;
}
function obtenerSiguienteNumeroBoleta(uid, callback) {
  var dbRef = firebase.database().ref("Usuarios/" + uid + "/Ventas");
  dbRef
    .orderByChild("Boleta/Numero")
    .limitToLast(1)
    .once("value", function (snapshot) {
      var ultimaVenta = snapshot.val();
      var ultimoNumeroBoleta = 0;
      if (ultimaVenta) {
        // Obtener el último número de boleta registrado
        var ventaKeys = Object.keys(ultimaVenta);
        var ultimaVentaKey = ventaKeys[0];
        ultimoNumeroBoleta = parseInt(
          ultimaVenta[ultimaVentaKey].Boleta.Numero.slice(3)
        );
      }
      // Generar el siguiente número de boleta
      var siguienteNumeroBoleta =
        "BOL" + ("0000" + (ultimoNumeroBoleta + 1)).slice(-5);
      callback(siguienteNumeroBoleta);
    });
}

function obtenerProductosVenta() {
  var productosVenta = {};

  // Obtener los productos de la tabla principal
  $("#tbody_productos tr.selectable-row").each(function () {
    var key = $(this).data("key");
    var cantidad = parseInt($(this).find("td:nth-child(6)").text());

    // Agregar el producto y su cantidad al objeto de productosVenta
    productosVenta[key] = { Cantidad: cantidad };
  });

  return productosVenta;
}
