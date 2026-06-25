import api from "@/lib/axios"

export const getLeaderboard = async () => {
  const res = await api.get("/api/leaderboard")
  return res.data
}