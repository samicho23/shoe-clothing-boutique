import { z } from 'zod'

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().trim().min(1),
        quantity: z.coerce.number().int().min(1).max(99),
      }),
    )
    .min(1, 'Your bag is empty')
    .max(50),
  customerName: z.string().trim().min(2).max(100),
  phoneNumber: z.string().trim().min(7).max(30),
  address: z.string().trim().min(5).max(300),
  city: z.string().trim().min(2).max(80),
  note: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CARD', 'MOBILE_MONEY']).default('CARD'),
})

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10).max(5000),
})
