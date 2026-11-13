import { Route, Routes } from 'react-router-dom'
import App from '../App'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { UnauthorizedPage } from '../pages/errors/UnauthorizedPage'
import { NotFoundPage } from '../pages/errors/NotFoundPage'
import { ProtectedRoute } from './ProtectedRoute'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { PosPage } from '../pages/pos/PosPage'
import { ProductsPage } from '../pages/products/ProductsPage'
import { CategoriesPage } from '../pages/categories/CategoriesPage'
import { CustomersPage } from '../pages/customers/CustomersPage'
import { InventoryPage } from '../pages/inventory/InventoryPage'
import { PaymentsPage } from '../pages/payments/PaymentsPage'
import { PurchasesPage } from '../pages/purchases/PurchasesPage'
import { ReportsPage } from '../pages/reports/ReportsPage'
import { SalesPage } from '../pages/sales/SalesPage'
import { SuppliersPage } from '../pages/suppliers/SuppliersPage'
import { UsersPage } from '../pages/users/UsersPage'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { SettingsPage } from '../pages/settings/SettingsPage'
import { StorefrontPage } from '../pages/public/StorefrontPage'
import { AdminPage } from '../pages/admin/AdminPage'
import { RoleBasedRoute } from './RoleBasedRoute'
import { useAuth } from '../contexts/AuthContext'
import { Loading } from '../components/common/Loading'

function HomeRoute() {
  const { user, isLoading } = useAuth()
  if (isLoading) return <Loading />
  return user ? <App><DashboardPage /></App> : <StorefrontPage />
}

export function AppRoutes() {
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/" element={<HomeRoute />} />
    <Route path="/storefront" element={<StorefrontPage />} />
    <Route path="/unauthorized" element={<UnauthorizedPage />} />
    <Route element={<App />}>
      <Route path="/dashboard" element={<DashboardPage />} />
    </Route>
    <Route element={<ProtectedRoute><App /></ProtectedRoute>}>
      <Route path="/pos" element={<PosPage />} />
      <Route path="/sales" element={<SalesPage />} />
      <Route path="/payments" element={<PaymentsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/inventory" element={<InventoryPage />} />
      <Route path="/purchases" element={<PurchasesPage />} />
      <Route path="/customers" element={<CustomersPage />} />
      <Route path="/suppliers" element={<SuppliersPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin" element={<RoleBasedRoute roles={['ADMIN']}><AdminPage /></RoleBasedRoute>} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
}
