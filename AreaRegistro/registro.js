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
  var auth = firebase.auth();
  var database = firebase.database();
  
  function registerUser() {
    var fullName = document.getElementById("register-nombre").value;
    var email = document.getElementById("register-email").value;
    var password = document.getElementById("register-contrasena").value;
    var confirmPassword = document.getElementById("confirmarcontrasena").value;
  
    // Verify that all fields are filled
    if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
      alert("Rellene todos los campos.");
      return;
    }
  
    // Verify that password and confirm password match
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
  
    auth.createUserWithEmailAndPassword(email, password)
  .then(function(userCredential) {
    var user = userCredential.user;

    // Save user data to Realtime Database
    var userData = {
      uid: user.uid,
      fullName: fullName,
      email: email
    };

    var userRef = database.ref("users/" + user.uid);
    userRef.set(userData)
      .then(function() {
        console.log("User data saved to database");
        // Redirect to another page after successful registration
        window.location.href = "../index.html";
      })
      .catch(function(error) {
        console.log("Error registrando el usuario:", error);
      });
  })
  .catch(function(error) {
    console.log("Registration error:", error.code, error.message);
  });
  }
  