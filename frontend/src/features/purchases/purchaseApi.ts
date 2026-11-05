import { api } from '../../services/api'
export const getPurchases = async () => (await api.get('/purchases')).data
