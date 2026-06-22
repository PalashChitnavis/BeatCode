import { User } from '../../models/User'
import { ApiError } from '../../utils/apiError'
import { signToken } from '../../utils/jwt'

interface RegisterInput {
  username: string
  email:    string
  password: string
}

interface LoginInput {
  email:    string
  password: string
}

export const registerUser = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email })
  if (existing) throw new ApiError(409, 'Email already in use')

  const user = await User.create(input)
  const token = signToken(user)

  return { user: { id: user._id, username: user.username, email: user.email }, token }
}

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select('+password')
  if (!user) throw new ApiError(401, 'Invalid email or password')

  const match = await user.comparePassword(input.password)
  if (!match) throw new ApiError(401, 'Invalid email or password')

  const token = signToken(user)

  return { user: { id: user._id, username: user.username, email: user.email }, token }
}