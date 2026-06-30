import { UltimosResultados } from '../components/UltimosResultados'
import { ProximosPartidos } from '../components/ProximosPartidos'
import { NoticiasFavoritas } from '../components/NoticiasFavoritas'
import { ResumenTabla } from '../components/ResumenTabla'

export function Principal() {
  return (
    <div className="principal-shell">
      <section className="principal-grid">
        <div className="principal-stack">
          <UltimosResultados />
          <ResumenTabla />
        </div>
        <div className="principal-stack">
          <ProximosPartidos />
        </div>
      </section>

      <section className="principal-wide">
        <NoticiasFavoritas />
      </section>
    </div>
  )
}
