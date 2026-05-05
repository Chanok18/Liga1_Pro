const API_BASE_URL = 'http://localhost:8080'

export async function fetchPartidosEnVivo() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/partidos/en-vivo`)
    if (!response.ok) {
      throw new Error('Error fetching partidos')
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
      throw new Error('Error fetching equipos')
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
      throw new Error('Error fetching tabla posiciones')
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
      throw new Error('Error fetching estadisticas')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
