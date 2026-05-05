import '../styles/PartidoCard.css'

function PartidoCard({ partido }) {
  return (
    <div className="partido-card">
      <div className="partido-header">
        <span className="estado-badge">EN VIVO</span>
        <span className="minuto-badge">{partido.minuto}'</span>
      </div>

      <div className="partido-content">
        <div className="equipo-section">
          <div className="equipo-logo">
            <img src={partido.equipoLocal?.logoUrl || '⚽'} alt={partido.equipoLocal?.nombre} />
          </div>
          <div className="equipo-nombre">{partido.equipoLocal?.nombre || 'Equipo Local'}</div>
        </div>

        <div className="resultado">
          <div className="goles">{partido.golesLocal || 0}</div>
          <div className="vs">vs</div>
          <div className="goles">{partido.golesVisitante || 0}</div>
        </div>

        <div className="equipo-section">
          <div className="equipo-nombre">{partido.equipoVisitante?.nombre || 'Equipo Visitante'}</div>
          <div className="equipo-logo">
            <img src={partido.equipoVisitante?.logoUrl || '⚽'} alt={partido.equipoVisitante?.nombre} />
          </div>
        </div>
      </div>

      <div className="partido-footer">
        <div className="goleador">
          <span className="goleador-label">Goleador:</span>
          <span className="goleador-nombre">Carlos Mannucci</span>
        </div>
      </div>

      <div className="partido-stadium">
        <span className="stadium-icon">📍</span>
        <span className="stadium-name">{partido.estadio || 'Estadio'}</span>
      </div>
    </div>
  )
}

export default PartidoCard
