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

// Variable para almacenar la fila seleccionada
var filaSeleccionada = null;
// Variable para almacenar la fila seleccionada en la función de eliminar
var filaSeleccionadaEliminar = null;

document.addEventListener("DOMContentLoaded", function () {
  //CARGAR DATOS DE PRODUCTOS EN TABLA
  cargarDatosProductos();

  //CLICK EN BOTON REGISTRAR
  $("#btn-registrar").on("click", function (event) {
    validateForm(event);
  });

  //SELECCIONAR FILA
  seleccionarFila();

  //CLICK EN BOTON EDITAR
  $("#btn-editar").on("click", function () {
    // Verificar si hay una fila seleccionada
    if (filaSeleccionada === null) {
      alert("No se ha seleccionado ningún producto");
      return;
    }

    // Obtener los valores ingresados en el formulario
    var descripcion = $("#validationCustom01").val();
    var stock = $("#validationCustom02").val();
    var precio = $("#validationCustom03").val();

    // Obtener el código del producto seleccionado desde la fila seleccionada
    var codigoProductoSeleccionado = $(filaSeleccionada)
      .find("td:nth-child(2)")
      .text();

    // Llamar a la función para editar los datos del producto
    editarProducto(descripcion, stock, precio, codigoProductoSeleccionado);
  });

  //CLICK BUSCAR PRODUCTOS
  $("#btn-buscar").on("click", function () {
    buscarProducto();
  });

  //CLICK BOTON ELIMINAR
  $("#btn-eliminar").on("click", eliminarProductoSeleccionado);

  //CLICK BOTON CANCELAR
  $("#btn-cancelar").on("click", function () {
    cancelarEdicion();
  });
});

//FUNCION VALIDACION DE FORMULARIO Y AGREGAR PRODUCTOS A BASE DE DATOS
function validateForm(event) {
  event.preventDefault();
  event.stopPropagation();

  //VALIDACION DEL FORMULARIO
  var forms = document.getElementsByClassName("needs-validation");
  Array.prototype.filter.call(forms, function (form) {
    if (form.checkValidity() === false) {
      form.classList.add("was-validated");
    } else {
      // Obtener los valores ingresados en el formulario
      var descripcion = form.querySelector("#validationCustom01").value;
      var stock = form.querySelector("#validationCustom02").value;
      var precio = form.querySelector("#validationCustom03").value;

      // Crear una nueva fila en la tabla
      var tablaBody = $("#tbodyProductos")[0];
      var newRow = tablaBody.insertRow();

      // Agregar la clase "selectable-row" a la fila
      newRow.classList.add("selectable-row");

      // Insertar las celdas con los valores ingresados
      var cellNumero = newRow.insertCell();
      var cellCodigoProducto = newRow.insertCell();
      var cellDescripcion = newRow.insertCell();
      var cellStock = newRow.insertCell();
      var cellPrecio = newRow.insertCell();

      cellNumero.innerHTML = tablaBody.rows.length; // Número de fila
      var codigoProducto = "C" + padLeft(tablaBody.children.length + 1, 7, "0");
      cellCodigoProducto.innerHTML = codigoProducto; // Código del producto
      cellDescripcion.innerHTML = descripcion;
      cellStock.innerHTML = stock;
      cellPrecio.innerHTML = "S/ " + parseFloat(precio).toFixed(2);

      // Obtener la referencia al nodo "productos" del usuario actual
      var currentUserProductsRef = database.ref(
        "Usuarios/" + uid + "/Productos"
      );

      // Generar un nuevo ID para el producto
      var newProductRef = currentUserProductsRef.push();

      // Guardar los datos del producto en la base de datos
      newProductRef
        .set({
          codigoProducto: codigoProducto,
          Descripcion: descripcion,
          Stock: stock,
          Precio: precio,
        })
        .then(function () {
          console.log("Producto guardado exitosamente en la base de datos");
          // Agregar el atributo data-key a la fila recién agregada
          $(newRow).attr("data-key", newProductRef.key);
        })
        .catch(function (error) {
          console.log(
            "Error al guardar el producto en la base de datos:",
            error
          );
        });

      // Borrar el contenido de los inputs
      form.reset();

      // Actualizar la variable filaSeleccionada con la nueva fila agregada
      filaSeleccionada = newRow;

      // Restablecer el color de fondo de todas las filas
      $("tr.selectable-row").css("--bs-table-bg", "");

      // Agregar el color de fondo a la fila seleccionada
      $(filaSeleccionada).css("--bs-table-bg", "#e1dfff");
    }
  });

  function padLeft(value, length, paddingChar) {
    var result = value.toString();
    while (result.length < length) {
      result = paddingChar + result;
    }
    return result;
  }
}

//FUNCION PARA CARGAR PRODUCTOS DESDE LA BASE DE DATOS A LA TABLA DE PRODUCTOS
function cargarDatosProductos() {
  // Obtiene una referencia al nodo de productos en la base de datos
  var productosRef = database.ref("Usuarios/" + uid + "/Productos");

  // Carga los datos de los productos y los muestra en la tabla
  productosRef.once("value", function (snapshot) {
    var tablaBody = $("#tbodyProductos")[0];
    var contador = 1;

    snapshot.forEach(function (childSnapshot) {
      var producto = childSnapshot.val();

      var row = tablaBody.insertRow();
      row.classList.add("selectable-row"); // Agregar la clase "selectable-row" a la fila
      row.setAttribute("data-key", childSnapshot.key);
      var cellNumero = row.insertCell();
      var cellCodigoProducto = row.insertCell();
      var cellDescripcion = row.insertCell();
      var cellStock = row.insertCell();
      var cellPrecio = row.insertCell();

      cellNumero.innerHTML = contador;
      cellCodigoProducto.innerHTML = producto.codigoProducto;
      cellDescripcion.innerHTML = producto.Descripcion;
      cellStock.innerHTML = producto.Stock;
      cellPrecio.innerHTML = "S/" + parseFloat(producto.Precio).toFixed(2);

      contador++;
    });
  });
}

// FUNCION PARA SELECCIONAR UNA FILA
function seleccionarFila() {
  // Evento de clic en una fila
  $("#tbodyProductos").on("click", "tr.selectable-row", function () {
    // Desmarca todas las filas previamente seleccionadas
    $("tr.selectable-row.selected").removeClass("selected");

    // Marca la fila actual como seleccionada
    $(this).addClass("selected");

    // Cambia el color de fondo de la fila seleccionada
    $(this).css("--bs-table-bg", "#e1dfff");

    // Restablece el color de fondo de las demás filas
    $("tr.selectable-row").not(this).css("--bs-table-bg", "");

    // Almacena la fila seleccionada
    filaSeleccionada = this;

    // Obtener los datos de la fila seleccionada
    var codigoProducto = $(this).find("td:nth-child(2)").text();
    var descripcion = $(this).find("td:nth-child(3)").text();
    var stock = $(this).find("td:nth-child(4)").text();
    var precio = $(this).find("td:nth-child(5)").text();

    // Cargar los datos en el formulario
    $("#validationCustom01").val(descripcion);
    $("#validationCustom02").val(stock);
    $("#validationCustom03").val(precio);

    // Almacena la clave del producto seleccionado
    productoKey = $(this).data("key");
  });
}
// Función para editar los datos del producto
function editarProducto(
  descripcion,
  stock,
  precio,
  codigoProductoSeleccionado
) {
  // Buscar el producto en el Realtime Database por su código
  var productoRef = database
    .ref("Usuarios/" + uid + "/Productos")
    .orderByChild("codigoProducto")
    .equalTo(codigoProductoSeleccionado);

  productoRef.once("value", function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var productoKey = childSnapshot.key;

      // Actualizar los datos del producto con los valores del formulario
      var updates = {};
      updates[
        "Usuarios/" + uid + "/Productos/" + productoKey + "/Descripcion"
      ] = descripcion;
      updates["Usuarios/" + uid + "/Productos/" + productoKey + "/Stock"] =
        stock;
      updates["Usuarios/" + uid + "/Productos/" + productoKey + "/Precio"] =
        precio;

      // Ejecutar las actualizaciones en el Realtime Database
      database
        .ref()
        .update(updates)
        .then(function () {
          alert("Edición exitosa");

          // Actualizar los datos de la fila seleccionada en la tabla
          $(filaSeleccionada).find("td:nth-child(3)").text(descripcion);
          $(filaSeleccionada).find("td:nth-child(4)").text(stock);
          $(filaSeleccionada).find("td:nth-child(5)").text(precio);
        })
        .catch(function (error) {
          console.log(
            "Error al editar el producto en la base de datos:",
            error
          );
        });
    });
  });
}

// FUNCION PARA BUSCAR PRODUCTOS
function buscarProducto() {
  var criterioBusqueda = $("#input-busqueda").val().toLowerCase();

  // Verificar si el campo de búsqueda está vacío
  if (criterioBusqueda.trim() === "") {
    alert("Ingresa un criterio de búsqueda");
    return;
  } else {
    var uid = localStorage.getItem("uid");
    var productosRef = database.ref("Usuarios/" + uid + "/Productos");
    productosRef.once("value", function (snapshot) {
      var productosEncontrados = [];
      limpiarTabla();
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
          mostrarResultados(
            producto,
            childSnapshot.key,
            productosEncontrados.length
          );
        }
      });

      if (productosEncontrados.length > 0) {
        console.log("Productos encontrados:", productosEncontrados);
      } else {
        alert("No se encontró ningún producto con el dato ingresado");
      }
    });
  }
}

// FUNCION PARA MOSTRAR LOS RESULTADOS EN LA TABLA
function mostrarResultados(producto, key, numeroFila) {
  var row = tbodyProductos.insertRow();
  row.classList.add("selectable-row"); // Agregar la clase "selectable-row" a la fila
  row.setAttribute("data-codigo", producto.codigoProducto);
  row.setAttribute("data-key", key);
  var cellNumero = row.insertCell();
  var cellCodigoProducto = row.insertCell();
  var cellDescripcion = row.insertCell();
  var cellStock = row.insertCell();
  var cellPrecio = row.insertCell();

  cellNumero.innerHTML = numeroFila; // Usar el índice en los productos encontrados como número de fila
  cellCodigoProducto.innerHTML = producto.codigoProducto;
  cellDescripcion.innerHTML = producto.Descripcion;
  cellStock.innerHTML = producto.Stock;
  cellPrecio.innerHTML = "S/" + parseFloat(producto.Precio).toFixed(2);
}

//FUNCION PARA ELIMINAR PRODUCTOS
function eliminarProductoSeleccionado() {
  // Verificar si hay una fila seleccionada
  if (!filaSeleccionada) {
    alert("No hay producto seleccionado");
    return;
  }

  // Obtener la clave del producto seleccionado
  var productoKey = $(filaSeleccionada).data("key");

  // Verificar si se ha seleccionado un producto válido
  if (!productoKey) {
    alert("No se encontró la clave del producto seleccionado");
    return;
  }

  // Obtener la referencia al producto en la base de datos
  var uid = localStorage.getItem("uid");
  var productoRef = database.ref(
    "Usuarios/" + uid + "/Productos/" + productoKey
  );

  // Eliminar el producto de la base de datos
  productoRef
    .remove()
    .then(function () {
      limpiarTabla();
      console.log("Producto eliminado exitosamente");
      // Volver a cargar los productos en la tabla
      cargarDatosProductos();
      // Resetear el formulario
      $("#validationCustom01").val("");
      $("#validationCustom02").val("");
      $("#validationCustom03").val("");
      // Desmarcar la fila seleccionada
      $(filaSeleccionada).removeClass("selected");
      // Restablecer el color de fondo de las filas
      $("tr.selectable-row").css("--bs-table-bg", "");
    })
    .catch(function (error) {
      console.error("Error al eliminar el producto:", error);
    });
}

//FUNCION PARA CANCELAR
function cancelarEdicion() {
  // Reiniciar el formulario
  $("form.needs-validation")[0].reset();
  $("form.needs-validation").removeClass("was-validated");

  // Limpiar el campo de búsqueda
  $("#input-busqueda").val("");

  // Reiniciar la tabla cargando los clientes desde el Realtime Database
  limpiarTabla();
  cargarDatosProductos();
}

// Función para LIMPIAR LA TABLA
function limpiarTabla() {
  $("#tbodyProductos").empty();
}
