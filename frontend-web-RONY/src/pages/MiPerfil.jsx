import '../styles/MiPerfil.css'

function MiPerfil() {
  const username = localStorage.getItem('username') || 'Usuario'
  const email = localStorage.getItem('usuarioEmail') || 'Sin correo registrado'

  return (
    <div className="mi-perfil-page">
      <section className="perfil-contenido">
        <h1 className="section-title">Mi Perfil</h1>

        <div className="perfil-card">
          <h2 className="favorito-title">Datos de la cuenta</h2>
          <p className="favorito-subtitle">
            Usuario: <strong>{username}</strong>
          </p>
          <p className="favorito-subtitle">
            Email: <strong>{email}</strong>
          </p>
        </div>
      </section>
    </div>
  )
}

export default MiPerfil
