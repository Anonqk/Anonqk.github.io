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
