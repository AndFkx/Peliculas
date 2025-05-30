import { auth, db } from '../firebaseConfig.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default async function mostrarPerfil() {
  const app = document.getElementById('app');
  app.innerHTML = `<h2>Perfil del Usuario</h2><p id="cargando">Cargando...</p>`;

  const uid = auth.currentUser?.uid;
  const correo = auth.currentUser?.email;

  if (!uid) {
    app.innerHTML = '<p style="color:red;">Error: Usuario no autenticado</p>';
    return;
  }

  try {
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      app.innerHTML = '<p style="color:red;">Usuario no encontrado en Firestore</p>';
      return;
    }

    const { nombre = '', fecha = '', telefono = '' } = docSnap.data();

    app.innerHTML = `
      <h2>Perfil</h2>
      <div style="max-width: 400px; margin: auto; background-color: #1e1e1e; padding: 20px; border-radius: 12px; color: white;">
        <p><strong>Correo:</strong> ${correo}</p>
        <label>Nombre</label>
        <input id="nombre" value="${nombre}" placeholder="Nombre completo" style="padding:10px; margin-bottom:10px; width:100%;" />

        <label>Fecha de nacimiento</label>
        <input id="fecha" type="date" value="${fecha}" style="padding:10px; margin-bottom:10px; width:100%;" />

        <label>Teléfono</label>
        <input id="telefono" type="tel" value="${telefono}" style="padding:10px; margin-bottom:20px; width:100%;" />

        <button id="guardar" style="padding: 10px; width:100%; background:#e50914; color:white; font-weight:bold; border:none; border-radius:8px;">
          Guardar cambios
        </button>
      </div>
    `;

    document.getElementById('guardar').addEventListener('click', async () => {
      const nuevoNombre = document.getElementById('nombre').value.trim();
      const nuevaFecha = document.getElementById('fecha').value;
      const nuevoTelefono = document.getElementById('telefono').value.trim();

      if (!nuevoNombre || !nuevaFecha || !nuevoTelefono) {
        alert("Por favor completa todos los campos.");
        return;
      }

      try {
        await updateDoc(docRef, {
          nombre: nuevoNombre,
          fecha: nuevaFecha,
          telefono: nuevoTelefono,
        });
        alert('Datos actualizados correctamente');
      } catch (error) {
        console.error(error);
        alert('Error al actualizar los datos');
      }
    });

  } catch (err) {
    app.innerHTML = `<p style="color: red;">Error al cargar perfil: ${err.message}</p>`;
  }
}
