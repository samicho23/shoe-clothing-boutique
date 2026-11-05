import type { RequestHandler } from 'express'
import { verifyToken } from '../utils/jwt.js'

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header('authorization')
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }
  try {
    req.user = verifyToken(header.slice(7))
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}
