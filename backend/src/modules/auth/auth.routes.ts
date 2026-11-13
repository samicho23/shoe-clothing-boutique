import { Router } from 'express'
import { requireAuth } from '../../middlewares/auth.middleware.js'
import { validateBody } from '../../middlewares/validate.middleware.js'
import { forgotPasswordController, loginController, logoutController, meController, registerController, resetPasswordController } from './auth.controller.js'
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.validation.js'

export const authRoutes = Router()
authRoutes.post('/login', validateBody(loginSchema), loginController)
authRoutes.post('/register', validateBody(registerSchema), registerController)
authRoutes.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPasswordController)
authRoutes.post('/reset-password', validateBody(resetPasswordSchema), resetPasswordController)
authRoutes.post('/logout', requireAuth, logoutController)
authRoutes.get('/me', requireAuth, meController)
