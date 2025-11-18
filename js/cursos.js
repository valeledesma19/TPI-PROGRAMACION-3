
import { apiGet, apiPost } from "./api.js";

const usuario = JSON.parse(localStorage.getItem("usuario"));
if (!usuario) { alert("Inicia sesión"); window.location.href = "index.html"; }

const cursosList = document.getElementById("cursosList");
const misCursosList = document.getElementById("misCursosList");

const crearCardCurso = (c) => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${c.nombre}</h3>
    <p>${c.descripcion}</p>
    <p><strong>Duración:</strong> ${c.duracion}</p>
    <p><strong>Cupos:</strong> ${c.cupos}</p>
  `;

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "Inscribirme";

  btn.onclick = async () => {
    try {
      await apiPost("enrollments", {
        userId: usuario.id,
        courseId: c.id,
        estado: "pendiente"
      });
      alert("Solicitud enviada");
      await cargarMisCursos();
    } catch (err) {
      console.error(err);
      alert("Error al inscribirse");
    }
  };

  card.appendChild(btn);
  return card;
};

const crearCardInscripcion = (ins, curso) => {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <h3>${curso ? curso.nombre : "Curso"}</h3>
    <p><strong>Estado:</strong> ${ins.estado}</p>
  `;

  return card;
};

export const cargarCursos = async () => {
  try {
    const cursos = await apiGet("courses");
    if (cursosList) {
      cursosList.innerHTML = "";
      cursos.forEach(c => cursosList.appendChild(crearCardCurso(c)));
    }
  } catch (err) {
    console.error(err);
    if (cursosList) cursosList.innerHTML = "<p>Error al cargar cursos.</p>";
  }
};

export const cargarMisCursos = async () => {
  try {
    const [ins, cursos] = await Promise.all([
      apiGet("enrollments"),
      apiGet("courses")
    ]);

    const mias = ins.filter(i => i.userId == usuario.id);

    if (misCursosList) {
      misCursosList.innerHTML = "";
      mias.forEach(i => {
        const curso = cursos.find(c => c.id == i.courseId);
        misCursosList.appendChild(crearCardInscripcion(i, curso));
      });
    }
  } catch (err) {
    console.error(err);
    if (misCursosList) misCursosList.innerHTML = "<p>Error al cargar tus cursos.</p>";
  }
};

(async function init() {
  await cargarCursos();
  await cargarMisCursos();
})();
