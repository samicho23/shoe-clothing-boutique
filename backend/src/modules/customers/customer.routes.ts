import { Router } from 'express'
import { resourceRouter } from '../resource-router.js'
export const customerRoutes = resourceRouter('customers')
