import type { RequestHandler } from 'express'
import type { UserRole } from '../types/common.types.js'

export const requireRoles = (...roles: UserRole[]): RequestHandler => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403).json({ error: 'You do not have permission to perform this action' })
    return
  }
  next()
}
