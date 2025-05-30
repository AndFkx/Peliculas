import { auth, db } from '../firebaseConfig.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function mostrarFavoritasPeliculas() {
  const app = document.getElementById("app");
  app.innerHTML = `<h2>Películas Favoritas</h2><p id="cargando">Cargando...</p>`;

  const uid = auth.currentUser?.uid;
  if (!uid) {
    app.innerHTML = "<p>Debes iniciar sesión para ver tus favoritas.</p>";
    return;
  }

  try {
    const q = query(collection(db, "favoritasPeliculas"), where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      app.innerHTML = "<p>No tienes películas guardadas.</p>";
      return;
    }

    const lista = document.createElement("div");
    lista.style.display = "grid";
    lista.style.gap = "16px";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.style.border = "1px solid #ddd";
      div.style.borderRadius = "12px";
      div.style.padding = "10px";
      div.style.background = "#fff";
      div.innerHTML = `
        <h3>${data.titulo}</h3>
        <img src="https://image.tmdb.org/t/p/w200${data.poster}" alt="${data.titulo}" />
        <p>${data.descripcion}</p>
      `;
      lista.appendChild(div);
    });

    app.innerHTML = `<h2>Películas Favoritas</h2>`;
    app.appendChild(lista);
  } catch (error) {
    app.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
  }
}
