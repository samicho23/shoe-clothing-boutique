import { api } from '../../services/api'
export const getSales = async () => (await api.get('/sales')).data
export const createSale = async (sale: unknown) => (await api.post('/sales', sale)).data
