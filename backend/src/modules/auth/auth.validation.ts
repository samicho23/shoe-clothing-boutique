import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
})

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(40),
  lastName: z.string().trim().min(1).max(40),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phoneNumber: z.string().trim().regex(/^\+?[0-9\s()-]{7,30}$/, 'Enter a valid phone number'),
  password: z.string().min(8).max(128),
})
