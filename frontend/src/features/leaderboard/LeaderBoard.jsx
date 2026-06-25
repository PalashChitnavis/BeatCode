import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Navbar from "@/components/layout/Navbar"
import { getLeaderboard } from "@/services/leaderboardApi"

const CROWN_COLORS = ["text-yellow-400", "text-gray-300", "text-amber-600"]

const getDaysSince = (dateString) => {
  const diff = Date.now() - new Date(dateString).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

const UserModal = ({ user, onClose }) => (
  <>
    <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-gray-900 border border-gray-700 rounded-2xl p-6 flex flex-col items-center gap-5">
      <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=3b82f6&color=fff&size=80`}
        alt={user.username}
        className="h-20 w-20 rounded-full"
      />
      <div className="w-full flex flex-col gap-2 text-sm">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Username</span>
          <span className="text-white font-medium">{user.username}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Email</span>
          <span className="text-white">{user.email}</span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Problems solved</span>
          <span className="text-white">{user.solvedCount ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">BeatCoder since</span>
          <span className="text-white">{getDaysSince(user.createdAt)} days</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition"
      >
        Close
      </button>
    </div>
  </>
)

const LeaderBoard = () => {
  const [selectedUser, setSelectedUser] = useState(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["leaderboard"],
    queryFn:  getLeaderboard,
    staleTime: 1000 * 60 * 2,
  })

  const entries = data?.leaderboard ?? []

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white">
      <Navbar />

      <div className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-2xl font-bold mb-8">Leaderboard</h1>

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-400 mt-20">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
            Loading...
          </div>
        )}

        {isError && (
          <p className="text-gray-500 mt-20">Failed to load leaderboard.</p>
        )}

        {!isLoading && !isError && entries.length === 0 && (
          <p className="text-gray-500 mt-20">No data yet. Solve some problems!</p>
        )}

        {!isLoading && entries.length > 0 && (
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="px-5 py-3 text-left font-medium w-12">Rank</th>
                  <th className="px-5 py-3 text-left font-medium">User</th>
                  <th className="px-5 py-3 text-right font-medium">Solved</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, i) => (
                  <tr
                    key={entry._id ?? i}
                    onClick={() => setSelectedUser(entry)}
                    className="border-b border-gray-800 last:border-0 hover:bg-gray-800/50 cursor-pointer transition"
                  >
                    <td className="px-5 py-3">
                      <span className={`font-bold ${CROWN_COLORS[i] ?? "text-gray-400"}`}>
                        {i < 3 ? "♛" : i + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=3b82f6&color=fff`}
                          alt={entry.username}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-white font-medium">{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-300">
                      {entry.solvedCount ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

export default LeaderBoard