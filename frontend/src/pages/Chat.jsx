import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, MessageSquare, Radio, Send, Shield, ShieldAlert } from 'lucide-react'
import { chatService, partidoService } from '../services/apiService'
import { useAuth } from '../context/AuthContext'
import { wsService } from '../services/wsService'

const buildPartidoTitle = (partido) => {
  if (!partido) return 'Partido en vivo'
  return `${partido.equipoLocal?.nombre || 'Local'} vs ${partido.equipoVisitante?.nombre || 'Visitante'}`
}

const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

export function Chat() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [favoriteTeam, setFavoriteTeam] = useState(null)
  const [liveMatches, setLiveMatches] = useState([])
  const [activeChat, setActiveChat] = useState({ kind: 'equipo', id: null })
  const [activeMatch, setActiveMatch] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const activeDestinationRef = useRef(null)

  const isMatchChat = activeChat.kind === 'partido'
  const currentDestination = activeChat.kind === 'equipo' && activeChat.id
    ? `/topic/equipo/${activeChat.id}`
    : activeChat.kind === 'partido' && activeChat.id
      ? `/topic/partido/${activeChat.id}`
      : null

  const headerTitle = isMatchChat ? buildPartidoTitle(activeMatch) : favoriteTeam?.nombre || 'Chat de tu equipo'
  const headerSubtitle = isMatchChat
    ? activeMatch?.estado === 'EN_VIVO'
      ? 'Chat abierto mientras el partido esta en vivo'
      : 'Chat cerrado porque el partido ya no esta en vivo'
    : favoriteTeam
      ? 'Canal compartido con usuarios que tienen este equipo favorito'
      : 'Elige un equipo favorito para activar este chat'

  const canSend = input.trim() && user?.id && currentDestination && (!isMatchChat || activeMatch?.estado === 'EN_VIVO')

  const isOwnMessage = (message) => {
    return message.usuario?.id === user?.id || message.usuario?.email === user?.email
  }

  const sortedLiveMatches = useMemo(() => {
    return [...liveMatches].sort((a, b) => buildPartidoTitle(a).localeCompare(buildPartidoTitle(b)))
  }, [liveMatches])

  const connectSocket = useCallback(async () => {
    if (token && (!wsService.client || !wsService.client.connected)) {
      await wsService.connect(token)
    }
  }, [token])

  const subscribeTo = useCallback(async (destination) => {
    if (!destination) return
    await connectSocket()

    if (activeDestinationRef.current && activeDestinationRef.current !== destination) {
      wsService.desuscribirse(activeDestinationRef.current)
    }

    activeDestinationRef.current = destination
    wsService.desuscribirse(destination)
    wsService.suscribirse(destination, (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
    })
  }, [connectSocket])

  const loadFavoriteChat = useCallback(async () => {
    if (!user?.id) return
    setLoading(true)
    setError('')
    try {
      const [favoriteRes, liveRes] = await Promise.all([
        chatService.getEquipoFavorito(user.id),
        chatService.getPartidosVivo(),
      ])
      const equipo = favoriteRes.data?.equipo || null
      setFavoriteTeam(equipo)
      setLiveMatches(liveRes.data || [])
      setActiveMatch(null)
      setActiveChat({ kind: 'equipo', id: equipo?.id || null })
      setMessages(favoriteRes.data?.mensajes || [])
      if (equipo?.id) {
        await subscribeTo(`/topic/equipo/${equipo.id}`)
      }
    } catch (err) {
      setError('Selecciona un equipo favorito en Perfil para activar tu chat de comunidad.')
      setFavoriteTeam(null)
      setMessages([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [subscribeTo, user?.id])

  const loadMatchChat = useCallback(async (partidoId) => {
    setLoading(true)
    setError('')
    try {
      const [messagesRes, partidoRes, liveRes] = await Promise.all([
        chatService.getPartido(partidoId),
        partidoService.getById(partidoId),
        chatService.getPartidosVivo(),
      ])
      setLiveMatches(liveRes.data || [])
      setActiveMatch(partidoRes.data)
      setActiveChat({ kind: 'partido', id: Number(partidoId) })
      setMessages(messagesRes.data || [])
      await subscribeTo(`/topic/partido/${partidoId}`)
    } catch (err) {
      setError('No fue posible abrir el chat del partido.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [subscribeTo])

  useEffect(() => {
    if (type === 'partido' && id) {
      loadMatchChat(id)
      return
    }
    loadFavoriteChat()
  }, [id, loadFavoriteChat, loadMatchChat, type])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return () => {
      if (activeDestinationRef.current) {
        wsService.desuscribirse(activeDestinationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const intervalId = window.setInterval(async () => {
      try {
        const liveRes = await chatService.getPartidosVivo()
        setLiveMatches(liveRes.data || [])
        if (isMatchChat && activeChat.id) {
          const partidoRes = await partidoService.getById(activeChat.id)
          setActiveMatch(partidoRes.data)
        }
      } catch (err) {
        console.error('No se pudo actualizar el estado de chats en vivo:', err)
      }
    }, 30000)

    return () => window.clearInterval(intervalId)
  }, [activeChat.id, isMatchChat])

  const openFavoriteChat = () => {
    navigate('/chat')
    loadFavoriteChat()
  }

  const openMatchChat = (partidoId) => {
    navigate(`/chat/partido/${partidoId}`)
  }

  const handleSend = () => {
    if (!canSend) return

    const contenido = input.trim()
    if (isMatchChat) {
      wsService.publicar(`/app/chat.partido/${activeChat.id}`, {
        contenido,
        usuarioId: user.id,
        partidoId: Number(activeChat.id),
        tipo: 'PARTIDO',
      })
    } else {
      wsService.publicar(`/app/chat.equipo/${activeChat.id}`, {
        contenido,
        usuarioId: user.id,
        equipoId: Number(activeChat.id),
        tipo: 'EQUIPO',
      })
    }
    setInput('')
  }

  return (
    <section className="flex min-h-[calc(100vh-100px)] max-w-6xl flex-col py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 font-mono text-xs font-bold uppercase text-primary">
            <MessageSquare className="h-4 w-4" />
            Comunidad
          </div>
          <h1 className="text-3xl text-white md:text-5xl">Chat de comunidad</h1>
          <p className="mt-3 max-w-2xl text-text-muted">
            Conversa en tiempo real con usuarios de tu equipo favorito y entra a los chats de partidos mientras esten en vivo.
          </p>
        </div>
        <Link to="/perfil" className="btn-secondary px-5 py-3">
          Cambiar favorito
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="glass-panel-active flex flex-col gap-5 p-5">
          <button
            type="button"
            onClick={openFavoriteChat}
            className={`group flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${
              !isMatchChat ? 'border-primary/50 bg-primary/15' : 'border-white/10 bg-white/5 hover:border-primary/40'
            }`}
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg border border-white/10 bg-primary/15 text-primary">
              {favoriteTeam?.escudo ? (
                <img src={favoriteTeam.escudo} alt={favoriteTeam.nombre} className="h-8 w-8 object-contain" />
              ) : (
                <Shield className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-white">Mi equipo favorito</p>
              <p className="truncate text-sm text-text-muted">{favoriteTeam?.nombre || 'Sin equipo seleccionado'}</p>
            </div>
          </button>

          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold uppercase text-text-muted">
              <Radio className="h-4 w-4 text-primary" />
              Partidos en vivo
            </div>
            <div className="space-y-3">
              {sortedLiveMatches.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-text-muted">
                  No hay partidos en vivo ahora.
                </div>
              ) : (
                sortedLiveMatches.map((partido) => (
                  <button
                    type="button"
                    key={partido.id}
                    onClick={() => openMatchChat(partido.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      isMatchChat && Number(activeChat.id) === Number(partido.id)
                        ? 'border-primary/50 bg-primary/15'
                        : 'border-white/10 bg-white/5 hover:border-primary/40'
                    }`}
                  >
                    <p className="font-bold text-white">{buildPartidoTitle(partido)}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs font-semibold uppercase text-primary">
                      <CalendarDays className="h-3 w-3" />
                      En vivo
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>

        <div className="glass-panel-active flex min-h-[640px] flex-col overflow-hidden p-0">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-surface-light p-5">
            <div className="min-w-0">
              <h2 className="truncate text-2xl text-white">{headerTitle}</h2>
              <p className="mt-1 truncate text-sm text-text-muted">{headerSubtitle}</p>
            </div>
            <span className={`rounded-full border px-3 py-2 font-mono text-xs font-bold uppercase ${
              isMatchChat ? 'border-primary/30 bg-primary/10 text-primary' : 'border-white/10 bg-white/5 text-text-muted'
            }`}>
              {isMatchChat ? 'Partido' : 'Equipo'}
            </span>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center font-semibold text-text-muted">Conectando...</div>
          ) : error ? (
            <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-5 p-8 text-center">
              <ShieldAlert className="h-14 w-14 text-primary" />
              <p className="max-w-md text-text-muted">{error}</p>
              <Link to="/perfil" className="btn-primary px-6 py-3">Elegir equipo favorito</Link>
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-4 overflow-y-auto bg-background p-4 md:p-6" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center text-text-muted">
                    <p className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold">
                      Todavia no hay mensajes. Inicia la conversacion.
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isMine = isOwnMessage(message)
                    return (
                      <div key={`${message.id ?? index}-${index}`} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <span className={`mb-1 px-1 text-xs font-bold uppercase ${isMine ? 'text-primary' : 'text-text-muted'}`}>
                          {message.usuario?.nombre || message.usuario?.email || 'Usuario'}
                          {message.timestamp ? ` - ${formatTime(message.timestamp)}` : ''}
                        </span>
                        <div className={`max-w-[82%] rounded-lg border px-4 py-3 md:max-w-[70%] ${
                          isMine
                            ? 'border-primary/40 bg-primary/20 text-white'
                            : 'border-white/10 bg-white/5 text-white'
                        }`}>
                          <p className="whitespace-pre-wrap break-words text-sm md:text-base">{message.contenido}</p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-white/10 bg-surface-light p-4">
                {isMatchChat && activeMatch?.estado !== 'EN_VIVO' ? (
                  <p className="text-center text-sm font-semibold text-text-muted">
                    Este chat se cerro porque el partido ya no esta en vivo.
                  </p>
                ) : (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                      placeholder="Escribe un mensaje..."
                      aria-label="Escribe un mensaje"
                      className="w-full pl-4 pr-14"
                    />
                    <button
                      type="button"
                      onClick={handleSend}
                      disabled={!canSend}
                      aria-label="Enviar mensaje"
                      className="typeui-icon-button absolute right-2 p-2"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
