
import { apiGet, apiPost } from "./api.js";

const formLogin = document.getElementById("formLogin");
const formRegister = document.getElementById("formRegister");

const saveUser = u => localStorage.setItem("usuario", JSON.stringify(u));

if (formLogin) {
  formLogin.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const pass  = document.getElementById("password").value.trim();
    try {
      const users = await apiGet("users");
      const user = users.find(u => u.email === email && u.password === pass);
      if (!user) return alert("Usuario o contraseña incorrectos");
      saveUser(user);
      window.location.href = user.role === "ADMIN" ? "admin.html" : "cursos.html";
    } catch (err) {
      console.error(err); alert("Error al iniciar sesión");
    }
  });
}

if (formRegister) {
  formRegister.addEventListener("submit", async e => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email  = document.getElementById("emailReg").value.trim();
    const pass   = document.getElementById("passwordReg").value.trim();
    if (!nombre || !email || pass.length < 4) return alert("Completá los campos correctamente");
    try {
      await apiPost("users", { nombre, email, password: pass, role: "USUARIO" });
      alert("Registro exitoso. Iniciá sesión.");
      window.location.href = "index.html";
    } catch (err) {
      console.error(err); alert("Error al registrarse");
    }
  });
}
