import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).default('postgresql://atelier:atelier_dev_password@localhost:5432/atelier'),
  JWT_SECRET: z.string().min(32).default('development-only-secret-change-me-123456'),
  JWT_EXPIRES_IN: z.string().default('1d'),
})

export const env = envSchema.parse(process.env)
