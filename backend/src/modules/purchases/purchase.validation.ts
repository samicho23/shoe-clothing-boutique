import { z } from 'zod'
export const purchaseSchema = z.object({ supplierId: z.string().min(1), items: z.array(z.object({ variantId: z.string(), quantity: z.number().int().positive(), unitCost: z.number().nonnegative() })).min(1) })
