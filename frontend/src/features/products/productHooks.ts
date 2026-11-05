import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createProduct, getProducts } from './productApi'
export const useProducts = (search = '') => useQuery({ queryKey: ['products', search], queryFn: () => getProducts({ search }) })
export const useCreateProduct = () => { const client = useQueryClient(); return useMutation({ mutationFn: createProduct, onSuccess: () => client.invalidateQueries({ queryKey: ['products'] }) }) }
