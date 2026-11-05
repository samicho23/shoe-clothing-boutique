import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
export function ProtectedRoute({ children }: { children: ReactNode }) { return useAuth().user ? <>{children}</> : <Navigate to="/login" replace /> }
