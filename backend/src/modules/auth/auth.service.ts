import { comparePassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import type { LoginInput, RegisterInput } from './auth.types.js'
import type { AuthUser } from '../../types/common.types.js'

type StoredUser = {
  id: string
  name: string
  email: string
  role: 'ADMIN'
  passwordHash: string
}

const users: StoredUser[] = [{
  id: 'user_admin',
  name: 'Jordan Smith',
  email: 'admin@atelier.local',
  role: 'ADMIN',
  passwordHash: await hashPassword('atelier-admin'),
}]

export const login = async ({ email, password }: LoginInput) => {
  const user = users.find((candidate) => candidate.email === email)
  if (!user || !await comparePassword(password, user.passwordHash)) return null
  const authUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  return { token: signToken(authUser), user: authUser }
}

export const register = async ({ name, email, password }: RegisterInput) => {
  if (users.some((user) => user.email === email)) return null
  const user: StoredUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    role: 'ADMIN',
    passwordHash: await hashPassword(password),
  }
  users.push(user)
  const authUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  return { token: signToken(authUser), user: authUser }
}

export const getCurrentUser = (user: AuthUser | undefined) => user ?? null
