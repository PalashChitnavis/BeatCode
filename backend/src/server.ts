import { createServer } from 'http'
import { createApp } from './app'
import { connectDB } from './config/database'
import { env } from './config/env'
import { logger } from './utils/logger'

const bootstrap = async () => {
  await connectDB()

  const app        = createApp()
  const httpServer = createServer(app)

  httpServer.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`)
  })
}

bootstrap()