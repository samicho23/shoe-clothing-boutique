import type { User } from '../../types/user'
export type LoginInput = { email: string; password: string }
export type AuthResponse = { token: string; user: User }
