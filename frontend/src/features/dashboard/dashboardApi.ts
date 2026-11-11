import { api } from '../../services/api'

export type DashboardSummary = {
  productCount: number
  lowStockCount: number
  salesTotal: number
  recentSales: Array<Record<string, unknown>>
}

export const getDashboardSummary = async () => (await api.get<{ data: DashboardSummary }>('/dashboard')).data.data
