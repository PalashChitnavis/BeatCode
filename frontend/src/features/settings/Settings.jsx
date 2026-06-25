import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { clearUser } from "@/store/slices/userSlice"
import { logoutUser } from "@/services/authApi"
import { toast } from "react-toastify"
import Navbar from "@/components/layout/Navbar"
import { useEditorPreferences } from "@/hooks/useEditorPreferences"

const getDaysSince = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="text-white text-sm font-medium">{value}</span>
  </div>
)

const Settings = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useSelector((s) => s.user)
  const { theme, fontSize, tabSize, setTheme, setFontSize, setTabSize } = useEditorPreferences()

  const handleLogout = async () => {
    try {
      await logoutUser()
    } finally {
      dispatch(clearUser())
      toast.success("Logged out")
      navigate("/")
    }
  }

  if (!user) return null

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=96`

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white">
      <Navbar />

      <div className="flex-1 flex flex-col items-center px-4 py-12 gap-8">

        {/* Avatar + name */}
        <div className="flex flex-col items-center gap-3">
          <img src={avatarUrl} alt={user.username} className="h-24 w-24 rounded-full" />
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>

        {/* Account info */}
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl px-5 py-1">
          <InfoRow label="Username"        value={user.username} />
          <InfoRow label="Email"           value={user.email} />
          {user.createdAt && (
            <InfoRow label="Member since"  value={`${getDaysSince(user.createdAt)} days ago`} />
          )}
        </div>

        {/* Editor preferences */}
        <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-sm">Editor Preferences</h2>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Theme</span>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              {["monokai","github","tomorrow","twilight","xcode","solarized_dark","terminal"].map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Font size</span>
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              {["12px","14px","16px","18px","20px","22px","24px"].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Tab size</span>
            <select value={tabSize} onChange={(e) => setTabSize(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none">
              {["2","4"].map(s => (
                <option key={s} value={s}>{s} spaces</option>
              ))}
            </select>
          </div>
        </div>

        {/* Logout */}
        <div className="w-full max-w-md">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 font-medium rounded-xl transition"
          >
            Log Out
          </button>
        </div>

      </div>
    </div>
  )
}

export default Settings