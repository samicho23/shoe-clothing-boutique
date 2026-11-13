import { Router } from 'express'
import { prisma } from '../../config/database.js'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireRoles } from '../../middlewares/role.middleware.js'
import { NotFoundError } from '../../errors/NotFoundError.js'
import { writeAuditLog } from '../../utils/audit-log.js'

const orderStatuses = ['PENDING', 'CONFIRMED', 'FULFILLED', 'CANCELLED'] as const
type OrderStatusValue = (typeof orderStatuses)[number]

export const orderRoutes = Router()
orderRoutes.use(requireAuth, requireRoles('ADMIN', 'MANAGER', 'CASHIER'))

orderRoutes.get('/', async (req, res) => {
  const search = String(req.query.search ?? '').trim()
  const rows = await prisma.order.findMany({
    where: search
      ? {
          OR: [
            { reference: { contains: search, mode: 'insensitive' } },
            { customerName: { contains: search, mode: 'insensitive' } },
            { user: { email: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {},
    include: { user: true, _count: { select: { items: true } } },
    orderBy: { createdAt: 'desc' },
  })
  res.json({
    data: rows.map((row) => ({
      id: row.id,
      reference: row.reference,
      customer: row.customerName,
      account: `${row.user.firstName} ${row.user.lastName}`.trim() || row.user.email || 'Customer',
      email: row.user.email ?? '',
      phoneNumber: row.phoneNumber,
      city: row.city,
      items: row._count.items,
      total: Number(row.total),
      paymentMethod: row.paymentMethod,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
    })),
    total: rows.length,
  })
})

orderRoutes.patch('/:id/status', async (req, res) => {
  const status = String(req.body?.status ?? '').toUpperCase() as OrderStatusValue
  if (!orderStatuses.includes(status)) {
    res.status(400).json({ error: 'Unknown order status', code: 'INVALID_STATUS' })
    return
  }
  const existing = await prisma.order.findUnique({ where: { id: String(req.params.id) } })
  if (!existing) throw new NotFoundError('Order not found')
  const order = await prisma.order.update({ where: { id: existing.id }, data: { status } })
  await writeAuditLog(req, 'UPDATE', 'orders', order.id, { status })
  res.json({ data: { id: order.id, status: order.status } })
})
