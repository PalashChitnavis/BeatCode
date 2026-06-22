import { Request, Response } from 'express'
import { asyncHandler } from '../../utils/asyncHandler'
import { ApiError } from '../../utils/apiError'
import { executeCode, runCode } from './execution.service'
import { Problem } from '../../models/Problem'
import { Submission } from '../../models/Submission'
import { Language } from '../../models/Submission'
import { z } from 'zod'

const submitSchema = z.object({
  code:     z.string().min(1).max(50000),
  language: z.enum(['python', 'cpp', 'java', 'javascript']),
})

const runSchema = z.object({
  code:     z.string().min(1).max(50000),
  language: z.enum(['python', 'cpp', 'java', 'javascript']),
  stdin:    z.string().default(''),
})

export const submitSolution = asyncHandler(async (req: Request, res: Response) => {
  const parsed = submitSchema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Validation failed', parsed.error.errors)

  const { slug } = req.params
  const problem  = await Problem.findOne({ slug })
  if (!problem) throw new ApiError(404, 'Problem not found')

  const { code, language } = parsed.data

  const result = await executeCode(code, language as Language, problem.testCases)

  const submission = await Submission.create({
    userId:    req.user!.id,
    problemId: problem._id,
    code,
    language,
    status:  result.status,
    runtime: result.runtime,
    stderr:  result.stderr,
  })

  res.status(200).json({
    success: true,
    submissionId: submission._id,
    status:       result.status,
    runtime:      result.runtime,
    results:      result.results,
    stderr:       result.stderr,
  })
})

export const runUserCode = asyncHandler(async (req: Request, res: Response) => {
  const parsed = runSchema.safeParse(req.body)
  if (!parsed.success) throw new ApiError(400, 'Validation failed', parsed.error.errors)

  const { code, language, stdin } = parsed.data

  const result = await runCode(code, language as Language, stdin)

  res.status(200).json({
    success: true,
    stdout:  result.stdout,
    stderr:  result.stderr,
    runtime: result.runtime,
  })
})