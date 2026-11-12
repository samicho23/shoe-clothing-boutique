import 'dotenv/config'
import { z } from 'zod'

const developmentJwtSecret = 'development-only-secret-change-me-123456'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1).default('postgresql://boutique:boutique_dev_password@localhost:5433/boutique_db'),
  JWT_SECRET: z.string().min(32).default(developmentJwtSecret),
  JWT_EXPIRES_IN: z.string().default('1d'),
  POSTMARK_SERVER_TOKEN: z.string().optional(),
  POSTMARK_FROM_EMAIL: z.string().email().optional(),
  POSTMARK_MESSAGE_STREAM: z.string().default('outbound'),
  REDIS_URL: z.string().url().optional(),
})

const parsedEnv = envSchema.parse(process.env)
if (parsedEnv.NODE_ENV === 'production' && parsedEnv.JWT_SECRET === developmentJwtSecret) {
  throw new Error('JWT_SECRET must be explicitly configured in production')
}

export const env = parsedEnv
