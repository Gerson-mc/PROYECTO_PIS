document.addEventListener('DOMContentLoaded', () => {
  cargarUsuarios();
  setupModalEvents();
});

// Obtener registros vía GET
async function cargarUsuarios() {
  try {
    const res = await fetch('api/usuarios.php');
    const data = await res.json();

    const tbody = document.getElementById('tabla-usuarios-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.error) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">${data.error}</td></tr>`;
      return;
    }

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay usuarios registrados.</td></tr>`;
      return;
    }

    data.forEach(u => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td><strong>#${u.id_usuario}</strong></td>
        <td>${u.nombres} ${u.apellidos}</td>
        <td>${u.cedula}</td>
        <td><code>${u.login}</code></td>
        <td><span>••••••••</span></td>
        <td>
          <span class="badge ${u.estado === 'ACTIVO' ? 'badge-activo' : 'badge-inactivo'}">
            ${u.estado}
          </span>
        </td>
        <td>
          <button onclick="desactivarUsuario(${u.id_usuario})" class="btn-action btn-edit" title="Inactivar">
            <i class="bi bi-slash-circle"></i>
          </button>
          <button onclick="eliminarUsuario(${u.id_usuario})" class="btn-action btn-delete" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(fila);
    });

  } catch (err) {
    console.error('Error al obtener la lista de usuarios:', err);
  }
}

// Configuración de Apertura, Cierre y Envío del Formulario Modal
function setupModalEvents() {
  const modal = document.getElementById('modal-usuario');
  const btnNuevo = document.getElementById('btn-nuevo');
  const btnCerrar = document.getElementById('btn-cerrar-modal');
  const btnCancelar = document.getElementById('btn-cancelar');
  const formUsuario = document.getElementById('form-usuario');

  if (!modal) return;

  // Abrir Modal
  btnNuevo.addEventListener('click', () => {
    formUsuario.reset();
    modal.classList.add('active');
  });

  // Cerrar Modal
  const cerrarModal = () => modal.classList.remove('active');
  btnCerrar.addEventListener('click', cerrarModal);
  btnCancelar.addEventListener('click', cerrarModal);

  // Cerrar al hacer clic fuera del recuadro
  window.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Procesar Guardado (POST)
  formUsuario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      nombres: document.getElementById('modal-nombres').value.trim(),
      apellidos: document.getElementById('modal-apellidos').value.trim(),
      cedula: document.getElementById('modal-cedula').value.trim(),
      login: document.getElementById('modal-login').value.trim(),
      clave: document.getElementById('modal-clave').value.trim(),
      estado: 'ACTIVO'
    };

    try {
      const res = await fetch('api/usuarios.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario)
      });

      const json = await res.json();

      if (json.success) {
        alert(json.message);
        cerrarModal();
        cargarUsuarios(); // Recargar la tabla dinámicamente
      } else {
        alert(json.error || 'Ocurrió un error al guardar');
      }
    } catch (err) {
      console.error('Error al registrar usuario:', err);
    }
  });
}

// Inactivar (PUT)
async function desactivarUsuario(id) {
  if (!confirm('¿Deseas cambiar el estado de este usuario a INACTIVO?')) return;

  try {
    const res = await fetch('api/usuarios.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: id })
    });

    const json = await res.json();
    alert(json.message || json.error);
    cargarUsuarios();
  } catch (err) {
    console.error('Error al inactivar:', err);
  }
}

// Eliminar (DELETE)
async function eliminarUsuario(id) {
  if (!confirm('¿Seguro que deseas eliminar definitivamente este usuario?')) return;

  try {
    const res = await fetch(`api/usuarios.php?id_usuario=${id}`, {
      method: 'DELETE'
    });

    const json = await res.json();
    alert(json.message || json.error);
    cargarUsuarios();
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
}