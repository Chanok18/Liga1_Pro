import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { chatService } from '../services/apiService'
import { useAuth } from '../context/AuthContext'
import { wsService } from '../services/wsService'
import '../styles/Chat.css'

export function Chat() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [view, setView] = useState(type && id ? 'conversation' : 'list')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)

  // Lista de chats disponibles
  const chats = [
    {
      id: 1,
      nombre: 'Hinchada Crema',
      miembros: 1,
      ultimoMensaje: '¡Vamos U!',
      icono: '👥'
    },
    {
      id: 2,
      nombre: 'Fans de Alianza',
      miembros: 1,
      ultimoMensaje: 'Gran partido hoy',
      icono: '👥'
    },
    {
      id: 3,
      nombre: 'Liga 1 General',
      miembros: 1,
      ultimoMensaje: '¿Quién ganará el clásico?',
      icono: '👥'
    },
    {
      id: 4,
      nombre: 'Análisis Táctico',
      miembros: 1,
      ultimoMensaje: '',
      icono: '👥'
    }
  ]

  const chatsFiltrados = chats.filter(chat =>
    chat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (type && id) {
      setView('conversation')
      loadConversation()
    }
  }, [type, id])

  const loadConversation = async () => {
    try {
      setLoading(true)
      if (token && (!wsService.client || !wsService.client.connected)) {
        await wsService.connect(token)
      }

      const routeType = type === 'grupo' ? 'grupo' : 'partido'
      const destination = routeType === 'partido' ? `/topic/partido/${id}` : `/topic/grupo/${id}`
      const sendPath = routeType === 'partido' ? `/app/chat.partido/${id}` : `/app/chat.grupo/${id}`

      const response = routeType === 'partido'
        ? await chatService.getPartido(id)
        : await chatService.getGrupo(id)

      setMessages(response.data || [])

      wsService.suscribirse(destination, (newMessage) => {
        setMessages((prev) => [...prev, newMessage])
      })

      // Encontrar el chat seleccionado
      const chat = chats.find(c => c.id == id)
      setSelectedChat(chat)
    } catch (err) {
      setError('No fue posible cargar el chat. Intenta de nuevo más tarde.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = (chatId) => {
    setView('conversation')
    setSelectedChat(chats.find(c => c.id === chatId))
    navigate(`/chat/grupo/${chatId}`)
  }

  const handleBack = () => {
    setView('list')
    setMessages([])
    setInput('')
    navigate('/chat')
  }

  const handleSend = () => {
    if (!input.trim() || !selectedChat) return
    const payload = {
      contenido: input.trim(),
      usuarioId: user?.id || 0,
      partidoId: null,
      grupoChatId: selectedChat.id,
      tipo: 'GRUPO',
    }
    wsService.publicar(`/app/chat.grupo/${selectedChat.id}`, payload)
    setInput('')
  }

  // Vista de lista de chats
  if (view === 'list') {
    return (
      <section className="chats-section">
        <div className="chats-header">
          <h1>💬 Chats</h1>
        </div>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar conversaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chats-list">
          {chatsFiltrados.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron chats</p>
            </div>
          ) : (
            chatsFiltrados.map(chat => (
              <div
                key={chat.id}
                className="chat-item"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="chat-avatar">{chat.icono}</div>
                <div className="chat-content">
                  <div className="chat-header-row">
                    <h3 className="chat-name">{chat.nombre}</h3>
                    <span className="chat-members">{chat.miembros} miembro{chat.miembros !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="chat-preview">{chat.ultimoMensaje}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    )
  }

  // Vista de conversación
  return (
    <section className="chat-conversation-section">
      <div className="conversation-header">
        <button className="back-button" onClick={handleBack}>
          ← Volver a chats
        </button>
        <h2>{selectedChat?.nombre || 'Chat'}</h2>
        <p className="members-info">{selectedChat?.miembros} miembro{selectedChat?.miembros !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <p className="loading">Cargando chat...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <>
          <div className="messages-container">
            {messages.length === 0 ? (
              <div className="empty-messages">
                <p>Aún no hay mensajes en este chat.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={`${message.id ?? index}-${message.contenido}`} className="message-bubble">
                  <span className="message-user">{message.usuario?.nombre || message.usuario?.email || user?.email || 'Usuario'}</span>
                  <p className="message-text">{message.contenido}</p>
                </div>
              ))
            )}
          </div>

          <div className="message-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="message-input"
            />
            <button className="send-button" onClick={handleSend}>Enviar</button>
          </div>
        </>
      )}
    </section>
  )
}
