import type { Request, Response } from 'express'
import { createProduct, listProducts } from './product.service.js'

export const listProductsController = async (req: Request, res: Response) => {
  const data = await listProducts(String(req.query.search ?? ''), String(req.query.category ?? ''))
  res.json({ data, total: data.length })
}

export const createProductController = async (req: Request, res: Response) => {
  const product = await createProduct(req.body)
  if (!product) {
    res.status(409).json({ error: 'A product with this SKU already exists' })
    return
  }
  res.status(201).json({ data: product })
}
