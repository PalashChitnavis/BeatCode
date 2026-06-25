import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser, clearUser, setAuthLoading } from "@/store/slices/userSlice"
import api from "@/lib/axios"

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading } = useSelector((s) => s.user)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/auth/me")
        dispatch(setUser(res.data.user))
      } catch {
        dispatch(clearUser())
      }
    }
    checkAuth()
  }, [dispatch])

  const logout = async () => {
    try {
      await api.post("/api/auth/logout")
    } finally {
      dispatch(clearUser())
    }
  }

  return { user, isAuthenticated, isLoading, logout }
}