import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { registerUser, loginUser } from './auth.service'
import { z } from 'zod'
import { ApiError } from '../../utils/apiError'
import { env } from '../../config/env'

const cookieOptions = {
  httpOnly: true,
  secure:   env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge:   7 * 24 * 60 * 60 * 1000,
}

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email:    z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Validation failed', parsed.error.errors)

  const { user, token } = await registerUser(parsed.data)

  res.cookie('token', token, cookieOptions)
  res.status(201).json({ success: true, user })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Validation failed', parsed.error.errors)

  const { user, token } = await loginUser(parsed.data)

  res.cookie('token', token, cookieOptions)
  res.status(200).json({ success: true, user })
})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie('token', cookieOptions)
  res.status(200).json({ success: true, message: 'Logged out' })
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({ success: true, user: req.user })
})