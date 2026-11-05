export type UserRole = 'ADMIN' | 'MANAGER' | 'CASHIER' | 'INVENTORY_STAFF'
export type User = { id: string; name: string; email: string; role: UserRole }
