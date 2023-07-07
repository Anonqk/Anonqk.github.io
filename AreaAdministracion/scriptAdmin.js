// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrzCRyT3S-SY7Vvh58jkPtstVSLMvsStQ",
  authDomain: "gestorinventarios-e37f6.firebaseapp.com",
  databaseURL: "https://gestorinventarios-e37f6-default-rtdb.firebaseio.com",
  projectId: "gestorinventarios-e37f6",
  storageBucket: "gestorinventarios-e37f6.appspot.com",
  messagingSenderId: "968579423727",
  appId: "1:968579423727:web:04d75d7fda53cfd8086a1a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const defaultFile = 'https://stonegatesl.com/wp-content/uploads/2021/01/avatar-300x300.jpg';

const file = document.getElementById('foto');
const img = document.getElementById('img');
file.addEventListener('change', e => {
  if (e.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e.target.result;
    }
    reader.readAsDataURL(e.target.files[0])
  } else {
    img.src = defaultFile;
  }
});

function uploadImage() {
  const ref = firebase.storage().ref();
  const file = document.querySelector("#photo").files(0);
  const name = new Date() + '-' + file.name;
  if (file == null) {
    alert("Debe seleccionar una imagen")
  } else {
    const metadata = {
      contentType: file.type
    }
    const task = ref.child(name).put(file, metadata);
    task
      .them(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        console.log(url);
        alert("Imagen upload successful");
        const imageElement = document.querySelector('#img');
        imageElement.src = url;
      })
  }
}