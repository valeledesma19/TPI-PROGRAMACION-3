import { apiGet } from "./api.js";

const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario || usuario.role !== "ADMIN") {
  alert("Acceso no autorizado");
  window.location.href = "index.html";
}

const ctx = document.getElementById("chartEstados").getContext("2d");
let chart = null;

(async function cargarDashboard() {
  const ins = await apiGet("enrollments");

  const resumen = ins.reduce((a, i) => {
    a[i.estado] = (a[i.estado] || 0) + 1;
    return a;
  }, {});

  const labels = ["Pendiente", "Aprobado", "Rechazado"];
  const data = [
    resumen.pendiente || 0,
    resumen.aprobado || 0,
    resumen.rechazado || 0
  ];

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ["#f59e0b","#10b981","#ef4444"]
      }]
    }
  });
})();
