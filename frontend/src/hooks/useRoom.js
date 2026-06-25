import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import io from "socket.io-client"
import { useDispatch } from "react-redux"
import { updateCode } from "@/store/slices/codeSlice"
import { updateLanguage } from "@/store/slices/languageSlice"

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
}

export const useRoom = (roomID, username) => {
  const navigate   = useNavigate()
  const dispatch   = useDispatch()
  const socketRef  = useRef(null)
  const pcRef      = useRef(null)

  const [me,          setMe]          = useState({ username: username ?? "You", socketID: "" })
  const [otherUser,   setOtherUser]   = useState({ username: "Waiting...",      socketID: "" })
  const [myStream,    setMyStream]    = useState(null)
  const [otherStream, setOtherStream] = useState(null)
  const [callState,   setCallState]   = useState("idle") // idle | incoming | active

  // Connect socket once on mount
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL)
    socketRef.current = socket

    socket.emit("userdetails", { username, roomID })

    socket.on("getUserDetails", ({ users }) => {
      if (users.length === 1) {
        setMe(users[0])
        setOtherUser({ username: "Waiting...", socketID: "" })
        toast.info("Waiting for someone to join...")
      }
      if (users.length === 2) {
        const self  = users.find((u) => u.username === username) ?? users[1]
        const other = users.find((u) => u.username !== username) ?? users[0]
        setMe(self)
        setOtherUser(other)
        toast.info(`${other.username} joined the room`)
        dispatch(updateLanguage("python"))
        socket.emit("languageChange", { language: "python", roomID })
      }
    })

    socket.on("roomFull", () => {
      toast.warn("Room is full")
      navigate("/room")
    })

    socket.on("codeUpdate", ({ code }) => {
      dispatch(updateCode(code))
    })

    socket.on("languageChange", ({ language }) => {
      dispatch(updateLanguage(language))
    })

    // WebRTC signalling
    socket.on("incomingCall", async ({ offer, from }) => {
      setCallState("incoming")
      const pc = createPeerConnection(socket, from)
      pcRef.current = pc
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setMyStream(stream)
      stream.getTracks().forEach((t) => pc.addTrack(t, stream))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      socket.emit("callAnswer", { answer, to: from })
    })

    socket.on("callAccepted", async ({ answer }) => {
      await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer))
      setCallState("active")
    })

    socket.on("iceCandidate", async ({ candidate }) => {
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate))
      } catch {}
    })

    socket.on("endVideoCall", () => {
      endCallCleanup()
      toast.info("The other user ended the call")
    })

    return () => {
      socket.disconnect()
      endCallCleanup()
    }
  }, [roomID, username])

  const createPeerConnection = useCallback((socket, targetSocketId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS)
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit("iceCandidate", { candidate, to: targetSocketId })
      }
    }
    pc.ontrack = ({ streams }) => {
      setOtherStream(streams[0])
      setCallState("active")
    }
    return pc
  }, [])

  const startCall = useCallback(async () => {
    if (!otherUser.socketID) {
      toast.warn("No one else in the room yet")
      return
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    setMyStream(stream)
    const pc = createPeerConnection(socketRef.current, otherUser.socketID)
    pcRef.current = pc
    stream.getTracks().forEach((t) => pc.addTrack(t, stream))
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    socketRef.current.emit("callUser", { offer, to: otherUser.socketID })
    setCallState("incoming")
  }, [otherUser.socketID, createPeerConnection])

  const endCallCleanup = useCallback(() => {
    myStream?.getTracks().forEach((t) => t.stop())
    setMyStream(null)
    setOtherStream(null)
    pcRef.current?.close()
    pcRef.current = null
    setCallState("idle")
  }, [myStream])

  const endCall = useCallback(() => {
    socketRef.current?.emit("endVideoCall", { to: otherUser.socketID })
    endCallCleanup()
  }, [otherUser.socketID, endCallCleanup])

  const leaveRoom = useCallback(() => {
    endCallCleanup()
    socketRef.current?.emit("endVideoCall", { to: otherUser.socketID })
    navigate("/room")
  }, [otherUser.socketID, endCallCleanup, navigate])

  const emitCode = useCallback((code) => {
    socketRef.current?.emit("codeUpdate", { code, roomID })
  }, [roomID])

  return {
    socket:      socketRef.current,
    me,
    otherUser,
    myStream,
    otherStream,
    callState,
    startCall,
    endCall,
    leaveRoom,
    emitCode,
  }
}