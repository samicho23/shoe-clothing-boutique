import { api } from '../../services/api'
import type { AuthResponse, LoginInput } from './authTypes'

export const login = async (input: LoginInput) => (await api.post<{ data: AuthResponse }>('/auth/login', input)).data.data
export const getMe = async () => (await api.get('/auth/me')).data.data
export const logout = async () => { await api.post('/auth/logout') }
