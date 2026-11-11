import type { AuthUser, UserRole } from './common.types.js'

export type JwtPayload = AuthUser & {
  iat?: number
  exp?: number
}

export type AuthenticatedUser = {
  id: string
  name: string
  email: string
  role: UserRole
}
