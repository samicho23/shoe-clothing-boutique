import cors from 'cors'
import { env } from './env.js'

const loopbackHosts = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

const isLoopbackOrigin = (origin: string) => {
  try {
    const { protocol, hostname } = new URL(origin)
    return (protocol === 'http:' || protocol === 'https:') && loopbackHosts.has(hostname)
  } catch {
    return false
  }
}

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || origin === env.FRONTEND_URL) return callback(null, true)
    // Local development runs the store on whichever port is free (vite, docker, preview).
    if (env.NODE_ENV !== 'production' && isLoopbackOrigin(origin)) return callback(null, true)
    callback(null, false)
  },
  credentials: true,
})
