import { createContext, useState, useContext, useEffect } from 'react'
import { wsService } from '../services/wsService'

const AuthContext = createContext(null)

function readJwtPayload(token) {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch (error) {
    console.error('Error parsing JWT:', error)
    return null
  }
}

function getUserFromToken(token) {
  const payload = readJwtPayload(token)
  if (!payload) return null
  return {
    id: payload.sub || payload.userId || payload.id,
    email: payload.email || payload.sub || null,
    nombre: payload.nombre || payload.name || null,
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('auth_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    if (saved) return JSON.parse(saved)
    const savedToken = localStorage.getItem('auth_token')
    return savedToken ? getUserFromToken(savedToken) : null
  })

  useEffect(() => {
    const connectSocket = async () => {
      if (token) {
        try {
          await wsService.connect(token)
        } catch (error) {
          console.error('No se pudo conectar WebSocket:', error)
        }
      }
    }

    connectSocket()
    return () => {
      wsService.disconnect()
    }
  }, [token])

  const login = (tokenValue, userData) => {
    const decodedUser = getUserFromToken(tokenValue)
    const finalUser = {
      ...decodedUser,
      ...userData,
    }
    setToken(tokenValue)
    setUser(finalUser)
    localStorage.setItem('auth_token', tokenValue)
    localStorage.setItem('user', JSON.stringify(finalUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    wsService.disconnect()
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
