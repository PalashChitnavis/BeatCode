import api from "@/lib/axios"

export const getProblems = async ({ difficulty, tag, page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams()
  if (difficulty) params.set("difficulty", difficulty)
  if (tag)        params.set("tag", tag)
  params.set("page",  page)
  params.set("limit", limit)
  const res = await api.get(`/api/problems?${params}`)
  return res.data
}

export const getProblem = async (slug) => {
  const res = await api.get(`/api/problems/${slug}`)
  return res.data
}

export const getMySubmissions = async (problemId) => {
  const res = await api.get(`/api/problems/${problemId}/submissions`)
  return res.data
}