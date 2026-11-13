import { useQuery } from '@tanstack/react-query'
import { getPublicCatalog, getShippingRules } from './publicApi'

export const useCatalog = () => useQuery({
  queryKey: ['public-catalog'],
  queryFn: getPublicCatalog,
  staleTime: 60_000,
})

export const useShippingRules = () => useQuery({
  queryKey: ['public-shipping'],
  queryFn: getShippingRules,
  staleTime: 60_000,
})
