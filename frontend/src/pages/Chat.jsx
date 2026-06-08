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
  const [groups, setGroups] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)

  const isOwnMessage = (message) => {
    return message.usuario?.id === user?.id || message.usuario?.email === user?.email
  }

  const chatsFiltrados = groups.filter((chat) =>
    chat.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatMembers = (chat) => chat.miembros ?? 1
  const formatPreview = (chat) => chat.ultimoMensaje || chat.descripcion || 'Empieza la conversación...'

  useEffect(() => {
    loadGroups()
  }, [])

  useEffect(() => {
    if (type && id) {
      setView('conversation')
      if (groups.length > 0) {
        loadConversation()
      }
    }
  }, [type, id, groups])

  const loadGroups = async () => {
    try {
      const response = await chatService.getGrupos()
      setGroups(response.data || [])
      if (type === 'grupo' && id) {
        const currentGroup = response.data?.find((group) => group.id === Number(id))
        setSelectedChat(currentGroup || null)
      }
    } catch (err) {
      console.error('Error cargando grupos:', err)
      setError('No se pudieron cargar los chats. Intenta más tarde.')
    }
  }

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

      const currentChat = groups.find((group) => group.id === Number(id))
      setSelectedChat(currentChat || null)
    } catch (err) {
      setError('No fue posible cargar el chat. Intenta de nuevo más tarde.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChatClick = (chatId) => {
    const selectedGroup = groups.find((group) => group.id === Number(chatId))
    setView('conversation')
    setSelectedChat(selectedGroup || null)
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
      <section className="chat-page">
        <div className="chat-card chat-list-card">
          <div className="chats-header">
            <div>
              <p className="section-label">Mensajes</p>
              <h1>Chats</h1>
            </div>
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
                      <span className="chat-members">{formatMembers(chat)} miembro{formatMembers(chat) !== 1 ? 's' : ''}</span>
                    </div>
                    <p className="chat-preview">{formatPreview(chat)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    )
  }

  // Vista de conversación
  return (
    <section className="chat-page">
      <div className="chat-card conversation-card">
        <div className="conversation-header">
          <button className="back-button" onClick={handleBack}>
            ← Chats
          </button>
          <div className="conversation-title">
            <div className="chat-avatar large">{selectedChat?.icono || selectedChat?.nombre?.charAt(0) || '💬'}</div>
            <div>
              <h2>{selectedChat?.nombre || 'Chat'}</h2>
              <p className="members-info">{selectedChat?.miembros} miembro{selectedChat?.miembros !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-card"><p>Cargando chat...</p></div>
        ) : error ? (
          <div className="error-card"><p>{error}</p></div>
        ) : (
          <>
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-messages">
                  <p>Aún no hay mensajes en este chat.</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={`${message.id ?? index}-${message.contenido}`}
                    className={`message-bubble ${isOwnMessage(message) ? 'mine' : 'other'}`}
                  >
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
      </div>
    </section>
  )
}
