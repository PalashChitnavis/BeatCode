import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { updateCode } from "@/store/slices/codeSlice"
import { updateLanguage } from "@/store/slices/languageSlice"
import { clearOutput } from "@/store/slices/outputSlice"
import LanguageSelector from "./LanguageSelector"
import EditorSettings from "./EditorSettings"
import ResetCode from "./ResetCode"
import RunButton from "./RunButton"

const EditorNavbar = ({ socket, roomID }) => {
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(updateLanguage("python"))
    dispatch(clearOutput())
    dispatch(updateCode(""))
  }, [location.pathname, dispatch])

  return (
    <div className="flex w-full items-center justify-between bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 gap-4">
      <LanguageSelector socket={socket} roomID={roomID} />

      <div className="flex items-center gap-3 ml-auto">
        <ResetCode />
        <EditorSettings />
        <RunButton />
      </div>
    </div>
  )
}

export default EditorNavbar