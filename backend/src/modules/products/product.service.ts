import type { Product } from './product.types.js'
import type { z } from 'zod'
import type { productSchema } from './product.validation.js'
import { prisma } from '../../config/database.js'

type ProductInput = z.infer<typeof productSchema>
const toProduct = (product: { id: string; name: string; type: string; createdAt: Date; variants: { sku: string; sellingPrice: unknown; quantity: number }[]; category: { name: string } }): Product => {
  const variant = product.variants[0]
  const stock = variant?.quantity ?? 0
  return {
    id: product.id,
    name: product.name,
    sku: variant?.sku ?? '',
    category: product.category.name as Product['category'],
    price: Number(variant?.sellingPrice ?? 0),
    stock,
    status: stock === 0 ? 'Out of stock' : stock < 10 ? 'Low stock' : 'In stock',
    createdAt: product.createdAt.toISOString(),
  }
}

export const listProducts = async (search = '', category = '') => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(search.trim() ? { OR: [{ name: { contains: search.trim(), mode: 'insensitive' } }, { variants: { some: { sku: { contains: search.trim(), mode: 'insensitive' } } } }] } : {}),
      ...(category ? { category: { name: category } } : {}),
    },
    include: { category: true, variants: { orderBy: { createdAt: 'asc' }, take: 1 } },
    orderBy: { createdAt: 'desc' },
  })
  return products.map(toProduct)
}

export const createProduct = async (input: ProductInput) => {
  const existing = await prisma.productVariant.findUnique({ where: { sku: input.sku } })
  if (existing) return null
  const category = await prisma.category.upsert({
    where: { name: input.category },
    update: {},
    create: { name: input.category, slug: input.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') },
  })
  const product = await prisma.product.create({
    data: {
      name: input.name,
      type: input.category.toUpperCase() as 'SHOES' | 'CLOTHING' | 'ACCESSORIES' | 'OTHER',
      categoryId: category.id,
      variants: { create: { sku: input.sku, sellingPrice: input.price, costPrice: 0, quantity: input.stock } },
    },
    include: { category: true, variants: true },
  })
  return toProduct(product)
}
