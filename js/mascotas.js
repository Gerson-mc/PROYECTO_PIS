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
          <!-- Menu Desplegable para cambiar estado directamente -->
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

// Función auxiliar para el color del selector según el estado
function obtenerClaseEstado(estado) {
  if (estado === 'PERDIDO') return 'estado-perdido';
  if (estado === 'ENCONTRADO') return 'estado-encontrado';
  if (estado === 'REUNIFICADO') return 'estado-reunificado';
  return '';
}

// Cambiar estado mediante petición PUT
async function cambiarEstadoMascota(id, nuevoEstado) {
  try {
    const res = await fetch('api/mascotas.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_mascota: id, estado: nuevoEstado })
    });

    const json = await res.json();
    
    if (json.success) {
      // Recargar para actualizar estilos visuales
      cargarMascotas();
    } else {
      alert(json.error || 'No se pudo actualizar el estado');
    }
  } catch (err) {
    console.error('Error al actualizar estado:', err);
  }
}