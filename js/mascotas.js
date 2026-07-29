document.addEventListener('DOMContentLoaded', () => {
  cargarMascotas();
  setupMascotaModalEvents();
});

// Cargar mascotas con Selector de Estado dinámico
async function cargarMascotas() {
  try {
    const res = await fetch('api/mascotas.php');
    const data = await res.json();

    const tbody = document.getElementById('tabla-mascotas-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (data.error) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">${data.error}</td></tr>`;
      return;
    }

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No hay mascotas registradas.</td></tr>`;
      return;
    }

    data.forEach(m => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td><strong>#${m.id_mascota}</strong></td>
        <td>${m.nombre}</td>
        <td>${m.especie} (${m.raza})</td>
        <td>${m.color}</td>
        <td>${m.lugar}</td>
        <td>
          <select class="select-estado ${obtenerClaseEstado(m.estado)}" onchange="cambiarEstadoMascota(${m.id_mascota}, this.value)">
            <option value="PERDIDO" ${m.estado === 'PERDIDO' ? 'selected' : ''}>PERDIDO</option>
            <option value="ENCONTRADO" ${m.estado === 'ENCONTRADO' ? 'selected' : ''}>ENCONTRADO</option>
            <option value="REUNIFICADO" ${m.estado === 'REUNIFICADO' ? 'selected' : ''}>REUNIFICADO</option>
          </select>
        </td>
        <td>${m.reportado_por || 'Anónimo'}</td>
        <td>
          <button onclick="eliminarMascota(${m.id_mascota})" class="btn-action btn-delete" title="Eliminar">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;

      tbody.appendChild(fila);
    });

  } catch (err) {
    console.error('Error al cargar mascotas:', err);
  }
}

// Eventos de apertura, cierre y guardado (POST) del Modal de Mascotas
function setupMascotaModalEvents() {
  const modal = document.getElementById('modal-mascota');
  const btnNueva = document.getElementById('btn-nueva-mascota');
  const btnCerrar = document.getElementById('btn-cerrar-modal-mascota');
  const btnCancelar = document.getElementById('btn-cancelar-mascota');
  const formMascota = document.getElementById('form-mascota');

  if (!modal || !btnNueva) return;

  // Abrir Modal
  btnNueva.addEventListener('click', () => {
    formMascota.reset();
    modal.classList.add('active');
  });

  // Cerrar Modal
  const cerrarModal = () => modal.classList.remove('active');
  if (btnCerrar) btnCerrar.addEventListener('click', cerrarModal);
  if (btnCancelar) btnCancelar.addEventListener('click', cerrarModal);

  // Cerrar al hacer clic fuera del recuadro del modal
  window.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Procesar Guardado (POST)
  formMascota.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener información del usuario logueado
    const sesionGuardada = localStorage.getItem('usuarioLogueado');
    const usuarioLogueado = sesionGuardada ? JSON.parse(sesionGuardada) : null;

    const nuevaMascota = {
      nombre: document.getElementById('modal-mascota-nombre').value.trim(),
      especie: document.getElementById('modal-mascota-especie').value,
      raza: document.getElementById('modal-mascota-raza').value.trim() || 'Mestizo',
      color: document.getElementById('modal-mascota-color').value.trim(),
      estado: document.getElementById('modal-mascota-estado').value,
      lugar: document.getElementById('modal-mascota-lugar').value.trim(),
      id_usuario: usuarioLogueado ? usuarioLogueado.id_usuario : null
    };

    try {
      const res = await fetch('api/mascotas.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaMascota)
      });

      const json = await res.json();

      if (json.success) {
        cerrarModal();
        cargarMascotas(); // Recarga la tabla de mascotas
      } else {
        alert(json.error || 'Ocurrió un error al registrar la mascota');
      }
    } catch (err) {
      console.error('Error al registrar mascota:', err);
    }
  });
}

// Auxiliar para el color del selector según estado
function obtenerClaseEstado(estado) {
  if (estado === 'PERDIDO') return 'estado-perdido';
  if (estado === 'ENCONTRADO') return 'estado-encontrado';
  if (estado === 'REUNIFICADO') return 'estado-reunificado';
  return '';
}

// Cambiar estado (PUT)
async function cambiarEstadoMascota(id, nuevoEstado) {
  try {
    const res = await fetch('api/mascotas.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_mascota: id, estado: nuevoEstado })
    });

    const json = await res.json();
    
    if (json.success) {
      cargarMascotas();
    } else {
      alert(json.error || 'No se pudo actualizar el estado');
    }
  } catch (err) {
    console.error('Error al actualizar estado:', err);
  }
}

// Eliminar mascota (DELETE)
async function eliminarMascota(id) {
  if (!confirm('¿Seguro que deseas eliminar este reporte de mascota?')) return;

  try {
    const res = await fetch(`api/mascotas.php?id_mascota=${id}`, {
      method: 'DELETE'
    });

    const json = await res.json();
    alert(json.message || json.error);
    cargarMascotas();
  } catch (err) {
    console.error('Error al eliminar mascota:', err);
  }
}