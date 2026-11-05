import { comparePassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import type { LoginInput } from './auth.types.js'
import type { AuthUser } from '../../types/common.types.js'

const demoUser = {
  id: 'user_admin',
  name: 'Jordan Smith',
  email: 'admin@atelier.local',
  role: 'ADMIN' as const,
  passwordHash: await hashPassword('atelier-admin'),
}

export const login = async ({ email, password }: LoginInput) => {
  const valid = demoUser.email === email && await comparePassword(password, demoUser.passwordHash)
  if (!valid) return null
  const user = { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role }
  return { token: signToken(user), user }
}

export const getCurrentUser = (user: AuthUser | undefined) => user ?? null
