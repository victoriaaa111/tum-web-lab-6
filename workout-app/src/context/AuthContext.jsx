import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, logout as apiLogout } from '../services/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    getMe()
      .then(u => { setUser(u); setAuthChecked(true) })
      .catch(() => setAuthChecked(true))
  }, [])

  async function logout() {
    await apiLogout().catch(() => {})
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, authChecked, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
