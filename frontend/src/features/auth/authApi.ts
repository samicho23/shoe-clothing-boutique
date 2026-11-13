import { api } from '../../services/api'
import type { AuthResponse, LoginInput, RegisterInput } from './authTypes'

export const login = async (input: LoginInput) => (await api.post<{ data: AuthResponse }>('/auth/login', input)).data.data
export const register = async (input: RegisterInput) => (await api.post<{ data: AuthResponse }>('/auth/register', input)).data.data
export const getMe = async () => (await api.get('/auth/me')).data.data
export const forgotPassword = async (email: string) => (await api.post<{ data: { message: string } }>('/auth/forgot-password', { email })).data.data
export const resetPassword = async (token: string, password: string) => (await api.post<{ data: { message: string } }>('/auth/reset-password', { token, password })).data.data
export const logout = async () => { await api.post('/auth/logout') }
