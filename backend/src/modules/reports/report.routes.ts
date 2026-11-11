import { Router } from 'express'
import { listResource } from '../resource-store.js'
export const reportRoutes = Router()
reportRoutes.get('/sales', async (_req, res) => {
  const sales = await listResource('sales')
  const total = sales.reduce((sum, sale) => sum + Number(sale.total ?? 0), 0)
  res.json({ data: { sales, total, count: sales.length } })
})
