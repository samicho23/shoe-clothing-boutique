import { api } from '../../services/api'
export const getCategories = async () => (await api.get('/categories')).data
