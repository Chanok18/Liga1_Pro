import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { PartidosEnVivo } from '../components/PartidosEnVivo'
import { ProximosPartidos } from '../components/ProximosPartidos'
import { UltimosResultados } from '../components/UltimosResultados'
import '../styles/Home.css'

export function Home() {
  return (
    <section className="home-page">
      <Hero />
      <main className="main-content">
        <PartidosEnVivo />
        <ProximosPartidos />
        <UltimosResultados />
      </main>
    </section>
  )
}
