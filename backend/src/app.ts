import express from 'express'
import helmet from 'helmet'
import { corsMiddleware } from './config/cors.js'
import { swaggerDocument } from './config/swagger.js'
import { errorMiddleware } from './middlewares/error.middleware.js'
import { notFoundMiddleware } from './middlewares/notFound.middleware.js'
import { authRoutes } from './modules/auth/auth.routes.js'
import { productRoutes } from './modules/products/product.routes.js'
import swaggerUi from 'swagger-ui-express'

export const app = express()
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/api/docs.json', (_req, res) => res.json(swaggerDocument))
app.use(helmet())
app.use(corsMiddleware)
app.use(express.json({ limit: '1mb' }))
app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok', service: 'atelier-backend', timestamp: new Date().toISOString() }))
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/products', productRoutes)
app.use(notFoundMiddleware)
app.use(errorMiddleware)
