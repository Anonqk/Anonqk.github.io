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

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();

function loginUser() {
  var usuario = document.getElementById("usuario").value;
  var contrasena = document.getElementById("contrasena").value;

  // Verify that both fields are filled
  if (usuario === "" || contrasena === "") {
    alert("Rellene todos los campos.");
    return;
  }

  auth
    .signInWithEmailAndPassword(usuario, contrasena)
    .then(function (userCredential) {
      // Login successful
      var user = userCredential.user;
      console.log("User logged in:", user);

      // Store the UID in localStorage
      localStorage.setItem("uid", user.uid);

      // Redirect to another page after successful login
      window.location.href = "MenuPrincipal/menuprincipal.html";
    })
    .catch(function (error) {
      // Login error
      console.log("Login error:", error.code, error.message);
      alert("Inicio de sesión fallido. Verifique sus credenciales.");
    });
}

// Add an event listener to the login button
document.getElementById("login-btn").addEventListener("click", loginUser);
