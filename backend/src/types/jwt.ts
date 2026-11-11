import type { JwtPayload } from './auth-contract.js'

export const isJwtPayload = (value: unknown): value is JwtPayload => {
  if (!value || typeof value !== 'object') return false
  const payload = value as Record<string, unknown>
  return typeof payload.id === 'string'
    && typeof payload.email === 'string'
    && typeof payload.name === 'string'
    && typeof payload.role === 'string'
}
