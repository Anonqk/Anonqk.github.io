window.addEventListener("DOMContentLoaded", function () {
  var table = document.querySelector("table");
  table.addEventListener("scroll", function () {
    var thead = table.querySelector("thead");
    thead.style.transform = "translateY(" + table.scrollTop + "px)";
  });
});
