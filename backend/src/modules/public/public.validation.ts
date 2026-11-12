import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10).max(5000),
})
