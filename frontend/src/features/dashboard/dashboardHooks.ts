import { useQuery } from '@tanstack/react-query'
import { getDashboardSummary } from './dashboardApi'

export const useDashboardSummary = () => useQuery({
  queryKey: ['dashboard-summary'],
  queryFn: getDashboardSummary,
})
