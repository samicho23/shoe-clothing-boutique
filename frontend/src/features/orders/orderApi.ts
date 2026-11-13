import { api } from '../../services/api'

export type StaffOrder = {
  id: string
  reference: string
  customer: string
  account: string
  email: string
  phoneNumber: string
  city: string
  items: number
  total: number
  paymentMethod: string
  status: 'PENDING' | 'CONFIRMED' | 'FULFILLED' | 'CANCELLED'
  createdAt: string
}

export const listOrders = async (search = '') => (await api.get<{ data: StaffOrder[] }>('/orders', { params: search ? { search } : {} })).data.data

export const updateOrderStatus = async (id: string, status: StaffOrder['status']) => (await api.patch<{ data: { id: string; status: string } }>(`/orders/${id}/status`, { status })).data.data
