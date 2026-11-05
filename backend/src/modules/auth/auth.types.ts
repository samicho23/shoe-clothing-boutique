import type { UserRole } from '../../types/common.types.js'

export type LoginInput = { email: string; password: string }
export type AuthResponse = { token: string; user: { id: string; name: string; email: string; role: UserRole } }
