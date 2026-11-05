import assert from 'node:assert/strict'
import test from 'node:test'
import { listProducts } from '../src/modules/products/product.service.js'

test('product search matches name and SKU', () => {
  assert.equal(listProducts('loafer').length, 1)
  assert.equal(listProducts('BG-00106').length, 1)
  assert.equal(listProducts('missing').length, 0)
})
