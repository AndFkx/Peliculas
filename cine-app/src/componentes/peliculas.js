import { auth, db } from '../firebaseConfig.js';
import { addDoc, collection, setDoc, doc } from 'firebase/firestore';

// ✅ Tu API key real de TMDb
const API_KEY = '984cc0fd971fe6c3a595c2f9f1d9cd66';

export default async function mostrarPeliculas() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h2>Películas Populares</h2>
    <div style="margin-bottom: 16px; text-align: center;">
      <input type="number" id="pagina" value="1" min="1" style="padding: 10px; width: 100px; margin-right: 10px;" />
      <button id="buscar" style="padding: 10px;">Buscar</button>
    </div>
    <div id="lista" style="display: grid; gap: 16px;"></div>
  `;

  document.getElementById("buscar").addEventListener("click", async () => {
    const pagina = document.getElementById("pagina").value;
    await cargarPeliculas(pagina);
  });

  await cargarPeliculas(1);
}

async function cargarPeliculas(pagina) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "<p>Cargando películas...</p>";

  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-MX&page=${pagina}`);
    const data = await res.json();
    const peliculas = data.results;

    lista.innerHTML = "";
    for (const pelicula of peliculas) {
      const div = document.createElement("div");
      div.style.border = "1px solid #333";
      div.style.borderRadius = "12px";
      div.style.padding = "10px";
      div.style.backgroundColor = "#1e1e1e";
      div.style.color = "white";
      div.style.textAlign = "center";

      div.innerHTML = `
        <h3>${pelicula.title}</h3>
        <img src="https://image.tmdb.org/t/p/w300${pelicula.poster_path}" alt="${pelicula.title}" style="border-radius: 10px; max-width: 100%; height: auto;" />
        <p style="margin-top: 8px;">${pelicula.overview || "Sin descripción disponible."}</p>
        <button class="guardarFavorita" style="margin-top: 10px;">❤️ Guardar</button>
      `;

      div.querySelector(".guardarFavorita").addEventListener("click", () => guardarFavorita(pelicula));
      lista.appendChild(div);
    }

    await guardarBusqueda(pagina);
  } catch (error) {
    lista.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

async function guardarBusqueda(pagina) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  try {
    await addDoc(collection(db, "busquedasPeliculas"), {
      uid,
      pagina: parseInt(pagina),
      fecha: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error al guardar búsqueda:", error);
  }
}

async function guardarFavorita(pelicula) {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const id = `${uid}_${pelicula.id}`;

  try {
    await setDoc(doc(db, "favoritasPeliculas", id), {
      uid,
      idPelicula: pelicula.id,
      titulo: pelicula.title,
      descripcion: pelicula.overview,
      poster: pelicula.poster_path,
      fechaGuardado: new Date().toISOString()
    });
    alert(`Guardado: ${pelicula.title}`);
  } catch (error) {
    console.error("Error al guardar favorita:", error);
    alert("Error al guardar la película.");
  }
}
