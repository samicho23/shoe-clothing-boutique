import { api } from '../../services/api'
export const getCustomers = async () => (await api.get('/customers')).data
