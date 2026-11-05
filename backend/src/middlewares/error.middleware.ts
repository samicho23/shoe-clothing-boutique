import type { ErrorRequestHandler } from 'express'
import { logger } from '../config/logger.js'

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error('Unhandled request error', { error: error instanceof Error ? error.message : String(error) })
  res.status(500).json({ error: 'Internal server error' })
}
