import { User, Shield, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { PageHeader } from '../components/PageHeader'

export function Perfil() {
  const { user } = useAuth()

  return (
    <section className="py-8">
      <PageHeader
        eyebrow="Cuenta"
        title="Perfil de usuario"
        description="Consulta los datos de tu cuenta y tus preferencias generales."
        icon={User}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section className="glass-panel-active p-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-2xl font-bold text-primary">
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl text-white">{user?.nombre || 'Usuario'}</h2>
              <p className="text-sm text-text-muted">{user?.email || 'Correo no disponible'}</p>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-xs uppercase text-text-muted">Rol</p>
              <p className="mt-1 font-bold text-white">{user?.rol || 'USER'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="font-mono text-xs uppercase text-text-muted">Estado</p>
              <p className="mt-1 font-bold text-white">Cuenta activa</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4">
          {[
            [Shield, 'Seguridad', 'Acceso protegido con autenticacion y token de sesion.'],
            [Bell, 'Preferencias', 'Las preferencias personalizadas se agregaran en los siguientes avances.'],
          ].map(([Icon, title, description]) => (
            <article key={title} className="glass-panel p-5">
              <div className="mb-3 flex items-center gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="text-lg text-white">{title}</h3>
              </div>
              <p className="text-sm text-text-muted">{description}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  )
}
