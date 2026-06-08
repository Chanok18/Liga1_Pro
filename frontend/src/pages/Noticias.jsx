import { useState } from 'react'

export function Noticias() {
  const [selectedCategory, setSelectedCategory] = useState('todas')

  const categories = [
    { id: 'todas', label: 'Todas' },
    { id: 'resultados', label: 'Resultados' },
    { id: 'fichajes', label: 'Fichajes' },
    { id: 'previa', label: 'Previa' },
    { id: 'estadisticas', label: 'Estadísticas' },
    { id: 'noticias', label: 'Noticias' }
  ]

  const noticias = [
    {
      id: 1,
      categoria: 'resultados',
      titulo: 'Universitario se mantiene en la cima tras vencer a Sport Boys',
      descripcion: 'Los cremas lograron una importante victoria de visitante que los consolida como líderes del torneo.',
      tiempo: 'Hace 2 horas',
      destacada: true
    },
    {
      id: 2,
      categoria: 'fichajes',
      titulo: 'Alianza Lima prepara refuerzos para el Clausura',
      descripcion: 'La dirigencia blanquiazul trabaja en incorporaciones para mantener el ritmo en la segunda mitad del...',
      tiempo: 'Hace 5 horas'
    },
    {
      id: 3,
      categoria: 'previa',
      titulo: 'Melgar busca mantener su invicto en casa ante Sporting Cristal',
      descripcion: 'El equipo arequipeño no conoce la derrota como local y buscará extender su racha este fin de...',
      tiempo: 'Hace 8 horas'
    },
    {
      id: 4,
      categoria: 'estadisticas',
      titulo: 'La tabla de goleadores se aprieta en la Liga 1',
      descripcion: 'Alex Valera lidera con 8 goles, pero varios alcantes están cerca de alcanzarlo.',
      tiempo: 'Hace 12 horas'
    },
    {
      id: 5,
      categoria: 'noticias',
      titulo: 'Sport Boys ficha a joven promesa del fútbol peruano',
      descripcion: 'El club rosado anunció la llegada de un talentoso lateral izquierdo para reforzar su defensa.',
      tiempo: 'Hace 15 horas'
    },
    {
      id: 6,
      categoria: 'resultados',
      titulo: 'Cristal cae ante Mannucci en sorpresivo resultado',
      descripcion: 'Los cerveceros no pudieron con los moscardos en un encuentro lleno de emociones.',
      tiempo: 'Hace 18 horas'
    }
  ]

  const noticiaDestacada = noticias.find(n => n.destacada)
  const noticiasFiltradas = noticias.filter(n => !n.destacada && (selectedCategory === 'todas' || n.categoria === selectedCategory))

  return (
    <section className="noticias-section">
      <div className="noticias-header">
        <h1>📰 Noticias</h1>
      </div>

      <div className="noticias-tabs">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`tab-button ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {noticiaDestacada && (
        <article className="noticia-destacada">
          <div className="noticia-destacada-content">
            <div className="noticia-badges">
              <span className={`noticia-badge badge-${noticiaDestacada.categoria}`}>
                ❤️ {noticiaDestacada.categoria.charAt(0).toUpperCase() + noticiaDestacada.categoria.slice(1)}
              </span>
              <span className="noticia-tiempo">
                ⏱️ {noticiaDestacada.tiempo}
              </span>
            </div>
            <h2 className="noticia-destacada-titulo">{noticiaDestacada.titulo}</h2>
            <p className="noticia-destacada-descripcion">{noticiaDestacada.descripcion}</p>
          </div>
        </article>
      )}

      <div className="noticias-grid">
        {noticiasFiltradas.map(noticia => (
          <article key={noticia.id} className="noticia-card">
            <div className="noticia-imagen"></div>
            <div className="noticia-body">
              <div className="noticia-badges">
                <span className={`noticia-badge badge-${noticia.categoria}`}>
                  ❤️ {noticia.categoria.charAt(0).toUpperCase() + noticia.categoria.slice(1)}
                </span>
                <span className="noticia-tiempo">
                  ⏱️ {noticia.tiempo}
                </span>
              </div>
              <h3 className="noticia-titulo">{noticia.titulo}</h3>
              <p className="noticia-descripcion">{noticia.descripcion}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
