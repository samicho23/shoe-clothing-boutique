import type { UserRole } from '../types/user'
export const canManageProducts = (role?: UserRole) => role === 'ADMIN' || role === 'MANAGER'
