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
  //CARGAR DATOS DE CLIENTES EN TABLA
  cargarDatosClientes();

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
      alert("No se ha seleccionado ningún cliente");
      return;
    }

    // Obtener los valores ingresados en el formulario
    var nombre = $("#validationCustom01").val();
    var apellido = $("#validationCustom02").val();
    var dni = $("#validationCustom03").val();
    var telefono = $("#validationCustom04").val();

    // Obtener la clave del cliente seleccionado desde la fila seleccionada
    var clienteKey = $(filaSeleccionada).data("key");

    // Llamar a la función para editar los datos del cliente
    editarCliente(nombre, apellido, dni, telefono, clienteKey);
  });

  //CLICK BUSCAR CLIENTES
  $("#btn-buscar").on("click", function () {
    buscarCliente();
  });

  //CLICK BOTON ELIMINAR
  $("#btn-eliminar").on("click", eliminarClienteSeleccionado);

  //CLICK BOTON CANCELAR
  $("#btn-cancelar").on("click", function () {
    cancelarEdicion();
  });
});

//FUNCION VALIDACION DE FORMULARIO Y AGREGAR CLIENTES A BASE DE DATOS
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
      var nombre = form.querySelector("#validationCustom01").value;
      var apellido = form.querySelector("#validationCustom02").value;
      var dni = form.querySelector("#validationCustom03").value;
      var telefono = form.querySelector("#validationCustom04").value;

      // Crear una nueva fila en la tabla
      var tablaBody = $("#tablaBodyClientes")[0];
      var newRow = tablaBody.insertRow();

      // Agregar la clase "selectable-row" a la fila
      newRow.classList.add("selectable-row");

      // Insertar las celdas con los valores ingresados
      var cellNumero = newRow.insertCell();
      var cellNombre = newRow.insertCell();
      var cellApellido = newRow.insertCell();
      var cellDni = newRow.insertCell();
      var cellTelefono = newRow.insertCell();

      cellNumero.innerHTML = tablaBody.rows.length; // Número de fila
      cellNombre.innerHTML = nombre;
      cellApellido.innerHTML = apellido;
      cellDni.innerHTML = dni;
      cellTelefono.innerHTML = telefono;

      // Obtener la referencia al nodo "Clientes" del usuario actual
      var currentUserClientsRef = database.ref("Usuarios/" + uid + "/Clientes");

      // Generar una nueva clave para el cliente
      var newClientRef = currentUserClientsRef.push();

      // Guardar los datos del cliente en la base de datos
      newClientRef
        .set({
          Nombre: nombre,
          Apellido: apellido,
          DNI: dni,
          Telefono: telefono,
        })
        .then(function () {
          console.log("Cliente guardado exitosamente en la base de datos");
          // Agregar el atributo data-key a la fila recién agregada
          $(newRow).attr("data-key", newClientRef.key);
        })
        .catch(function (error) {
          console.log(
            "Error al guardar el cliente en la base de datos:",
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
}

//FUNCION PARA CARGAR CLIENTES DESDE LA BASE DE DATOS A LA TABLA DE CLIENTES
function cargarDatosClientes() {
  // Obtiene una referencia al nodo de clientes en la base de datos
  var clientesRef = database.ref("Usuarios/" + uid + "/Clientes");

  // Carga los datos de los clientes y los muestra en la tabla
  clientesRef.once("value", function (snapshot) {
    var tablaBody = $("#tablaBodyClientes")[0];
    var contador = 1;

    snapshot.forEach(function (childSnapshot) {
      var cliente = childSnapshot.val();

      var row = tablaBody.insertRow();
      row.classList.add("selectable-row"); // Agregar la clase "selectable-row" a la fila
      row.setAttribute("data-key", childSnapshot.key);
      var cellNumero = row.insertCell();
      var cellNombre = row.insertCell();
      var cellApellido = row.insertCell();
      var cellDni = row.insertCell();
      var cellTelefono = row.insertCell();

      cellNumero.innerHTML = contador;
      cellNombre.innerHTML = cliente.Nombre;
      cellApellido.innerHTML = cliente.Apellido;
      cellDni.innerHTML = cliente.DNI;
      cellTelefono.innerHTML = cliente.Telefono;

      contador++;
    });
  });
}

// FUNCION PARA SELECCIONAR UNA FILA
function seleccionarFila() {
  // Evento de clic en una fila
  $("#tablaBodyClientes").on("click", "tr.selectable-row", function () {
    // Desmarca todas las filas previamente seleccionadas
    $("tr.selectable-row.selected").removeClass("selected");

    // Marca la fila actual como seleccionada
    $(this).addClass("selected");

    // Cambia el color de fondo de la fila seleccionada
    $(this).css("--bs-table-bg", "#e1dfff");

    // Restablece el color de fondo delas demás filas
    $("tr.selectable-row").not(this).css("--bs-table-bg", "");

    // Almacena la fila seleccionada
    filaSeleccionada = this;

    // Obtener los datos de la fila seleccionada
    var nombre = $(this).find("td:nth-child(2)").text();
    var apellido = $(this).find("td:nth-child(3)").text();
    var dni = $(this).find("td:nth-child(4)").text();
    var telefono = $(this).find("td:nth-child(5)").text();

    // Cargar los datos en el formulario
    $("#validationCustom01").val(nombre);
    $("#validationCustom02").val(apellido);
    $("#validationCustom03").val(dni);
    $("#validationCustom04").val(telefono);

    // Almacena la clave del cliente seleccionado
    clienteKey = $(this).data("key");
  });
}

// Función para editar los datos del cliente
function editarCliente(nombre, apellido, dni, telefono, clienteKey) {
  // Buscar el cliente en el Realtime Database por su clave
  var clienteRef = database
    .ref("Usuarios/" + uid + "/Clientes")
    .child(clienteKey);

  clienteRef
    .update({
      Nombre: nombre,
      Apellido: apellido,
      DNI: dni,
      Telefono: telefono,
    })
    .then(function () {
      alert("Edición exitosa");

      // Actualizar los datos de la fila seleccionada en la tabla
      $(filaSeleccionada).find("td:nth-child(2)").text(nombre);
      $(filaSeleccionada).find("td:nth-child(3)").text(apellido);
      $(filaSeleccionada).find("td:nth-child(4)").text(dni);
      $(filaSeleccionada).find("td:nth-child(5)").text(telefono);
    })
    .catch(function (error) {
      console.log("Error al editar el cliente en la base de datos:", error);
    });
}

// FUNCION PARA BUSCAR CLIENTES
function buscarCliente() {
  var criterioBusqueda = $("#input-busqueda").val().toLowerCase();

  // Verificar si el campo de búsqueda está vacío
  if (criterioBusqueda.trim() === "") {
    alert("Ingresa un criterio de búsqueda");
    return;
  } else {
    var uid = localStorage.getItem("uid");
    var clientesRef = database.ref("Usuarios/" + uid + "/Clientes");
    clientesRef.once("value", function (snapshot) {
      var clientesEncontrados = [];
      limpiarTabla();
      snapshot.forEach(function (childSnapshot) {
        var cliente = childSnapshot.val();

        if (
          cliente.Nombre.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          cliente.Apellido.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          cliente.DNI.toLowerCase().indexOf(criterioBusqueda) !== -1 ||
          cliente.Telefono.toLowerCase().indexOf(criterioBusqueda) !== -1
        ) {
          clientesEncontrados.push(cliente);
          mostrarResultados(
            cliente,
            childSnapshot.key,
            clientesEncontrados.length
          );
        }
      });

      if (clientesEncontrados.length > 0) {
        console.log("Clientes encontrados:", clientesEncontrados);
      } else {
        alert("No se encontró ningún cliente con el dato ingresado");
      }
    });
  }
}

// FUNCION PARA MOSTRAR LOS RESULTADOS EN LA TABLA
function mostrarResultados(cliente, key, numeroFila) {
  var row = tablaBodyClientes.insertRow();
  row.classList.add("selectable-row"); // Agregar la clase "selectable-row" a la fila
  row.setAttribute("data-key", key);
  var cellNumero = row.insertCell();
  var cellNombre = row.insertCell();
  var cellApellido = row.insertCell();
  var cellDni = row.insertCell();
  var cellTelefono = row.insertCell();

  cellNumero.innerHTML = numeroFila; // Usar el índice en los clientes encontrados como número de fila
  cellNombre.innerHTML = cliente.Nombre;
  cellApellido.innerHTML = cliente.Apellido;
  cellDni.innerHTML = cliente.DNI;
  cellTelefono.innerHTML = cliente.Telefono;
}

//FUNCION PARA ELIMINAR CLIENTES
function eliminarClienteSeleccionado() {
  // Verificar si hay una fila seleccionada
  if (!filaSeleccionada) {
    alert("No hay cliente seleccionado");
    return;
  }

  // Obtener la clave del cliente seleccionado
  var clienteKey = $(filaSeleccionada).data("key");

  // Verificar si se ha seleccionado un cliente válido
  if (!clienteKey) {
    alert("No se encontró la clave del cliente seleccionado");
    return;
  }

  // Obtener la referencia al cliente en la base de datos
  var uid = localStorage.getItem("uid");
  var clienteRef = database.ref("Usuarios/" + uid + "/Clientes/" + clienteKey);

  // Eliminar el cliente de la base de datos
  clienteRef
    .remove()
    .then(function () {
      limpiarTabla();
      console.log("Cliente eliminado exitosamente");
      // Volver a cargar los clientes en la tabla
      cargarDatosClientes();
      // Resetear el formulario
      $("#validationCustom01").val("");
      $("#validationCustom02").val("");
      $("#validationCustom03").val("");
      $("#validationCustom04").val("");
      // Desmarcar la fila seleccionada
      $(filaSeleccionada).removeClass("selected");
      // Restablecer el color de fondo de las filas
      $("tr.selectable-row").css("--bs-table-bg", "");
    })
    .catch(function (error) {
      console.error("Error al eliminar el cliente:", error);
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
  cargarDatosClientes();
}

// Función para LIMPIAR LA TABLA
function limpiarTabla() {
  $("#tablaBodyClientes").empty();
}
