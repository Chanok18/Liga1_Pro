const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function buildApiError(response, fallbackMessage) {
  let message = fallbackMessage
  try {
    const data = await response.json()
    if (data?.message) {
      message = data.message
    }
  } catch (error) {
    // ignore parsing errors and keep fallback message
  }
  return new Error(message)
}

export async function fetchPartidosEnVivo() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/partidos/en-vivo`)
    if (!response.ok) {
      throw await buildApiError(response, 'Error fetching partidos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function fetchEquipos() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/equipos`)
    if (!response.ok) {
      throw await buildApiError(response, 'Error fetching equipos')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function fetchTablaPosiciones() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tabla-posiciones`)
    if (!response.ok) {
      throw await buildApiError(response, 'Error fetching tabla posiciones')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function fetchEstadisticas(partidoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/estadisticas/partido/${partidoId}`)
    if (!response.ok) {
      throw await buildApiError(response, 'Error fetching estadisticas')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function fetchEquipoFavoritoUsuario(usuarioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/equipo-favorito`)
    if (response.status === 204) {
      return null
    }
    if (!response.ok) {
      throw await buildApiError(response, 'Error fetching equipo favorito')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function actualizarEquipoFavoritoUsuario(usuarioId, equipoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/equipo-favorito/${equipoId}`, {
      method: 'PUT'
    })
    if (!response.ok) {
      throw await buildApiError(response, 'Error updating equipo favorito')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function fetchInicioFavoritoUsuario(usuarioId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/usuarios/${usuarioId}/inicio-favorito`)
    if (!response.ok) {
      throw await buildApiError(response, 'No se pudo cargar informacion personalizada')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function loginUsuario(identifier, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ identifier, password })
    })
    if (!response.ok) {
      throw await buildApiError(response, 'No se pudo iniciar sesion')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function registrarUsuario(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    if (!response.ok) {
      throw await buildApiError(response, 'No se pudo registrar usuario')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
