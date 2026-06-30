import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Search, ShieldCheck, Trash2, Users } from 'lucide-react'
import { adminService } from '../services/apiService'
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
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [password, setPassword] = useState('')
  const [selectedRol, setSelectedRol] = useState('USER')
  const [status, setStatus] = useState('')

  const metricCards = useMemo(() => [
    ['Usuarios registrados', metricas?.usuariosRegistrados ?? 0],
    ['Usuarios activos', metricas?.usuariosActivos ?? 0],
    ['Activos recientes', metricas?.usuariosEnLinea ?? 0],
  ], [metricas])

  const loadBase = async () => {
    const [metricasRes, usuariosRes] = await Promise.all([
      adminService.metricas(),
      adminService.buscarUsuarios(''),
    ])
    setMetricas(metricasRes.data)
    setUsuarios(usuariosRes.data || [])
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
    setPassword('')
    setStatus('')
  }

  const updatePassword = async () => {
    if (!selectedUser || !password.trim()) return
    await adminService.cambiarPassword(selectedUser.id, password.trim())
    setPassword('')
    setStatus('Contrasena actualizada.')
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

  return (
    <section className="py-8">
      <PageHeader
        eyebrow="Administracion"
        title="Panel de admin"
        description="Gestiona usuarios, rangos y accesos de la plataforma."
        icon={ShieldCheck}
      />

      {status && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-primary">
          {status}
        </div>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {metricCards.map(([label, value]) => (
          <article key={label} className="glass-panel p-4">
            <p className="font-mono text-xs uppercase text-text-muted">{label}</p>
            <strong className="mt-2 block text-3xl text-white">{value}</strong>
          </article>
        ))}
      </div>

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

      <div className="mt-6 text-sm text-text-muted">
        <Link to="/principal" className="text-primary">Volver a Principal</Link>
      </div>
    </section>
  )
}
