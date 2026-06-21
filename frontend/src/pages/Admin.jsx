import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, KeyRound, Search, ShieldCheck, Trash2, Users } from 'lucide-react'
import { adminService, equipoService } from '../services/apiService'
import { PageHeader } from '../components/PageHeader'

const formatDate = (value) => {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
}

export function Admin() {
  const [metricas, setMetricas] = useState(null)
  const [usuarios, setUsuarios] = useState([])
  const [equipos, setEquipos] = useState([])
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [password, setPassword] = useState('')
  const [selectedEquipo, setSelectedEquipo] = useState('')
  const [selectedRol, setSelectedRol] = useState('USER')
  const [teamChats, setTeamChats] = useState([])
  const [matchChats, setMatchChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('')

  const metricCards = useMemo(() => [
    ['Usuarios registrados', metricas?.usuariosRegistrados ?? 0],
    ['Usuarios activos', metricas?.usuariosActivos ?? 0],
    ['Activos recientes', metricas?.usuariosEnLinea ?? 0],
    ['Mensajes totales', metricas?.mensajesTotales ?? 0],
    ['Mensajes equipo', metricas?.mensajesEquipo ?? 0],
    ['Mensajes partido', metricas?.mensajesPartido ?? 0],
  ], [metricas])

  const loadBase = async () => {
    const [metricasRes, usuariosRes, equiposRes, teamChatsRes, matchChatsRes] = await Promise.all([
      adminService.metricas(),
      adminService.buscarUsuarios(''),
      equipoService.getAll(),
      adminService.chatsEquipo(),
      adminService.chatsPartido(),
    ])
    setMetricas(metricasRes.data)
    setUsuarios(usuariosRes.data || [])
    setEquipos(equiposRes.data || [])
    setTeamChats(teamChatsRes.data || [])
    setMatchChats(matchChatsRes.data || [])
  }

  useEffect(() => {
    loadBase().catch((error) => {
      console.error('Error cargando panel admin:', error)
      setStatus('No se pudo cargar el panel de administracion.')
    })
  }, [])

  const searchUsers = async (event) => {
    event.preventDefault()
    const response = await adminService.buscarUsuarios(query)
    setUsuarios(response.data || [])
  }

  const selectUser = (usuario) => {
    setSelectedUser(usuario)
    setSelectedRol(usuario.rol || 'USER')
    setSelectedEquipo('')
    setPassword('')
    setStatus('')
  }

  const updatePassword = async () => {
    if (!selectedUser || !password.trim()) return
    await adminService.cambiarPassword(selectedUser.id, password.trim())
    setPassword('')
    setStatus('Contrasena actualizada.')
  }

  const updateFavorite = async () => {
    if (!selectedUser || !selectedEquipo) return
    await adminService.cambiarFavorito(selectedUser.id, Number(selectedEquipo))
    setSelectedEquipo('')
    setStatus('Equipo favorito actualizado.')
  }

  const updateRol = async () => {
    if (!selectedUser) return
    const response = await adminService.cambiarRol(selectedUser.id, selectedRol)
    setSelectedUser(response.data)
    setUsuarios((prev) => prev.map((usuario) => usuario.id === response.data.id ? response.data : usuario))
    setStatus('Rango actualizado.')
  }

  const deleteUser = async () => {
    if (!selectedUser) return
    await adminService.eliminarUsuario(selectedUser.id)
    setUsuarios((prev) => prev.map((usuario) => usuario.id === selectedUser.id ? { ...usuario, activo: false } : usuario))
    setSelectedUser((prev) => prev ? { ...prev, activo: false } : prev)
    setStatus('Cuenta desactivada.')
  }

  const openTeamHistory = async (item) => {
    const response = await adminService.mensajesEquipo(item.equipo.id)
    setSelectedChat({ type: 'equipo', title: item.equipo.nombre })
    setMessages(response.data || [])
  }

  const openMatchHistory = async (item) => {
    const response = await adminService.mensajesPartido(item.partidoId)
    const title = item.partido
      ? `${item.partido.equipoLocal?.nombre || 'Local'} vs ${item.partido.equipoVisitante?.nombre || 'Visitante'}`
      : `Partido ${item.partidoId}`
    setSelectedChat({ type: 'partido', title })
    setMessages(response.data || [])
  }

  return (
    <section className="py-8">
      <PageHeader
        eyebrow="Administracion"
        title="Panel de admin"
        description="Gestiona usuarios, rangos, equipos favoritos y auditoria de chats."
        icon={ShieldCheck}
      />

      {status && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-primary">
          {status}
        </div>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {metricCards.map(([label, value]) => (
          <article key={label} className="glass-panel p-4">
            <p className="font-mono text-xs uppercase text-text-muted">{label}</p>
            <strong className="mt-2 block text-3xl text-white">{value}</strong>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="glass-panel-active p-5">
          <div className="mb-5 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl text-white">Cuentas registradas</h2>
          </div>

          <form onSubmit={searchUsers} className="mb-5 flex gap-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por usuario o correo"
              aria-label="Buscar por usuario o correo"
            />
            <button type="submit" className="typeui-icon-button px-4" aria-label="Buscar">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="grid gap-3">
            {usuarios.map((usuario) => (
              <button
                key={usuario.id}
                type="button"
                onClick={() => selectUser(usuario)}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  selectedUser?.id === usuario.id ? 'border-primary/50 bg-primary/15' : 'border-white/10 bg-white/5 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-white">{usuario.nombre}</strong>
                  <span className="rounded-full border border-white/10 px-2 py-1 font-mono text-xs text-text-muted">{usuario.rol}</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{usuario.email}</p>
                <p className="mt-2 text-xs font-semibold uppercase text-text-muted">
                  {usuario.activo === false ? 'Desactivado' : 'Activo'} - {formatDate(usuario.fechaRegistro)}
                </p>
              </button>
            ))}
          </div>

          {selectedUser && (
            <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
              <h3 className="mb-4 text-lg text-white">Editar {selectedUser.nombre}</h3>

              <div className="grid gap-4">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-text-muted">Nueva contrasena</span>
                  <div className="flex gap-3">
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                    <button type="button" onClick={updatePassword} className="typeui-icon-button px-4" aria-label="Cambiar contrasena">
                      <KeyRound className="h-4 w-4" />
                    </button>
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-text-muted">Equipo favorito</span>
                  <div className="flex gap-3">
                    <select value={selectedEquipo} onChange={(event) => setSelectedEquipo(event.target.value)}>
                      <option value="">Selecciona equipo</option>
                      {equipos.map((equipo) => (
                        <option key={equipo.id} value={equipo.id}>{equipo.nombre}</option>
                      ))}
                    </select>
                    <button type="button" onClick={updateFavorite} className="btn-secondary px-4">Guardar</button>
                  </div>
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-bold text-text-muted">Rango</span>
                  <div className="flex gap-3">
                    <select value={selectedRol} onChange={(event) => setSelectedRol(event.target.value)}>
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button type="button" onClick={updateRol} className="btn-secondary px-4">Actualizar</button>
                  </div>
                </label>

                <button type="button" onClick={deleteUser} className="btn-secondary justify-center px-4 text-danger">
                  <Trash2 className="h-4 w-4" />
                  Desactivar cuenta
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="glass-panel-active p-5">
          <div className="mb-5 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl text-white">Historial de chats</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg text-white">Por equipo</h3>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {teamChats.map((item) => (
                  <button key={item.equipo.id} type="button" onClick={() => openTeamHistory(item)} className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3 text-left hover:border-primary/30">
                    <span className="font-semibold text-white">{item.equipo.nombre}</span>
                    <span className="font-mono text-xs text-text-muted">{item.mensajes}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg text-white">Por partido</h3>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {matchChats.length === 0 ? (
                  <p className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-text-muted">Aun no hay chats de partido.</p>
                ) : matchChats.map((item) => (
                  <button key={item.partidoId} type="button" onClick={() => openMatchHistory(item)} className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left hover:border-primary/30">
                    <span className="truncate font-semibold text-white">Partido {item.partidoId}</span>
                    <span className="font-mono text-xs text-text-muted">{item.mensajes}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg text-white">{selectedChat?.title || 'Selecciona un chat'}</h3>
              <span className="font-mono text-xs uppercase text-text-muted">{messages.length} mensajes</span>
            </div>

            <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <p className="text-sm text-text-muted">No hay historial seleccionado.</p>
              ) : messages.map((message) => (
                <article key={message.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <strong className="text-white">{message.usuario?.nombre || message.usuario?.email || 'Usuario'}</strong>
                    <span className="font-mono text-xs text-text-muted">{formatDate(message.timestamp)}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm text-text-muted">{message.contenido}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 text-sm text-text-muted">
        <Link to="/principal" className="text-primary">Volver a Principal</Link>
      </div>
    </section>
  )
}
