import { Problem } from '../../models/Problem'
import { Submission } from '../../models/Submission'
import { ApiError } from '../../utils/apiError'
import { Language } from '../../models/Submission'

interface ListProblemsInput {
  difficulty?: string
  tag?:        string
  page:        number
  limit:       number
}

export const listProblems = async (input: ListProblemsInput) => {
  const filter: Record<string, unknown> = {}
  if (input.difficulty) filter.difficulty = input.difficulty
  if (input.tag)        filter.tags = input.tag

  const skip  = (input.page - 1) * input.limit
  const total = await Problem.countDocuments(filter)

  const problems = await Problem
    .find(filter)
    .select('title slug difficulty tags')
    .skip(skip)
    .limit(input.limit)
    .lean()

  return { problems, total, page: input.page, limit: input.limit }
}

export const getProblemBySlug = async (slug: string) => {
  const problem = await Problem
    .findOne({ slug })
    .select('-testCases')
    .lean()

  if (!problem) throw new ApiError(404, 'Problem not found')
  return problem
}

export const createProblem = async (data: {
  title:       string
  description: string
  difficulty:  string
  tags:        string[]
  testCases:   { input: string; expectedOutput: string }[]
  examples:    { input: string; expectedOutput: string }[]
  constraints: string
}) => {
  const slug = data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const existing = await Problem.findOne({ slug })
  if (existing) throw new ApiError(409, 'A problem with this title already exists')

  const problem = await Problem.create({ ...data, slug })
  return problem
}

export const getUserSubmissions = async (userId: string, problemId: string) => {
  return Submission
    .find({ userId, problemId })
    .select('-code')
    .sort({ createdAt: -1 })
    .lean()
}