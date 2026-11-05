import { z } from 'zod'
export const inventoryAdjustmentSchema = z.object({ variantId: z.string().min(1), quantity: z.number().int(), reason: z.string().trim().min(3) })
