// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDrzCRyT3S-SY7Vvh58jkPtstVSLMvsStQ",
  authDomain: "gestorinventarios-e37f6.firebaseapp.com",
  databaseURL: "https://gestorinventarios-e37f6-default-rtdb.firebaseio.com",
  projectId: "gestorinventarios-e37f6",
  storageBucket: "gestorinventarios-e37f6.appspot.com",
  messagingSenderId: "968579423727",
  appId: "1:968579423727:web:04d75d7fda53cfd8086a1a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Obtiene las referencias a los servicios de autenticación y base de datos de Firebase
var auth = firebase.auth();
var database = firebase.database();

// Función para registrar un usuario
function registerUser() {
  // Obtiene los valores ingresados en los campos del formulario
  var fullName = document.getElementById("register-nombre").value;
  var email = document.getElementById("register-email").value;
  var password = document.getElementById("register-contrasena").value;
  var confirmPassword = document.getElementById("confirmarcontrasena").value;

  // Verifica que todos los campos estén llenos
  if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
    alert("Rellene todos los campos.");
    return;
  }

  // Verifica que la contraseña y la confirmación coincidan
  if (password !== confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  // Crea el usuario en Firebase Authentication
  auth.createUserWithEmailAndPassword(email, password)
    .then(function(userCredential) {
      var user = userCredential.user;

      // Guarda los datos del usuario en la base de datos en la tabla "Usuarios"
      var userData = {
        NombreCompleto: fullName,
        Email: email
      };

      var usuariosRef = database.ref("Usuarios");
      usuariosRef.child(user.uid).set(userData)
        .then(function() {
          console.log("Datos del usuario guardados en la tabla 'Usuarios'");
          // Redirige a otra página después de un registro exitoso
          window.location.href = "../index.html";
        })
        .catch(function(error) {
          console.log("Error registrando el usuario:", error);
        });
    })
    .catch(function(error) {
      console.log("Error de registro:", error.code, error.message);
    });

    // Función para mostrar una notificación de registro exitoso
    function showRegistrationSuccessNotification() {
      alert("¡Registro exitoso!");
    }
}

