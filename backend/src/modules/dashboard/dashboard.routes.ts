import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { prisma } from '../../config/database.js'
export const dashboardRoutes = Router()
dashboardRoutes.use(requireAuth)
dashboardRoutes.get('/', async (_req, res) => {
  const [products, sales] = await Promise.all([
    prisma.productVariant.findMany({ select: { quantity: true, minimumStock: true } }),
    prisma.sale.findMany({ select: { id: true, receiptNumber: true, total: true, paymentStatus: true, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ])
  res.json({
    data: {
      productCount: products.length,
      lowStockCount: products.filter((item) => item.quantity <= item.minimumStock).length,
      salesTotal: sales.reduce((sum, sale) => sum + Number(sale.total), 0),
      recentSales: sales.map((sale) => ({ id: sale.id, createdAt: sale.createdAt.toISOString(), reference: sale.receiptNumber, total: Number(sale.total), status: sale.paymentStatus })),
    },
  })
})
