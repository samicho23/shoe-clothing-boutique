import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { requireRoles } from '../../middlewares/role.middleware.js'
import { validateBody } from '../../middlewares/validate.middleware.js'
import { createProductController, listProductsController } from './product.controller.js'
import { productSchema } from './product.validation.js'

export const productRoutes = Router()
productRoutes.get('/', listProductsController)
productRoutes.post('/', requireAuth, requireRoles('ADMIN', 'MANAGER'), validateBody(productSchema), createProductController)
