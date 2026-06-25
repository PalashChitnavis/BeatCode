import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { CopyToClipboard } from "react-copy-to-clipboard"
import ReactPlayer from "react-player"
import { toast } from "react-toastify"
import { useRoom } from "@/hooks/useRoom"
import Navbar from "@/components/layout/Navbar"
import CodeEditor from "@/components/editor/CodeEditor"
import EditorNavbar from "@/components/editor/EditorNavbar"
import OutputPanel from "@/components/editor/OutputPanel"
import InputArea from "@/components/editor/InputArea"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { setRunning, setOutput } from "@/store/slices/outputSlice"
import { runCode } from "@/services/executionApi"

const VideoBox = ({ stream, label }) => (
  <div className="relative h-full w-full bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
    {stream
      ? <ReactPlayer playing height="100%" width="100%" url={stream} volume={stream ? 1 : 0} />
      : <span className="text-gray-500 text-sm">{label}</span>
    }
  </div>
)

const CodeRoom = () => {
  const { roomID }  = useParams()
  const dispatch    = useDispatch()
  const { user }    = useSelector((s) => s.user)
  const code        = useSelector((s) => s.code.value)
  const language    = useSelector((s) => s.language.value)
  const isRunning   = useSelector((s) => s.output.isRunning)
  const [stdin, setStdin]           = useState("")
  const [showOutput, setShowOutput] = useState(false)

  const {
    socket,
    me,
    otherUser,
    myStream,
    otherStream,
    callState,
    startCall,
    endCall,
    leaveRoom,
    emitCode,
  } = useRoom(roomID, user?.username)

  const handleRun = async () => {
    if (!code?.trim()) {
      toast.warn("Write some code first")
      return
    }
    dispatch(setRunning())
    setShowOutput(true)
    try {
      const data = await runCode({ code, language, stdin })
      dispatch(setOutput({ stdout: data.stdout, stderr: data.stderr, runtime: data.runtime, status: null }))
    } catch (err) {
      dispatch(setOutput({ stdout: null, stderr: err.message, runtime: null, status: null }))
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 gap-2 p-2 overflow-hidden min-h-0">

        {/* Left sidebar — room info + video */}
        <div className="flex flex-col w-full lg:w-64 xl:w-72 gap-2 shrink-0">

          {/* Room ID */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-gray-400">Room ID</p>
              <p className="text-white text-sm font-mono truncate">{roomID}</p>
            </div>
            <CopyToClipboard text={roomID} onCopy={() => toast.success("Room ID copied!")}>
              <button className="text-gray-400 hover:text-white shrink-0 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </CopyToClipboard>
          </div>

          {/* Users */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 flex flex-col gap-2">
            <p className="text-xs text-gray-400 font-medium">Participants</p>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-white">{me.username} (you)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${otherUser.socketID ? "bg-green-500" : "bg-gray-600"}`} />
              <span className="text-sm text-gray-400">{otherUser.username}</span>
            </div>
          </div>

          {/* Video */}
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="h-32">
              <VideoBox stream={myStream}    label={me.username} />
            </div>
            <div className="h-32">
              <VideoBox stream={otherStream} label={otherUser.username} />
            </div>
          </div>

          {/* Call controls */}
          <div className="flex flex-col gap-2">
            {callState === "idle" && (
              <button
                onClick={startCall}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
                Start Video Call
              </button>
            )}
            {(callState === "incoming" || callState === "active") && (
              <button
                onClick={endCall}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                End Call
              </button>
            )}
            <button
              onClick={leaveRoom}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition"
            >
              Leave Room
            </button>
          </div>

        </div>

        {/* Right — editor + output */}
        <div className="flex flex-col flex-1 gap-2 min-h-0">
          <EditorNavbar socket={socket} roomID={roomID} />

          <div className={`min-h-0 transition-all ${showOutput ? "flex-[2]" : "flex-1"}`}>
            <CodeEditor socket={socket} roomID={roomID} />
          </div>

          <button
            onClick={() => setShowOutput((v) => !v)}
            className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition shrink-0"
          >
            <span>Output</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${showOutput ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          </button>

          {showOutput && (
            <div className="h-40 shrink-0 flex flex-col gap-2">
              <div className="h-24 shrink-0">
                <InputArea value={stdin} onChange={setStdin} />
              </div>
              <div className="flex-1 min-h-0">
                <OutputPanel />
              </div>
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shrink-0 text-sm"
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default CodeRoom