import type { UserRole } from '../../types/common.types.js'

export type LoginInput = { email: string; password: string }
export type RegisterInput = { firstName: string; lastName: string; email: string; phoneNumber: string; password: string }
export type AuthResponse = { token: string; user: { id: string; name: string; email: string; role: UserRole } }
