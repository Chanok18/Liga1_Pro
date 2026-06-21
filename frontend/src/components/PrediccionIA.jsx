import { useState } from 'react'
import { tablaPosicionesService, jugadorService } from '../services/apiService'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY

export function PrediccionIA({ partido }) {
  const [prediccion, setPrediccion] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const generarPrediccion = async () => {
    setLoading(true)
    setError(null)
    setPrediccion(null)

    try {
      const [tablaRes, jugLocRes, jugVisRes] = await Promise.all([
        tablaPosicionesService.get(),
        jugadorService.getByEquipo(partido.equipoLocal.id),
        jugadorService.getByEquipo(partido.equipoVisitante.id),
      ])

      const tabla = tablaRes.data || []
      const jugLocal = jugLocRes.data || []
      const jugVisitante = jugVisRes.data || []

      const infoLocal = tabla.find(t => t.equipo === partido.equipoLocal.nombre)
      const infoVisitante = tabla.find(t => t.equipo === partido.equipoVisitante.nombre)

      const prompt = `Eres un analista experto en futbol peruano Liga 1. Analiza este partido y genera una prediccion realista basada en los datos reales.

PARTIDO: ${partido.equipoLocal.nombre} (LOCAL) vs ${partido.equipoVisitante.nombre} (VISITANTE)
Jornada ${partido.jornada} | Estadio: ${partido.estadio}

POSICION EN TABLA:
- ${partido.equipoLocal.nombre}: Posicion ${infoLocal?.posicion ?? 'N/A'}, ${infoLocal?.pts ?? 0} pts, ${infoLocal?.pg ?? 0}G ${infoLocal?.pe ?? 0}E ${infoLocal?.pp ?? 0}P, GF:${infoLocal?.gf ?? 0} GC:${infoLocal?.gc ?? 0}
- ${partido.equipoVisitante.nombre}: Posicion ${infoVisitante?.posicion ?? 'N/A'}, ${infoVisitante?.pts ?? 0} pts, ${infoVisitante?.pg ?? 0}G ${infoVisitante?.pe ?? 0}E ${infoVisitante?.pp ?? 0}P, GF:${infoVisitante?.gf ?? 0} GC:${infoVisitante?.gc ?? 0}

PLANTILLA ${partido.equipoLocal.nombre}:
${jugLocal.map(j => `- ${j.nombre} ${j.apellido} (${j.posicion})`).join('\n')}

PLANTILLA ${partido.equipoVisitante.nombre}:
${jugVisitante.map(j => `- ${j.nombre} ${j.apellido} (${j.posicion})`).join('\n')}

Responde SOLO con este JSON exacto, sin texto extra ni markdown:
{
  "probLocal": 45,
  "probEmpate": 25,
  "probVisitante": 30,
  "jugadoresClaveLocal": ["Nombre Apellido", "Nombre Apellido"],
  "jugadoresClaveVisitante": ["Nombre Apellido", "Nombre Apellido"],
  "analisis": "Analisis breve de 2-3 oraciones sobre el partido, mencionando factores clave como posicion en tabla, ventaja de local, y jugadores destacados."
}`

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
          max_tokens: 500,
        }),
      })

      const data = await res.json()
      const text = data.choices?.[0]?.message?.content?.trim()
      if (!text) throw new Error('Respuesta vacia de la IA')

      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setPrediccion(parsed)
    } catch (err) {
      console.error('Error prediccion:', err)
      setError('No se pudo generar la prediccion. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const probabilidades = prediccion
    ? [
        { label: partido.equipoLocal.nombre, value: prediccion.probLocal, tone: 'bg-brand' },
        { label: 'Empate', value: prediccion.probEmpate, tone: 'bg-orange' },
        { label: partido.equipoVisitante.nombre, value: prediccion.probVisitante, tone: 'bg-indigo' },
      ]
    : []

  return (
    <div className="glass-panel mt-8 p-6" aria-live="polite">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 inline-flex rounded-full border-2 border-white bg-brand-softer px-3 py-1 text-xs font-bold uppercase text-brand-strong">
            Analisis predictivo
          </p>
          <h2 className="text-3xl text-white">Prediccion IA</h2>
        </div>
      </div>

      {!prediccion && !loading && (
        <div>
          <p className="mb-5 max-w-2xl text-sm text-text-muted">
            Analisis generado con IA basado en posiciones reales, plantillas y estadisticas del torneo.
          </p>
          <button type="button" className="btn-primary" onClick={generarPrediccion}>
            Generar prediccion
          </button>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border-2 border-white bg-neutral-secondary-medium p-5 text-center text-heading shadow-[var(--shadow-sm)]">
          <p className="font-semibold">Analizando el partido...</p>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border-2 border-white bg-danger p-5 text-white shadow-[var(--shadow-sm)]">
          <p className="mb-3 font-semibold">{error}</p>
          <button type="button" className="btn-secondary" onClick={generarPrediccion}>
            Reintentar
          </button>
        </div>
      )}

      {prediccion && (
        <div>
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {probabilidades.map((item) => (
              <article key={item.label} className={`${item.tone} rounded-2xl border-2 border-white p-4 text-center text-white shadow-[var(--shadow-sm)]`}>
                <p className="font-display text-4xl">{item.value}%</p>
                <p className="mt-1 text-sm font-bold">{item.label}</p>
                <meter className="mt-3 w-full" min="0" max="100" value={item.value} aria-label={`Probabilidad de ${item.label}`} />
              </article>
            ))}
          </div>

          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border-2 border-white bg-neutral-secondary-medium p-4 text-heading shadow-[var(--shadow-sm)]">
              <p className="mb-2 text-sm font-bold">Clave: {partido.equipoLocal.nombre}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-body">
                {prediccion.jugadoresClaveLocal?.map(j => <li key={j}>{j}</li>)}
              </ul>
            </article>
            <article className="rounded-2xl border-2 border-white bg-neutral-secondary-medium p-4 text-heading shadow-[var(--shadow-sm)]">
              <p className="mb-2 text-sm font-bold">Clave: {partido.equipoVisitante.nombre}</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-body">
                {prediccion.jugadoresClaveVisitante?.map(j => <li key={j}>{j}</li>)}
              </ul>
            </article>
          </div>

          <div className="mb-4 rounded-2xl border-2 border-white bg-neutral-primary-soft p-4 text-heading shadow-[var(--shadow-sm)]">
            <p className="text-sm italic text-body">{prediccion.analisis}</p>
          </div>

          <p className="mb-3 text-xs text-text-muted">
            Prediccion generada por IA. No representa resultados reales.
          </p>
          <button type="button" className="btn-secondary" onClick={generarPrediccion}>
            Nueva prediccion
          </button>
        </div>
      )}
    </div>
  )
}
