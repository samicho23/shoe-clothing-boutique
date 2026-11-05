import { z } from 'zod'
export const paymentSchema = z.object({ saleId: z.string().min(1), method: z.enum(['CASH', 'BANK_TRANSFER', 'CARD', 'MOBILE_MONEY']), amount: z.number().positive() })
