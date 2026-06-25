import api from "@/lib/axios"

export const registerUser = async ({ username, email, password }) => {
  const res = await api.post("/api/auth/register", { username, email, password })
  return res.data
}

export const loginUser = async ({ email, password }) => {
  const res = await api.post("/api/auth/login", { email, password })
  return res.data
}

export const logoutUser = async () => {
  const res = await api.post("/api/auth/logout")
  return res.data
}

export const getMe = async () => {
  const res = await api.get("/api/auth/me")
  return res.data
}