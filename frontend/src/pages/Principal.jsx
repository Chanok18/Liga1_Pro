import { useEffect, useState } from 'react'
import { ProximosPartidos } from '../components/ProximosPartidos'
import { UltimosResultados } from '../components/UltimosResultados'
import { NoticiasFavoritas } from '../components/NoticiasFavoritas'
import { useAuth } from '../context/AuthContext'
import { favoritoService } from '../services/apiService'

export function Principal() {
  const { user } = useAuth()
  const [equipoFavorito, setEquipoFavorito] = useState(null)

  useEffect(() => {
    const loadFavorito = async () => {
      if (!user?.id) {
        setEquipoFavorito(null)
        return
      }

      try {
        const response = await favoritoService.get(user.id)
        setEquipoFavorito(response.data?.id ? response.data : null)
      } catch (error) {
        console.error('Error cargando favorito en Principal:', error)
        setEquipoFavorito(null)
      }
    }

    loadFavorito()
  }, [user?.id])

  return (
    <section className="principal-dashboard-page py-8">
      <div className="principal-top-grid">
        <div className="principal-results-panel glass-panel-active">
          <UltimosResultados equipoFavorito={equipoFavorito} />
        </div>
      </div>

      <div className="principal-dashboard-stack">
        <ProximosPartidos equipoFavorito={equipoFavorito} />
        <NoticiasFavoritas equipoFavorito={equipoFavorito} />
      </div>
    </section>
  )
}
