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

const firebaseConfig = {
  apiKey: "AIzaSyDrzCRyT3S-SY7Vvh58jkPtstVSLMvsStQ",
  authDomain: "gestorinventarios-e37f6.firebaseapp.com",
  databaseURL: "https://gestorinventarios-e37f6-default-rtdb.firebaseio.com",
  projectId: "gestorinventarios-e37f6",
  storageBucket: "gestorinventarios-e37f6.appspot.com",
  messagingSenderId: "968579423727",
  appId: "1:968579423727:web:04d75d7fda53cfd8086a1a"
};

firebase.initializeApp(firebaseConfig);

var fileText = document.querySelector(".fileText");
var uploadPercentage = document.querySelector(".uploadPercentage")
var progress = document.querySelector(".progress");
var percentVal;
var fileItem;
var fileName;

function getFile(e){
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}

function uploadImage(){
  let storageRef = firebase.storage().ref("images/"+fileName);
  let uploadTask = storageRef.put(fileItem);

  uploadTask.on("state_changed", (snapshot) => {
    console.log(snapshot);
    percentVal = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
    console.log(percentVal);
    uploadPercentage.innerHTML = percentVal+"%";
    progress.style.width = percentVal+"%";
  },(error) =>{
    console.log("Error is ", error);
  },()=>{
    uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
      console.log("URL", url)

      if(url != ""){
        img.setAttribute("scr",url);
        img.style.display="block";
      }
    }) 
  })
}
