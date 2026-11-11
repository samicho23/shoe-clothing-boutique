import { api } from '../../services/api'
import type { Product, ProductInput } from './productTypes'

type ApiProduct = Omit<Product, 'price' | 'cost' | 'image'> & { price: number }

const normalizeProduct = (product: ApiProduct): Product => ({
  ...product,
  price: `$${product.price.toFixed(2)}`,
  cost: '$0.00',
  image: product.category.toLowerCase(),
})

export const getProducts = async (params?: { search?: string; category?: string }) => {
  const response = (await api.get<{ data: ApiProduct[]; total: number }>('/products', { params })).data
  return { ...response, data: response.data.map(normalizeProduct) }
}

export const createProduct = async (product: ProductInput) => {
  const response = (await api.post<{ data: ApiProduct }>('/products', product)).data.data
  return normalizeProduct(response)
}
