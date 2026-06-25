import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "@/components/layout/Navbar"

const Room = () => {
  const navigate    = useNavigate()
  const { user }    = useSelector((s) => s.user)
  const [roomId, setRoomId] = useState("")

  const hostRoom = () => {
    const id = Math.random().toString(36).substring(2, 9)
    navigate(`/room/${id}`)
  }

  const joinRoom = () => {
    const id = roomId.trim()
    if (!id) return
    navigate(`/room/${id}`)
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Host */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-6">
            <div className="h-14 w-14 rounded-full bg-blue-600/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-white font-bold text-xl">Host a Room</h2>
              <p className="text-gray-400 text-sm mt-1">Create a new room and invite someone to join</p>
            </div>
            <button
              onClick={hostRoom}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
              Create Room
            </button>
          </div>

          {/* Join */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-6">
            <div className="h-14 w-14 rounded-full bg-green-600/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-white font-bold text-xl">Join a Room</h2>
              <p className="text-gray-400 text-sm mt-1">Enter a room ID to join an existing session</p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                placeholder="Enter room ID"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
              />
              <button
                onClick={joinRoom}
                disabled={!roomId.trim()}
                className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition"
              >
                Join Room
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Room