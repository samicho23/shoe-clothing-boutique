import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest, register as registerRequest } from '../features/auth/authApi'
import { authStore } from '../features/auth/authStore'
import type { LoginInput, RegisterInput } from '../features/auth/authTypes'
import type { User } from '../types/user'

type AuthContextValue = { user: User | null; login: (input: LoginInput) => Promise<void>; register: (input: RegisterInput) => Promise<void>; logout: () => void }
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(authStore.getUser)
  const value = useMemo(() => ({
    user,
    login: async (input: LoginInput) => { const result = await loginRequest(input); localStorage.setItem('atelier_token', result.token); authStore.setUser(result.user); setUser(result.user) },
    register: async (input: RegisterInput) => { const result = await registerRequest(input); localStorage.setItem('atelier_token', result.token); authStore.setUser(result.user); setUser(result.user) },
    logout: () => { authStore.clear(); setUser(null) },
  }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
