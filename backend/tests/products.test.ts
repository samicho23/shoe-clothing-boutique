import assert from 'node:assert/strict'
import test from 'node:test'
import { prisma } from '../src/config/database.js'
import { createProduct, listProducts } from '../src/modules/products/product.service.js'

test('product search matches name and SKU', async () => {
  const loafer = await createProduct({
    name: 'Test Loafer',
    sku: 'TEST-LOAFER-001',
    category: 'Shoes',
    price: 49.99,
    stock: 12,
  })
  const bag = await createProduct({
    name: 'Test Bag',
    sku: 'TEST-BAG-001',
    category: 'Accessories',
    price: 29.99,
    stock: 8,
  })

  try {
    const [loaferResults, bagResults, missingResults] = await Promise.all([
      listProducts('loafer'),
      listProducts('TEST-BAG-001'),
      listProducts('missing'),
    ])
    assert.equal(loaferResults.length, 1)
    assert.equal(bagResults.length, 1)
    assert.equal(missingResults.length, 0)
  } finally {
    const productIds = [loafer?.id, bag?.id].filter((id): id is string => Boolean(id))
    await prisma.productVariant.deleteMany({ where: { productId: { in: productIds } } })
    await prisma.product.deleteMany({ where: { id: { in: productIds } } })
  }
})
