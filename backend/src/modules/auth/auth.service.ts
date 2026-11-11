import { comparePassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import type { LoginInput, RegisterInput } from './auth.types.js'
import type { AuthUser } from '../../types/common.types.js'
import { prisma } from '../../config/database.js'

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !await comparePassword(password, user.passwordHash)) return null
  const authUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  return { token: signToken(authUser), user: authUser }
}

export const register = async ({ name, email, password }: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return null
  const user = await prisma.user.create({
    data: { name, email, role: 'ADMIN', passwordHash: await hashPassword(password) },
  })
  const authUser = { id: user.id, name: user.name, email: user.email, role: user.role }
  return { token: signToken(authUser), user: authUser }
}

export const getCurrentUser = (user: AuthUser | undefined) => user ?? null
