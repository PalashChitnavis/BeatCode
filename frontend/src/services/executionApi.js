import api from "@/lib/axios"

export const runCode = async ({ code, language, stdin }) => {
  const res = await api.post("/api/execution/run", { code, language, stdin })
  return res.data
}

export const submitSolution = async ({ code, language, slug }) => {
  const res = await api.post(`/api/execution/${slug}/submit`, { code, language })
  return res.data
}