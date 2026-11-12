import type { User } from '../../types/user'
export type LoginInput = { email: string; password: string }
export type RegisterInput = { firstName: string; lastName: string; email: string; phoneNumber: string; password: string }
export type AuthResponse = { token: string; user: User }
