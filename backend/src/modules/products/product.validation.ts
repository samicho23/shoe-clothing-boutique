import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sku: z.string().trim().min(2).max(40).regex(/^[A-Za-z0-9-]+$/),
  category: z.enum(['Shoes', 'Clothing', 'Accessories', 'Other']),
  price: z.number().finite().nonnegative(),
  stock: z.number().int().nonnegative().default(0),
})
