import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'

export const validateBody = (schema: ZodType): RequestHandler => (req, res, next) => {
  const result = schema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({ error: 'Validation failed', details: result.error.flatten() })
    return
  }
  req.body = result.data
  next()
}
