import { z } from 'zod'
export const productSchema = z.object({ name: z.string().min(2), sku: z.string().min(2), category: z.enum(['Shoes', 'Clothing', 'Accessories', 'Other']), price: z.coerce.number().nonnegative(), stock: z.coerce.number().int().nonnegative() })
export type ProductForm = z.infer<typeof productSchema>
