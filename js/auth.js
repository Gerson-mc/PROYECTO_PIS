// ==========================================
// CONTROL DEL MOSTRAR / OCULTAR CONTRASEÑA
// ==========================================
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eye-icon');

if (togglePasswordBtn && passwordInput && eyeIcon) {
  togglePasswordBtn.addEventListener('click', () => {
    // Verificamos si el tipo actual es 'password'
    const isPassword = passwordInput.getAttribute('type') === 'password';
    
    // Cambiamos el tipo de input
    passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
    
    // Alternamos el icono del ojo abierto / cerrado
    eyeIcon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
  });
}

// ==========================================
// CONTROL DE MODO CLARO / MODO OSCURO
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Cargar tema guardado previamente en el navegador
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  if (themeIcon) {
    themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }
}

// ---------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('form-login');
  const mensajeError = document.getElementById('mensaje-error');

  if (!formLogin) return;

  // Escuchamos el evento cuando el usuario envía el formulario
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue por defecto

    // Ocultamos mensajes de error previos
    mensajeError.style.display = 'none';

    // Capturamos los valores ingresados
    const usuario = document.getElementById('usuario').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      // Hacemos la petición HTTP POST a nuestro script PHP
      const response = await fetch('api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Indicamos que enviamos formato JSON
        },
        body: JSON.stringify({ usuario, password }) // Convertimos el objeto JS a texto JSON
      });

      // Leemos la respuesta devuelta por el PHP en formato JSON
      const result = await response.json();
    
      // Evaluamos la respuesta
      if (result.success) {
        // Guardamos los datos del usuario en el navegador (localStorage) para mantener la sesión
        localStorage.setItem('usuarioLogueado', JSON.stringify(result.data));
        
        // Redirigimos al panel principal
        window.location.href = 'dashboard.html';
      } else {
        // Mostramos el mensaje de error que devolvió PHP
        mensajeError.textContent = result.error || 'Credenciales incorrectas.';
        mensajeError.style.display = 'block';
      }

    } catch (error) {
      console.error('Error al intentar iniciar sesión:', error);
      mensajeError.textContent = 'Error de conexión con el servidor.';
      mensajeError.style.display = 'block';
    }
  });
});