import { api } from '../../services/api'
export const getInventory = async () => (await api.get('/inventory')).data
