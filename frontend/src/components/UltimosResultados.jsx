import { useState, useEffect } from 'react'
import { partidoService } from '../services/apiService'
import '../styles/UltimosResultados.css'

const getTeamAbbreviation = (name) => {
  if (!name) return '??'
  const words = name.trim().split(' ').filter(Boolean)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

export function UltimosResultados() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getByEstado('FINALIZADO')
        // Tomar solo los primeros 3 en orden inverso
        setPartidos((response.data || []).reverse().slice(0, 3))
      } catch (error) {
        console.error('Error cargando últimos resultados:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPartidos()
  }, [])

  if (loading) {
    return <div className="section">Cargando resultados...</div>
  }

  const formatFecha = (fecha) => {
    const date = new Date(fecha)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${date.getDate()} ${meses[date.getMonth()]}`
  }

  return (
    <section className="ultimos-resultados">
      <div className="resultados-header">
        <h2>Últimos Resultados</h2>
        <a href="#" className="ver-todos">Ver todos →</a>
      </div>
      <div className="resultados-grid">
        {partidos.map((partido) => (
          <div key={partido.id} className="resultado-card">
            <div className="resultado-fecha">
              {formatFecha(partido.fecha)}
            </div>
            <div className="resultado-match">
              <div className="equipo">
                <div className="logo">{getTeamAbbreviation(partido.equipoLocal?.nombre)}</div>
                <span>{partido.equipoLocal?.nombre}</span>
              </div>
              <div className="marcador-resultado">{partido.golesLocal} - {partido.golesVisitante}</div>
              <div className="equipo">
                <div className="logo">{getTeamAbbreviation(partido.equipoVisitante?.nombre)}</div>
                <span>{partido.equipoVisitante?.nombre}</span>
              </div>
            </div>
            <div className="resultado-estadio">
              <span>📍 {partido.estadio?.nombre}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
