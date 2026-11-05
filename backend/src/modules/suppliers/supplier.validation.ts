import { z } from 'zod'
export const supplierSchema = z.object({ name: z.string().trim().min(2), email: z.string().email().optional(), phone: z.string().max(30).optional() })
