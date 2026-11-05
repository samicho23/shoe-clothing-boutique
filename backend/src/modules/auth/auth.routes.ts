import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { validateBody } from '../../middlewares/validate.middleware.js'
import { loginController, logoutController, meController } from './auth.controller.js'
import { loginSchema } from './auth.validation.js'

export const authRoutes = Router()
authRoutes.post('/login', validateBody(loginSchema), loginController)
authRoutes.post('/logout', requireAuth, logoutController)
authRoutes.get('/me', requireAuth, meController)
