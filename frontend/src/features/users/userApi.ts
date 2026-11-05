import { api } from '../../services/api'
export const getUsers = async () => (await api.get('/users')).data
