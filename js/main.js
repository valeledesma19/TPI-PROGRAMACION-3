const menu = document.getElementById("menu");
const usuario = JSON.parse(localStorage.getItem("usuario"));

const crearBtn = (txt, href, fn) => {
  const b = document.createElement("button");
  b.textContent = txt;
  if (href) b.onclick = () => window.location.href = href;
  if (fn) b.onclick = fn;
  return b;
};

if (menu) {
  menu.innerHTML = "";
  if (!usuario) {
    menu.appendChild(crearBtn("Iniciar sesión","index.html"));
    menu.appendChild(crearBtn("Registrarse","registro.html"));
  } else {
    if (usuario.role === "ADMIN") {
      menu.appendChild(crearBtn("Admin","admin.html"));
      menu.appendChild(crearBtn("Dashboard","dashboard.html"));
    } else {
      menu.appendChild(crearBtn("Cursos","cursos.html"));
    }
    menu.appendChild(crearBtn("Cerrar sesión", null, () => {
      localStorage.removeItem("usuario");
      window.location.href = "index.html";
    }));
  }
}