import { useState, useEffect } from 'react'
import { partidoService } from '../services/apiService'
import '../styles/PartidosEnVivo.css'

const getTeamAbbreviation = (name) => {
  if (!name) return '??'
  const words = name.trim().split(' ').filter(Boolean)
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join('')
}

export function PartidosEnVivo() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPartidos = async () => {
      try {
        const response = await partidoService.getByEstado('EN_VIVO')
        const liveMatches = response.data || []
        if (liveMatches.length === 0) {
          setPartidos([
            {
              id: 'demo-en-vivo',
              equipoLocal: { nombre: 'Universitario' },
              equipoVisitante: { nombre: 'Alianza Lima' },
              golesLocal: 1,
              golesVisitante: 0,
              minuto: '58',
              estadio: { nombre: 'Estadio Nacional' },
            },
            {
              id: 'demo-en-vivo-2',
              equipoLocal: { nombre: 'Sporting Cristal' },
              equipoVisitante: { nombre: 'FBC Melgar' },
              golesLocal: 0,
              golesVisitante: 1,
              minuto: '23',
              estadio: { nombre: 'Alberto Gallardo' },
            },
          ])
        } else {
          setPartidos(liveMatches)
        }
      } catch (error) {
        console.error('Error cargando partidos en vivo:', error)
        setPartidos([
          {
            id: 'demo-en-vivo',
            equipoLocal: { nombre: 'Universitario' },
            equipoVisitante: { nombre: 'Alianza Lima' },
            golesLocal: 1,
            golesVisitante: 0,
            minuto: '58',
            estadio: { nombre: 'Estadio Nacional' },
          },
          {
            id: 'demo-en-vivo-2',
            equipoLocal: { nombre: 'Sporting Cristal' },
            equipoVisitante: { nombre: 'FBC Melgar' },
            golesLocal: 0,
            golesVisitante: 1,
            minuto: '23',
            estadio: { nombre: 'Alberto Gallardo' },
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadPartidos()
  }, [])

  if (loading) {
    return <div className="section">Cargando partidos en vivo...</div>
  }

  return (
    <section className="partidos-en-vivo">
      <h2>Partidos en Vivo</h2>
      <div className="partidos-container">
        {partidos.length > 0 ? (
          partidos.map((partido, index) => (
            <div key={partido.id} className={`partido-card ${index === 0 ? 'partido-card-main' : ''}`}>
              <div className="partido-header">
                <span className="badge-en-vivo">EN VIVO</span>
                <span className="minuto">{partido.minuto}'</span>
              </div>
              <div className="partido-contenido">
                <div className="equipo equipo-local">
                  <div className="escudo">{getTeamAbbreviation(partido.equipoLocal?.nombre)}</div>
                  <span>{partido.equipoLocal?.nombre}</span>
                </div>
                <div className="marcador">
                  <div className="goles">{partido.golesLocal} - {partido.golesVisitante}</div>
                </div>
                <div className="equipo equipo-visitante">
                  <div className="escudo">{getTeamAbbreviation(partido.equipoVisitante?.nombre)}</div>
                  <span>{partido.equipoVisitante?.nombre}</span>
                </div>
              </div>
              <div className="partido-footer">
                <span className="estadio">📍 {partido.estadio?.nombre}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="sin-partidos">No hay partidos en vivo en este momento</div>
        )}
      </div>
    </section>
  )
}
