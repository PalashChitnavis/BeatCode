import mongoose from 'mongoose'
import { env } from './env'
import { logger } from '../utils/logger'

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGO_URI)
    logger.info('MongoDB connected')
  } catch (err) {
    logger.error('MongoDB connection failed', err)
    process.exit(1)
  }
}