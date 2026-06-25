import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { clearUser } from "@/store/slices/userSlice"
import { logoutUser } from "@/services/authApi"
import { useState } from "react"

const Navbar = () => {
  const dispatch        = useDispatch()
  const navigate        = useNavigate()
  const { user, isAuthenticated } = useSelector((s) => s.user)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggingOut, setLoggingOut] = useState(false)

  const avatarUrl = user
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff`
    : null

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logoutUser()
      dispatch(clearUser())
      toast.success("Logged out")
      navigate("/")
    } catch {
      dispatch(clearUser())
      navigate("/")
    } finally {
      setLoggingOut(false)
      setProfileOpen(false)
    }
  }

  return (
    <nav className="w-full h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 shrink-0">
      <Link to="/" className="text-white font-bold text-xl tracking-tight">
        Beat<span className="text-blue-500">Code</span>
      </Link>

      <div className="flex items-center gap-6 text-sm text-gray-300">
        <Link to="/onlinecompiler" className="hover:text-white transition">Compiler</Link>
        <Link to="/practiceproblems" className="hover:text-white transition">Problems</Link>
        <Link to="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
        <Link to="/room" className="hover:text-white transition">Room</Link>
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="relative">
            <img
              src={avatarUrl}
              alt={user.username}
              onClick={() => setProfileOpen((o) => !o)}
              className="h-9 w-9 rounded-full cursor-pointer border-2 border-gray-600 hover:border-blue-500 transition"
            />
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setProfileOpen(false)}
                />
                <div className="absolute right-0 top-12 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-semibold text-sm">{user.username}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                  <div className="flex flex-col">
                    <Link
                      to="/submissions"
                      onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                    >
                      My Submissions
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition text-left disabled:opacity-50"
                    >
                      {isLoggingOut ? "Logging out..." : "Log Out"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg hover:border-gray-400 transition"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar