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

document.addEventListener("DOMContentLoaded", function () {
  var btnRegistrar = document.getElementById("btn-registrar");
  btnRegistrar.addEventListener("click", function (event) {
    validateForm(event);
  });
});

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
      var apellidos = form.querySelector("#validationCustom02").value;
      var dni = form.querySelector("#validationCustom03").value;
      var telefono = form.querySelector("#validationCustom04").value;

      // Crear una nueva fila en la tabla
      var tablaBody = document.getElementById("tablaBodyClientes");
      var newRow = tablaBody.insertRow();

      // Agregar la clase "selectable-row" a la fila
      newRow.classList.add("selectable-row");

      // Insertar las celdas con los valores ingresados
      var cellNumero = newRow.insertCell();
      var cellNombre = newRow.insertCell();
      var cellApellidos = newRow.insertCell();
      var cellDNI = newRow.insertCell();
      var cellTelefono = newRow.insertCell();

      cellNumero.innerHTML = tablaBody.rows.length; // Número de fila
      cellNombre.innerHTML = nombre;
      cellApellidos.innerHTML = apellidos;
      cellDNI.innerHTML = dni;
      cellTelefono.innerHTML = telefono;

      // Obtener la referencia al nodo "clientes" del usuario actual
      var currentUserClientsRef = database.ref("Usuarios/" + uid + "/Clientes");

      // Generar un nuevo ID para el cliente
      var newClientRef = currentUserClientsRef.push();

      // Guardar los datos del cliente en la base de datos
      newClientRef
        .set({
          Nombre: nombre,
          Apellido: apellidos,
          DNI: dni,
          Telefono: telefono,
        })
        .then(function () {
          console.log("Cliente guardado exitosamente en la base de datos");
        })
        .catch(function (error) {
          console.log(
            "Error al guardar el cliente en la base de datos:",
            error
          );
        });

      // Borrar el contenido de los inputs
      form.reset();
    }
  });
}

//CARGA CLIENTE EN LA TABLA
$(document).ready(function () {
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
      row.setAttribute("data-dni", cliente.DNI);
      row.setAttribute("data-key", childSnapshot.key);
      var cellNumero = row.insertCell();
      var cellNombres = row.insertCell();
      var cellApellidos = row.insertCell();
      var cellDNI = row.insertCell();
      var cellTelefono = row.insertCell();

      cellNumero.innerHTML = contador;
      cellNombres.innerHTML = cliente.Nombre;
      cellApellidos.innerHTML = cliente.Apellido;
      cellDNI.innerHTML = cliente.DNI;
      cellTelefono.innerHTML = cliente.Telefono;

      contador++;
    });
  });
});

//FUNCION PARA editar clientes
$(document).ready(function () {
  // Variable para almacenar la fila seleccionada
  var filaSeleccionada = null;

  // Evento de clic en una fila
  $("#tablaBodyClientes").on("click", "tr.selectable-row", function () {
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
    var nombre = $(this).find("td:nth-child(2)").text();
    var apellidos = $(this).find("td:nth-child(3)").text();
    var dni = $(this).find("td:nth-child(4)").text();
    var telefono = $(this).find("td:nth-child(5)").text();

    // Cargar los datos en el formulario
    $("#validationCustom01").val(nombre);
    $("#validationCustom02").val(apellidos);
    $("#validationCustom03").val(dni);
    $("#validationCustom04").val(telefono);
  });

  // Evento de click en el BOTON EDITAR
  $("#btn-editar").on("click", function () {
    // Verificar si hay una fila seleccionada
    if (filaSeleccionada === null) {
      alert("No se ha seleccionado ningún cliente");
      return;
    } else {
      // Obtener los valores ingresados en el formulario
      var nombre = $("#validationCustom01").val();
      var apellidos = $("#validationCustom02").val();
      var dni = $("#validationCustom03").val();
      var telefono = $("#validationCustom04").val();

      // Obtener el DNI seleccionado desde la fila seleccionada
      var dniSeleccionado = $(filaSeleccionada).find("td:nth-child(4)").text();

      // Buscar el cliente en el Realtime Database por su DNI
      var clienteRef = database
        .ref("Usuarios/" + uid + "/Clientes")
        .orderByChild("DNI")
        .equalTo(dniSeleccionado);

      clienteRef.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          var clienteKey = childSnapshot.key;

          // Actualizar los datos del cliente con los valores del formulario
          var updates = {};
          updates["Usuarios/" + uid + "/Clientes/" + clienteKey + "/Nombre"] =
            nombre;
          updates["Usuarios/" + uid + "/Clientes/" + clienteKey + "/Apellido"] =
            apellidos;
          updates["Usuarios/" + uid + "/Clientes/" + clienteKey + "/DNI"] =
            telefono;

          updates["Usuarios/" + uid + "/Clientes/" + clienteKey + "/Telefono"] =
            telefono;

          // Ejecutar las actualizaciones en el Realtime Database
          database
            .ref()
            .update(updates)
            .then(function () {
              alert("Edición exitosa");

              // Actualizar los datos de la fila seleccionada en la tabla
              $(filaSeleccionada).find("td:nth-child(2)").text(nombre);
              $(filaSeleccionada).find("td:nth-child(3)").text(apellidos);
              $(filaSeleccionada).find("td:nth-child(4)").text(dni);
              $(filaSeleccionada).find("td:nth-child(5)").text(telefono);
            })
            .catch(function (error) {
              console.log(
                "Error al editar el cliente en la base de datos:",
                error
              );
            });
        });
      });
    }
  });
  // Función para limpiar la tabla
  function limpiarTabla() {
    $("#tablaBodyClientes").empty();
  }
  //EVENTO DE CLICK EN BOTON BUSCAR
  $("#btn-buscar").on("click", function () {
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

            // Agregar la fila a la tabla
            var row = tablaBodyClientes.insertRow();
            row.classList.add("selectable-row"); // Agregar la clase "selectable-row" a la fila
            row.setAttribute("data-dni", cliente.DNI);
            row.setAttribute("data-key", childSnapshot.key);
            var cellNumero = row.insertCell();
            var cellNombres = row.insertCell();
            var cellApellidos = row.insertCell();
            var cellDNI = row.insertCell();
            var cellTelefono = row.insertCell();

            cellNumero.innerHTML = clientesEncontrados.length; // Usar el índice en los clientes encontrados como número de fila
            cellNombres.innerHTML = cliente.Nombre;
            cellApellidos.innerHTML = cliente.Apellido;
            cellDNI.innerHTML = cliente.DNI;
            cellTelefono.innerHTML = cliente.Telefono;
          }
        });

        if (clientesEncontrados.length > 0) {
          console.log("Clientes encontrados:", clientesEncontrados);
        } else {
          alert("No se encontró ningún cliente con el dato ingresado");
        }
      });
    }
  });
  //BOTON ELIMINAR
  $("#btn-eliminar").on("click", function () {
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
    var clienteRef = database.ref(
      "Usuarios/" + uid + "/Clientes/" + clienteKey
    );

    // Eliminar el cliente de la base de datos
    clienteRef
      .remove()
      .then(function () {
        console.log("Cliente eliminado exitosamente");
        // Volver a cargar los clientes en la tabla
        cargarClientesEnTabla();
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
  });
});

//BOTON CANCELAR
$(document).ready(function () {
  // Evento de clic en el botón "Cancelar"
  $("#btn-cancelar").on("click", function () {
    // Reiniciar el formulario
    $("form.needs-validation")[0].reset();
    $("form.needs-validation").removeClass("was-validated");

    // Limpiar el campo de búsqueda
    $("#input-busqueda").val("");

    // Reiniciar la tabla cargando los clientes desde el Realtime Database
    cargarClientesEnTabla();
  });
});

function cargarClientesEnTabla() {
  var uid = localStorage.getItem("uid");
  var clientesRef = database.ref("Usuarios/" + uid + "/Clientes");

  clientesRef.once("value", function (snapshot) {
    var tablaBody = $("#tablaBodyClientes");
    tablaBody.empty();

    var contador = 1;

    snapshot.forEach(function (childSnapshot) {
      var cliente = childSnapshot.val();

      var row = tablaBody[0].insertRow();
      row.classList.add("selectable-row");
      row.setAttribute("data-dni", cliente.DNI);
      row.setAttribute("data-key", childSnapshot.key);
      var cellNumero = row.insertCell();
      var cellNombres = row.insertCell();
      var cellApellidos = row.insertCell();
      var cellDNI = row.insertCell();
      var cellTelefono = row.insertCell();

      cellNumero.innerHTML = contador;
      cellNombres.innerHTML = cliente.Nombre;
      cellApellidos.innerHTML = cliente.Apellido;
      cellDNI.innerHTML = cliente.DNI;
      cellTelefono.innerHTML = cliente.Telefono;

      contador++;
    });
  });
}
