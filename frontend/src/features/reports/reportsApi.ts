import { api } from '../../services/api'
export const getSalesReport = async (params?: Record<string, string>) => (await api.get('/reports/sales', { params })).data
