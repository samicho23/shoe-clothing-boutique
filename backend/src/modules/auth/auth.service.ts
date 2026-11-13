import { createHash, randomBytes } from 'node:crypto'
import { comparePassword, hashPassword } from '../../utils/password.js'
import { signToken } from '../../utils/jwt.js'
import type { LoginInput, RegisterInput } from './auth.types.js'
import type { AuthUser } from '../../types/common.types.js'
import type { UserRole } from '../../types/common.types.js'
import { prisma } from '../../config/database.js'
import { env } from '../../config/env.js'
import { sendEmail } from '../../lib/postmark.js'
import { logger } from '../../config/logger.js'

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

const hashResetToken = (token: string) => createHash('sha256').update(token).digest('hex')

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user?.email || user.status !== 'ACTIVE') return

  await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } })
  const token = randomBytes(32).toString('hex')
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashResetToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  })

  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`
  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your boutique password',
      htmlBody: `<p>We received a request to reset your boutique password.</p><p><a href="${resetUrl}">Reset your password</a></p><p>This link expires in one hour. If you did not request this, you can ignore this email.</p>`,
      textBody: `Reset your password: ${resetUrl}\nThis link expires in one hour.`,
    })
  } catch (error) {
    logger.error('Password reset email could not be sent', { error: error instanceof Error ? error.message : String(error) })
    if (env.NODE_ENV !== 'production') logger.info('Development password reset link', { email: user.email, resetUrl })
  }
}

export const resetPassword = async (token: string, password: string) => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashResetToken(token) },
  })
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) return false

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { password: await hashPassword(password) } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ])
  return true
}
