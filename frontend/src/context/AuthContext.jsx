import { createContext, useContext, useState } from 'react'
import api from '../api/axios.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('psai_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password })
      const { access_token, user: userData } = res.data
      localStorage.setItem('psai_token', access_token)
      localStorage.setItem('psai_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (err) {
      // Fallback demo login so the UI is explorable even without the backend running
      if (email === 'admin@pricesmart.ai' && password === 'admin123') {
        const demoUser = { id: 1, email, name: 'Admin User', role: 'admin' }
        localStorage.setItem('psai_token', 'demo-token')
        localStorage.setItem('psai_user', JSON.stringify(demoUser))
        setUser(demoUser)
        return { success: true }
      }
      return {
        success: false,
        message: err.response?.data?.detail || 'Invalid email or password',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('psai_token')
    localStorage.removeItem('psai_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
