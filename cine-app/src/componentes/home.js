export default function mostrarHome() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h2>Bienvenido a la App de Cine</h2>
      <p>Explora películas populares y guarda tus favoritas 🎬</p>
    </div>
  `;
}
