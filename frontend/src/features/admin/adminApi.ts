import { api } from '../../services/api'

export type AdminOverview = { users: number; roles: number; auditLogs: number; products: number; openContacts: number }
export type AuditLog = { id: string; action: string; resource: string; resourceId?: string | null; createdAt: string; user?: { firstName: string; lastName: string; email?: string | null } | null }
export type AdminRole = { id: string; name: string; description?: string | null; isSystem: boolean; permissions?: Array<{ permission: AdminPermission }> }
export type AdminPermission = { id: string; name: string; resource: string; action: string; description?: string | null }

export const getAdminOverview = async () => (await api.get<{ data: AdminOverview }>('/admin/overview')).data.data
export const getAdminAuditLogs = async (limit = 20) => (await api.get<{ data: AuditLog[] }>('/admin/audit-logs', { params: { limit } })).data.data
export const getAdminUsers = async (search?: string) => (await api.get<{ data: unknown[] }>('/admin/users', { params: search ? { search } : undefined })).data.data
export const getAdminContacts = async (resolved?: boolean) => (await api.get<{ data: unknown[] }>('/admin/contacts', { params: resolved === undefined ? undefined : { resolved } })).data.data
export const getAdminNews = async () => (await api.get<{ data: unknown[] }>('/admin/news')).data.data
export const createAdminNews = async (input: Record<string, unknown>) => (await api.post<{ data: unknown }>('/admin/news', input)).data.data
export const updateAdminNews = async (id: string, input: Record<string, unknown>) => (await api.patch<{ data: unknown }>(`/admin/news/${id}`, input)).data.data
export const deleteAdminNews = async (id: string) => { await api.delete(`/admin/news/${id}`) }
export const getAdminGallery = async () => (await api.get<{ data: unknown[] }>('/admin/gallery')).data.data
export const createAdminGallery = async (input: Record<string, unknown>) => (await api.post<{ data: unknown }>('/admin/gallery', input)).data.data
export const updateAdminGallery = async (id: string, input: Record<string, unknown>) => (await api.patch<{ data: unknown }>(`/admin/gallery/${id}`, input)).data.data
export const deleteAdminGallery = async (id: string) => { await api.delete(`/admin/gallery/${id}`) }
export const resolveAdminContact = async (id: string) => (await api.patch<{ data: unknown }>(`/admin/contacts/${id}/resolve`)).data.data
export const getAdminRoles = async () => (await api.get<{ data: AdminRole[] }>('/admin/roles')).data.data
export const createAdminRole = async (input: Record<string, unknown>) => (await api.post<{ data: AdminRole }>('/admin/roles', input)).data.data
export const updateAdminRole = async (id: string, input: Record<string, unknown>) => (await api.patch<{ data: AdminRole }>(`/admin/roles/${id}`, input)).data.data
export const getAdminPermissions = async () => (await api.get<{ data: AdminPermission[] }>('/admin/permissions')).data.data
export const createAdminPermission = async (input: Record<string, unknown>) => (await api.post<{ data: AdminPermission }>('/admin/permissions', input)).data.data
