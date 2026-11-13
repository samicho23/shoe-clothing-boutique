import { Router } from 'express'
import { prisma } from '../../config/database.js'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { validateBody } from '../../middlewares/validate.middleware.js'
import { FLAT_SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, placeOrder } from './order.service.js'
import { contactSchema, orderSchema } from './public.validation.js'

export const publicRoutes = Router()

publicRoutes.get('/catalog', async (_req, res) => {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true, variants: { where: { quantity: { gt: 0 } }, orderBy: { sellingPrice: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    }),
  ])
  res.json({
    data: {
      categories,
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        type: product.type,
        category: product.category.name,
        imageUrl: product.imageUrl,
        variants: product.variants.map((variant) => ({
          id: variant.id,
          sku: variant.sku,
          size: variant.size,
          color: variant.color,
          price: Number(variant.sellingPrice),
          quantity: variant.quantity,
        })),
      })),
    },
  })
})

publicRoutes.get('/news', async (_req, res) => {
  const data = await prisma.newsArticle.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })
  res.json({ data })
})

publicRoutes.get('/gallery', async (_req, res) => {
  const data = await prisma.galleryItem.findMany({
    where: { isVisible: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  res.json({ data })
})

publicRoutes.get('/shipping', (_req, res) => {
  res.json({ data: { freeShippingThreshold: FREE_SHIPPING_THRESHOLD, flatShippingFee: FLAT_SHIPPING_FEE } })
})

publicRoutes.post('/orders', requireAuth, validateBody(orderSchema), async (req, res) => {
  const data = await placeOrder(req.user!, req.body)
  res.status(201).json({ data })
})

publicRoutes.post('/contact', validateBody(contactSchema), async (req, res) => {
  const submission = await prisma.contactSubmission.create({ data: req.body })
  res.status(201).json({
    data: { id: submission.id, message: 'Your message has been received.' },
  })
})
