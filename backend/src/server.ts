import { app } from './app.js'
import { env } from './config/env.js'
import { logger } from './config/logger.js'

app.listen(env.PORT, () => {
  logger.info('Atelier API listening', { url: `http://localhost:${env.PORT}` })
})
