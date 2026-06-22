import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiError } from '../../utils/apiError'
import {
  listProblems,
  getProblemBySlug,
  createProblem,
  getUserSubmissions,
} from './problems.service'
import { z } from 'zod'

const createProblemSchema = z.object({
  title:       z.string().min(3),
  description: z.string().min(10),
  difficulty:  z.enum(['easy', 'medium', 'hard']),
  tags:        z.array(z.string()).default([]),
  testCases:   z.array(z.object({ input: z.string(), expectedOutput: z.string() })).min(1),
  examples:    z.array(z.object({ input: z.string(), expectedOutput: z.string() })).min(1),
  constraints: z.string().default(''),
})

export const getProblems = asyncHandler(async (req: Request, res: Response) => {
  const page       = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit      = Math.min(50, parseInt(req.query.limit as string) || 20)
  const difficulty = req.query.difficulty as string | undefined
  const tag        = req.query.tag as string | undefined

  const result = await listProblems({ page, limit, difficulty, tag })
  res.status(200).json({ success: true, ...result })
})

export const getProblem = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params
  const problem  = await getProblemBySlug(slug)
  res.status(200).json({ success: true, problem })
})

export const addProblem = asyncHandler(async (req: Request, res: Response) => {
  const parsed = createProblemSchema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Validation failed', parsed.error.errors)

  const problem = await createProblem(parsed.data)
  res.status(201).json({ success: true, problem })
})

export const getSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const { problemId } = req.params
  const userId        = req.user!.id

  const submissions = await getUserSubmissions(userId, problemId)
  res.status(200).json({ success: true, submissions })
})