import { Request, Response, NextFunction } from 'express'
import { verifyToken, JwtPayload } from '../utils/jwt'
import { ApiError } from '../utils/apiError'
import { User } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id:       string
        username: string
        email:    string
      }
    }
  }
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.token
    if (!token) throw new ApiError(401, 'Not authenticated')

    const payload: JwtPayload = verifyToken(token)

    const user = await User.findById(payload.userId).select('username email')
    if (!user) throw new ApiError(401, 'User no longer exists')

    req.user = { id: user._id.toString(), username: user.username, email: user.email }
    next()
  } catch (err) {
    next(err)
  }
}