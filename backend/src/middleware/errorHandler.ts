import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError'
import { logger } from '../utils/logger'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors:  err.errors,
    })
    return
  }

  logger.error('Unhandled error', err)

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    errors:  [],
  })
}