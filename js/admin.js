import { apiGet, apiPost, apiPut, apiDelete } from "./api.js";

const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) { alert("Inicia sesión"); window.location.href = "index.html"; }
if (usuario.role !== "ADMIN") { alert("Acceso no autorizado"); window.location.href = "index.html"; }

const form = document.getElementById("formCourse");
const btnNuevo = document.getElementById("btnNuevo");
const inscriptionsDiv = document.getElementById("inscriptionsList");
const chartCanvasEl = document.getElementById("estadoChart");
const chartCanvas = chartCanvasEl ? chartCanvasEl.getContext("2d") : null;

let currentChart = null;

const limpiarForm = () => form.reset();

const cargarCursosParaEdicion = async () => {
  try {
    return await apiGet("courses");
  } catch {
    return [];
  }
};

form.addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("courseId").value;
  const nombre = document.getElementById("nombreCurso").value.trim();
  const descripcion = document.getElementById("descripcionCurso").value.trim();
  const duracion = document.getElementById("duracionCurso").value.trim();
  const cupos = Number(document.getElementById("cuposCurso").value) || 0;

  try {
    if (id) {
      await apiPut("courses", id, { nombre, descripcion, duracion, cupos });
      alert("Curso actualizado");
    } else {
      await apiPost("courses", { nombre, descripcion, duracion, cupos });
      alert("Curso creado");
    }
    limpiarForm();
    await cargarInscripciones();
    await cargarDashboard();
  } catch (err) {
    console.error(err);
    alert("Error al guardar curso");
  }
});

btnNuevo.addEventListener("click", () => form.reset());

const crearCardInscription = (ins, cursos, usuarios) => {
  const card = document.createElement("div");
  card.className = "card";

  const curso = cursos.find(c => c.id == ins.courseId) || {};
  const user = usuarios.find(u => u.id == ins.userId) || {};

  card.innerHTML = `
    <h3>${user.nombre || "Usuario"}</h3>
    <p><strong>Curso:</strong> ${curso.nombre || "-"}</p>
    <p><strong>Estado:</strong> ${ins.estado}</p>
  `;

  if (ins.estado === "pendiente") {
    const btnA = document.createElement("button");
    btnA.className = "btn";
    btnA.textContent = "Aprobar";

    btnA.onclick = async () => {
      try {
        await apiPut("enrollments", ins.id, { ...ins, estado: "aprobado" });
        await cargarInscripciones();
        await cargarDashboard();
      } catch (err) {
        console.error(err);
        alert("Error al aprobar");
      }
    };

    const btnR = document.createElement("button");
    btnR.className = "btn secondary";
    btnR.textContent = "Rechazar";

    btnR.onclick = async () => {
      try {
        await apiPut("enrollments", ins.id, { ...ins, estado: "rechazado" });
        await cargarInscripciones();
        await cargarDashboard();
      } catch (err) {
        console.error(err);
        alert("Error al rechazar");
      }
    };

    card.append(btnA, btnR);
  }

  return card;
};

export const cargarInscripciones = async () => {
  try {
    const [inscriptions, courses, users] = await Promise.all([
      apiGet("enrollments"),
      apiGet("courses"),
      apiGet("users")
    ]);

    inscriptionsDiv.innerHTML = "";
    inscriptions.forEach(i =>
      inscriptionsDiv.appendChild(crearCardInscription(i, courses, users))
    );

  } catch (err) {
    console.error(err);
    if (inscriptionsDiv) inscriptionsDiv.innerHTML = "<p>Error al cargar inscripciones.</p>";
  }
};

export const cargarDashboard = async () => {
  try {
    const ins = await apiGet("enrollments");

    const resumen = ins.reduce((acc, cur) => {
      acc[cur.estado] = (acc[cur.estado] || 0) + 1;
      return acc;
    }, {});

    if (!chartCanvas) return;

    if (currentChart) currentChart.destroy();

    currentChart = new Chart(chartCanvas, {
      type: "pie",
      data: {
        labels: ["Pendiente", "Aprobado", "Rechazado"],
        datasets: [{
          data: [
            resumen.pendiente || 0,
            resumen.aprobado || 0,
            resumen.rechazado || 0
          ],
          backgroundColor: ["#f59e0b", "#10b981", "#ef4444"]
        }]
      },
      options: { responsive: true }
    });
  } catch (err) {
    console.error(err);
  }
};

(async function init() {
  await cargarCursosParaEdicion();
  await cargarInscripciones();
  await cargarDashboard();
})();
