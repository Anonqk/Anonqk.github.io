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
var database = firebase.database();
var uid = localStorage.getItem("uid");

// Comprobar si el usuario está logeado
if (uid) {
  var userRef = database.ref("Usuarios/" + uid);
  userRef
    .once("value")
    .then(function (snapshot) {
      var userData = snapshot.val();
      if (userData) {
        var fullName = userData.NombreCompleto;
        var businessName = userData.Negocio;
        console.log("Usuario Logeado. UID:", uid);
        console.log("Nombre Completo:", fullName || "No disponible");
        console.log("Negocio:", businessName || "No disponible");
      } else {
        console.log("No se encontraron datos para el usuario.");
      }
    })
    .catch(function (error) {
      console.log("Error al obtener datos del usuario:", error);
    });
} else {
  console.log("Ningún usuario logeado.");
}
