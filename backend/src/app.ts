import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import { notFound } from './middleware/notFound'
import { errorHandler } from './middleware/errorHandler'
import authRoutes from './modules/auth/auth.routes'
import problemRoutes from './modules/problems/problems.routes'
import executionRoutes from './modules/execution/execution.routes'


export const createApp = () => {
  const app = express()

  app.use(cors({
    origin:      env.FRONTEND_URL,
    credentials: true,
  }))

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  // routes go here later — one line per module
  app.use('/api/auth', authRoutes)  
  app.use('/api/problems', problemRoutes)
  app.use('/api/execution', executionRoutes)


  app.use(notFound)
  app.use(errorHandler)

  return app
}