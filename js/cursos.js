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
      cargarMisCursos();
    } catch (err) {
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

const cargarCursos = async () => {
  const cursos = await apiGet("courses");
  cursosList.innerHTML = "";
  cursos.forEach(c => cursosList.appendChild(crearCardCurso(c)));
};

const cargarMisCursos = async () => {
  const [ins, cursos] = await Promise.all([
    apiGet("enrollments"),
    apiGet("courses")
  ]);

  const mias = ins.filter(i => i.userId == usuario.id);

  misCursosList.innerHTML = "";

  mias.forEach(i => {
    const curso = cursos.find(c => c.id == i.courseId);
    misCursosList.appendChild(crearCardInscripcion(i, curso));
  });
};

(async function init() {
  await cargarCursos();
  await cargarMisCursos();
})();
