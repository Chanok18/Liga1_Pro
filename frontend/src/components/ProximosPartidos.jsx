import { useState, useEffect } from 'react'
import { partidoService } from '../services/apiService'
import '../styles/ProximosPartidos.css'

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

export function ProximosPartidos() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getByEstado('PROGRAMADO')
        // Tomar solo los primeros 3
        setPartidos((response.data || []).slice(0, 3))
      } catch (error) {
        console.error('Error cargando próximos partidos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPartidos()
  }, [])

  if (loading) {
    return <div className="section">Cargando próximos partidos...</div>
  }

  const formatFecha = (fecha) => {
    const date = new Date(fecha)
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    return `${dias[date.getDay()]} ${date.getDate()} ${meses[date.getMonth()]} • ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  return (
    <section className="proximos-partidos">
      <h2>Próximos Partidos</h2>
      <div className="partidos-grid">
        {partidos.map((partido) => (
          <div key={partido.id} className="partido-card-prox">
            <div className="partido-fecha">
              <span>⏰ {formatFecha(partido.fecha)}</span>
            </div>
            <div className="partido-matchup">
              <div className="equipo">
                <div className="logo">{getTeamAbbreviation(partido.equipoLocal?.nombre)}</div>
                <span>{partido.equipoLocal?.nombre}</span>
              </div>
              <span className="vs">vs</span>
              <div className="equipo">
                <div className="logo">{getTeamAbbreviation(partido.equipoVisitante?.nombre)}</div>
                <span>{partido.equipoVisitante?.nombre}</span>
              </div>
            </div>
            <div className="partido-estadio">
              <span>📍 {partido.estadio?.nombre}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
