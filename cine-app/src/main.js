
import './style.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig.js';

import mostrarHome from './componentes/home.js';
import mostrarPeliculas from './componentes/peliculas.js';
import mostrarFavoritasPeliculas from './componentes/favoritasPeliculas.js';
import mostrarPerfil from './componentes/perfil.js';
import mostrarLogin from './componentes/login.js';
import mostrarRegistro from './componentes/registro.js';
import mostrarLogout from './componentes/logout.js';

function renderMenu(usuario) {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  let botones = [];

  if (usuario) {
    botones = [
      { texto: "Inicio", fn: mostrarHome },
      { texto: "Películas", fn: mostrarPeliculas },
      { texto: "Favoritas", fn: mostrarFavoritasPeliculas },
      { texto: "Perfil", fn: mostrarPerfil },
      { texto: "Salir", fn: mostrarLogout }
    ];
  } else {
    botones = [
      { texto: "Login", fn: mostrarLogin },
      { texto: "Registro", fn: mostrarRegistro }
    ];
  }

  botones.forEach(({ texto, fn }) => {
    const btn = document.createElement("button");
    btn.textContent = texto;
    btn.onclick = fn;
    menu.appendChild(btn);
  });
}

onAuthStateChanged(auth, (user) => {
  renderMenu(user);
  if (user) {
    mostrarHome();
  } else {
    mostrarLogin();
  }
});
