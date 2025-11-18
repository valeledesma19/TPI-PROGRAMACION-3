
import { apiGet } from "./api.js";

const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario || usuario.role !== "ADMIN") {
  alert("Acceso no autorizado");
  window.location.href = "index.html";
}

const ctxEl = document.getElementById("chartEstados");
const ctx = ctxEl ? ctxEl.getContext("2d") : null;
let chart = null;

(async function cargarDashboard() {
  try {
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

    if (!ctx) return;

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ["#f59e0b","#10b981","#ef4444"]
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error(err);
  }
})();
