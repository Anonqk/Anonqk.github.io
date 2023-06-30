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
      /*

        ACA SE AÑADEN LAS ACCIONES CON LA BASE DE DATOS

        */
      console.log("Formulario válido.");
    }
  });
}
