import { useState, useEffect } from 'react'
import PartidoCard from '../components/PartidoCard'
import { fetchPartidosEnVivo } from '../services/api'
import '../styles/Home.css'

function Home() {
  const [partidos, setPartidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const cargarPartidos = async () => {
      try {
        setLoading(true)
        const data = await fetchPartidosEnVivo()
        setPartidos(data)
      } catch (err) {
        setError('Error al cargar los partidos')
        console.error(err)
        // Datos de prueba si hay error en la API
        setPartidos([
          {
            id: 1,
            equipoLocal: {
              id: 1,
              nombre: 'Universitario',
              logoUrl: '⚽',
              ciudad: 'Lima'
            },
            equipoVisitante: {
              id: 2,
              nombre: 'Sport Boys',
              logoUrl: '⚽',
              ciudad: 'Lima'
            },
            golesLocal: 1,
            golesVisitante: 1,
            minuto: 67,
            estado: 'en_vivo',
            estadio: 'Estadio Miguel Grau'
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    cargarPartidos()
  }, [])

  return (
    <div className="home">
      <section className="partidos-en-vivo">
        <h1 className="section-title">Partidos en Vivo</h1>
        
        {loading && <div className="loading">Cargando partidos...</div>}
        {error && <div className="error">{error}</div>}
        
        <div className="partidos-grid">
          {partidos.length > 0 ? (
            partidos.map(partido => (
              <PartidoCard key={partido.id} partido={partido} />
            ))
          ) : !loading ? (
            <div className="no-partidos">No hay partidos en vivo en este momento</div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

export default Home
