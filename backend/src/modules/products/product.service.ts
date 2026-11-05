import type { Product } from './product.types.js'
import type { z } from 'zod'
import type { productSchema } from './product.validation.js'

type ProductInput = z.infer<typeof productSchema>
const products: Product[] = [
  { id: 'prod_1', name: 'Siena leather loafer', sku: 'SH-00248', category: 'Shoes', price: 189, stock: 24, status: 'In stock', createdAt: '2026-10-12T10:00:00.000Z' },
  { id: 'prod_2', name: 'Luna satin shoulder bag', sku: 'BG-00106', category: 'Accessories', price: 129, stock: 8, status: 'Low stock', createdAt: '2026-10-16T10:00:00.000Z' },
  { id: 'prod_3', name: 'Marais relaxed blazer', sku: 'CL-00389', category: 'Clothing', price: 245, stock: 0, status: 'Out of stock', createdAt: '2026-10-19T10:00:00.000Z' },
]

export const listProducts = (search = '', category = '') => products.filter((product) => {
  const term = search.trim().toLowerCase()
  return (!term || product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term)) && (!category || product.category === category)
})

export const createProduct = (input: ProductInput) => {
  if (products.some((product) => product.sku.toLowerCase() === input.sku.toLowerCase())) return null
  const product: Product = { id: `prod_${Date.now()}`, ...input, status: input.stock === 0 ? 'Out of stock' : input.stock < 10 ? 'Low stock' : 'In stock', createdAt: new Date().toISOString() }
  products.unshift(product)
  return product
}
