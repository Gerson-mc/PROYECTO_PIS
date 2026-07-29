document.addEventListener('DOMContentLoaded', () => {
  // 1. Verificar si existe la sesión guardada en localStorage
  const sesionGuardada = localStorage.getItem('usuarioLogueado');

  if (!sesionGuardada) {
    // Si no hay datos, el usuario no se ha autenticado -> Redirigir al Login
    window.location.href = 'index.html';
    return;
  }

  // Convertimos el texto JSON guardado a un objeto JavaScript
  const usuario = JSON.parse(sesionGuardada);

  // 2. Presentar el nombre del usuario logueado en la barra superior
  const userDisplay = document.getElementById('user-display');
  if (userDisplay) {
    userDisplay.innerHTML = `<i class="bi bi-person-circle"></i> ${usuario.nombres} ${usuario.apellidos}`;
  }

  // 3. Configurar el botón de Cerrar Sesión
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Eliminamos los datos guardados en el navegador
      localStorage.removeItem('usuarioLogueado');
      // Redirigimos al inicio de sesión
      window.location.href = 'index.html';
    });
  }

  // 4. Configurar el cambio de tema (Claro / Oscuro) en el Dashboard
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(themeIcon, currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(themeIcon, newTheme);
    });
  }
});

function updateThemeIcon(iconElement, theme) {
  if (iconElement) {
    iconElement.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }
}