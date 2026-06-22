import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { IUser } from '../models/User'

export interface JwtPayload {
  userId: string
  email:  string
}

export const signToken = (user: IUser): string => {
  return jwt.sign(
    { userId: user._id.toString(), email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  )
}

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}