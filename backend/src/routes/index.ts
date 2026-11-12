import { Router } from 'express'
import { authRoutes } from '../modules/auth/auth.routes.js'
import { categoryRoutes } from '../modules/categories/category.routes.js'
import { customerRoutes } from '../modules/customers/customer.routes.js'
import { dashboardRoutes } from '../modules/dashboard/dashboard.routes.js'
import { inventoryRoutes } from '../modules/inventory/inventory.routes.js'
import { paymentRoutes } from '../modules/payments/payment.routes.js'
import { productRoutes } from '../modules/products/product.routes.js'
import { purchaseRoutes } from '../modules/purchases/purchase.routes.js'
import { reportRoutes } from '../modules/reports/report.routes.js'
import { saleRoutes } from '../modules/sales/sale.routes.js'
import { supplierRoutes } from '../modules/suppliers/supplier.routes.js'
import { userRoutes } from '../modules/users/user.routes.js'
import { adminRoutes } from '../modules/admin/admin.routes.js'
import { metaRoutes } from '../modules/meta/meta.routes.js'
import { publicRoutes } from '../modules/public/public.routes.js'

export const apiRoutes = Router()

apiRoutes.use('/auth', authRoutes)
apiRoutes.use('/categories', categoryRoutes)
apiRoutes.use('/customers', customerRoutes)
apiRoutes.use('/dashboard', dashboardRoutes)
apiRoutes.use('/inventory', inventoryRoutes)
apiRoutes.use('/payments', paymentRoutes)
apiRoutes.use('/products', productRoutes)
apiRoutes.use('/purchases', purchaseRoutes)
apiRoutes.use('/reports', reportRoutes)
apiRoutes.use('/sales', saleRoutes)
apiRoutes.use('/suppliers', supplierRoutes)
apiRoutes.use('/users', userRoutes)
apiRoutes.use('/admin', adminRoutes)
apiRoutes.use('/meta', metaRoutes)
apiRoutes.use('/public', publicRoutes)
