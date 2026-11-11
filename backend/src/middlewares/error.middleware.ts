import type { ErrorRequestHandler } from 'express'
import { logger } from '../config/logger.js'
import { AppError } from '../errors/app-error.js'

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.error('Unhandled request error', { error: error instanceof Error ? error.message : String(error) })
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code })
    return
  }
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' })
}
