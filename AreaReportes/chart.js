// obtener los elementos del chart
const card = document.getElementById("card-stockbajo");
const chartCanvas = document.getElementById("myChart");

// REDIMENSIONA EL CHART
function resizeChart() {
  // OBTENER TAMAÑO DE LA TARJETA
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;

  // CAMBIAR EL TAMAÑO DEL CHART POR EL DE LA TARJETA
  chartCanvas.width = cardWidth;
  chartCanvas.height = cardHeight;
}

// ESCUCHA EL CAMBIO DEL TAMAÑO DE LA TARJETA
window.addEventListener("resize", resizeChart);

// INICIA FUNCION
resizeChart();

var data = {
  labels: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  datasets: [
    {
      label: "Ventas",
      data: [120, 150, 180, 90, 200, 140, 160, 190, 210, 170, 130, 220],
      backgroundColor: "rgba(0, 88, 200, 0.5)", // Gris oscuro
      borderColor: "rgba(0, 0, 0, 0.5)", // Negro
      borderWidth: 1,
    },
  ],
};

// OPCIONES DEL GRAFICO
var options = {
  indexAxis: "y",
  scales: {
    x: {
      beginAtZero: true,
    },
  },
  animation: {
    tension: {
      duration: 1000,
      easing: "easeInOutQuart",
      from: 1,
      to: 0,
      loop: true,
    },
    delay: function (context) {
      return context.dataset.dataIndex * 100;
    },
  },
};

// CREAR GRAFICO
var ctx = document.getElementById("myChart").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: data,
  options: options,
});
