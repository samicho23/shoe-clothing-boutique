export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'INVENTORY_STAFF'

export type AuthUser = {
  id: string
  email: string
  name: string
  role: UserRole
}
