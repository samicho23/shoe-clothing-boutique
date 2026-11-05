import { api } from '../../services/api'
import type { Product } from './productTypes'
export const getProducts = async (params?: { search?: string; category?: string }) => (await api.get<{ data: Product[]; total: number }>('/products', { params })).data
export const createProduct = async (product: Omit<Product, 'id' | 'status' | 'createdAt'>) => (await api.post<{ data: Product }>('/products', product)).data.data
