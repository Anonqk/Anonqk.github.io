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
const defaultFile =
  "https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg";
const file = document.getElementById("foto");
const img = document.getElementById("img");
const nombreEmpresaInput = document.getElementById("inputNombreEmpresa");
const guardarBtn = document.getElementById("guardarcambios");
const cancelarBtn = document.getElementById("cancelarcambios");

// Obtener UID del almacenamiento local
const uid = localStorage.getItem("uid");

// Obtener URL de imagen del almacenamiento local
const imageURL = localStorage.getItem("imageURL");

// Establecer imagen de perfil con la URL almacenada
if (imageURL) {
  img.src = imageURL;
  img.style.display = "block"; // Mostrar la imagen previa en el círculo
} else {
  img.src = defaultFile;
  img.style.display = "none"; // Ocultar el círculo si no hay imagen previa
}

// Obtener nombre de la empresa desde Realtime Database
firebase
  .database()
  .ref(`/Usuarios/${uid}/Negocio`)
  .once("value")
  .then((snapshot) => {
    const nombreEmpresa = snapshot.val();

    // Establecer el valor del campo de entrada con el nombre de la empresa obtenido
    nombreEmpresaInput.value = nombreEmpresa || "";
  })
  .catch((error) => {
    console.log(
      "Error al obtener el nombre de la empresa desde Realtime Database:",
      error
    );
  });
let selectedFile;
// Agregar evento change al input de archivo
file.addEventListener("change", (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target.result;
      img.style.display = "block"; // Mostrar la imagen en el círculo
    };
    reader.readAsDataURL(selectedFile);
  } else {
    img.src = defaultFile;
    img.style.display = "none"; // Ocultar el círculo si no hay imagen seleccionada
  }
});

// Agregar evento click al botón "Guardar"
guardarBtn.addEventListener("click", () => {
  // Obtener el nuevo nombre de la empresa ingresado por el usuario
  const nuevoNombreEmpresa = nombreEmpresaInput.value.trim();

  // Verificar si se realizó algún cambio
  if (nuevoNombreEmpresa === "" && !file.files[0]) {
    alert("No se han realizado cambios.");
    return;
  }

  // Guardar el nuevo nombre de la empresa en Realtime Database
  firebase
    .database()
    .ref(`/Usuarios/${uid}/Negocio`)
    .set(nuevoNombreEmpresa)
    .then(() => {
      console.log(
        "Nombre de empresa guardado exitosamente en Realtime Database"
      );
      alert("Se han guardado los cambios con éxito.");
    })
    .catch((error) => {
      console.log(
        "Error al guardar el nombre de la empresa en Realtime Database:",
        error
      );
    });

  if (selectedFile) {
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`${uid}/profile.jpg`);

    fileRef.put(selectedFile).then(() => {
      fileRef.getDownloadURL().then((url) => {
        img.src = url;
        img.style.display = "block"; // Mostrar la imagen en el círculo
        localStorage.setItem("imageURL", url); // Guardar la URL de imagen en el almacenamiento local
      });
    });
  } else {
    img.src = defaultFile;
    img.style.display = "none"; // Ocultar el círculo si no hay imagen seleccionada
    localStorage.removeItem("imageURL"); // Eliminar la URL de imagen del almacenamiento local
  }
});

// Agregar evento click al botón "Cancelar"
cancelarBtn.addEventListener("click", () => {
  // Restablecer el valor del campo de entrada con el nombre de la empresa obtenido
  firebase
    .database()
    .ref(`/Usuarios/${uid}/Negocio`)
    .once("value")
    .then((snapshot) => {
      const nombreEmpresa = snapshot.val();
      nombreEmpresaInput.value = nombreEmpresa || "";
    })
    .catch((error) => {
      console.log(
        "Error al obtener el nombre de la empresa desde Realtime Database:",
        error
      );
    });

  // Restablecer la imagen previa
  img.src = imageURL || defaultFile;
  img.style.display = imageURL ? "block" : "none";
});