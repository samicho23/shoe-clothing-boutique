import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import type { UserRole } from '../types/user'
export function RoleBasedRoute({ roles, children }: { roles: UserRole[]; children: ReactNode }) { return roles.includes(useAuth().user?.role ?? 'CASHIER') ? <>{children}</> : <Navigate to="/unauthorized" replace /> }
