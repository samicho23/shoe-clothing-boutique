import { comparePassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import type { LoginInput, RegisterInput } from './auth.types.js'
import type { AuthUser } from '../../types/common.types.js'
import type { UserRole } from '../../types/common.types.js'
import { prisma } from '../../config/database.js'

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } })
  if (!user || user.status !== 'ACTIVE' || !user.email || !await comparePassword(password, user.password)) return null
  const role = (user.roles[0]?.role.name ?? 'CASHIER') as UserRole
  const authUser = { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email, role }
  return { token: signToken(authUser), user: authUser }
}

export const register = async ({ firstName, lastName, email, phoneNumber, password }: RegisterInput) => {
  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { phoneNumber }] } })
  if (existing) return null
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      phoneNumber,
      password: await hashPassword(password),
      status: 'ACTIVE',
      roles: {
        create: {
          role: {
            connectOrCreate: {
              where: { name: 'CASHIER' },
              create: { name: 'CASHIER', description: 'Point-of-sale access', isSystem: true },
            },
          },
        },
      },
    },
  })
  const authUser = { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email!, role: 'CASHIER' as UserRole }
  return { token: signToken(authUser), user: authUser }
}

export const getCurrentUser = (user: AuthUser | undefined) => user ?? null
