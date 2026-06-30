import { createContext, useState, useContext, useEffect } from 'react'
import { authService } from '../services/apiService'

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

  const subject = payload.sub
  const emailFromSub = typeof subject === 'string' && subject.includes('@') ? subject : null
  const idFromSub = typeof subject === 'number' ? subject : null

  return {
    id: payload.id || payload.userId || idFromSub || null,
    email: payload.email || emailFromSub || null,
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

  const needsUserRefresh = Boolean(
    token && (!user?.id || !user?.email || !user?.nombre),
  )

  useEffect(() => {
    const fetchMe = async () => {
      if (token && (!user || needsUserRefresh)) {
        try {
          const response = await authService.getMe()
          if (response?.data) {
            const mergedUser = {
              ...getUserFromToken(token),
              ...response.data,
            }
            setUser(mergedUser)
            localStorage.setItem('user', JSON.stringify(mergedUser))
          }
        } catch (error) {
          console.error('No se pudo obtener el usuario actual:', error)
          logout()
        }
      }
    }

    fetchMe()
  }, [token, user, needsUserRefresh])

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
