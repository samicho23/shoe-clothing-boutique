import { api } from '../../services/api'
export const getPayments = async () => (await api.get('/payments')).data
