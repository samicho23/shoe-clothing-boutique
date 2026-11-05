import { api } from '../../services/api'
export const getSuppliers = async () => (await api.get('/suppliers')).data
