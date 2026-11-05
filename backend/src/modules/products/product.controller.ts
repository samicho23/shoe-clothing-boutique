import type { Request, Response } from 'express'
import { createProduct, listProducts } from './product.service.js'

export const listProductsController = (req: Request, res: Response) => {
  const data = listProducts(String(req.query.search ?? ''), String(req.query.category ?? ''))
  res.json({ data, total: data.length })
}

export const createProductController = (req: Request, res: Response) => {
  const product = createProduct(req.body)
  if (!product) {
    res.status(409).json({ error: 'A product with this SKU already exists' })
    return
  }
  res.status(201).json({ data: product })
}
