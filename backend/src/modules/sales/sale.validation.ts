import { z } from 'zod'
export const saleSchema = z.object({ items: z.array(z.object({ variantId: z.string(), quantity: z.number().int().positive() })).min(1), discount: z.number().nonnegative().default(0) })
