import { api } from '../../services/api'

export type WorkspaceResource = 'categories' | 'customers' | 'inventory' | 'payments' | 'purchases' | 'sales' | 'suppliers' | 'users'
export type WorkspaceRecord = { id: string; createdAt: string; [key: string]: unknown }

export const getWorkspaceResource = async (resource: WorkspaceResource, search = '') => (
  await api.get<{ data: WorkspaceRecord[]; total: number }>(`/${resource}`, { params: search ? { search } : undefined })
).data

export const createWorkspaceRecord = async (resource: WorkspaceResource, values: Record<string, unknown>) => (
  await api.post<{ data: WorkspaceRecord }>(`/${resource}`, values)
).data.data

export const updateWorkspaceRecord = async (resource: WorkspaceResource, id: string, values: Record<string, unknown>) => (
  await api.patch<{ data: WorkspaceRecord }>(`/${resource}/${id}`, values)
).data.data

export const deleteWorkspaceRecord = async (resource: WorkspaceResource, id: string) => {
  await api.delete(`/${resource}/${id}`)
}
