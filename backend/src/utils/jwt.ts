import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import type { AuthUser } from '../types/common.types.js'

export const signToken = (user: AuthUser) => jwt.sign(user, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] })
export const verifyToken = (token: string) => jwt.verify(token, env.JWT_SECRET) as AuthUser
