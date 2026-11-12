import { Router } from 'express'
import { prisma } from '../../config/database.js'

export const metaRoutes = Router()

metaRoutes.get('/', async (_req, res) => {
  const [categories, roles] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true, slug: true }, orderBy: { name: 'asc' } }),
    prisma.role.findMany({ select: { id: true, name: true, description: true }, orderBy: { name: 'asc' } }),
  ])
  res.json({
    data: {
      name: 'Atelier',
      description: 'Shoe and clothing boutique operations',
      categories,
      roles,
      productTypes: ['SHOES', 'CLOTHING', 'ACCESSORIES', 'OTHER'],
      paymentMethods: ['CASH', 'BANK_TRANSFER', 'CARD', 'MOBILE_MONEY'],
    },
  })
})
