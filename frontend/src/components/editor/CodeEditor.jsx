import AceEditor from "react-ace"
import { useDispatch, useSelector } from "react-redux"
import { updateCode } from "@/store/slices/codeSlice"
import { useEditorPreferences } from "@/hooks/useEditorPreferences"
import { useEffect } from "react"
import { getBoilerplateCode } from "@/utils/getBoilerplateCode"

import "ace-builds/src-noconflict/mode-python"
import "ace-builds/src-noconflict/mode-c_cpp"
import "ace-builds/src-noconflict/mode-java"
import "ace-builds/src-noconflict/mode-javascript"

import "ace-builds/src-noconflict/theme-monokai"
import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/theme-tomorrow"
import "ace-builds/src-noconflict/theme-twilight"
import "ace-builds/src-noconflict/theme-xcode"
import "ace-builds/src-noconflict/theme-solarized_dark"
import "ace-builds/src-noconflict/theme-terminal"

import "ace-builds/src-noconflict/ext-language_tools"

const ACE_LANGUAGE_MAP = {
  python:     "python",
  cpp:        "c_cpp",
  java:       "java",
  javascript: "javascript",
}

const CodeEditor = ({ socket, roomID, slug }) => {
  const dispatch  = useDispatch()
  const code      = useSelector((s) => s.code.value)
  const language  = useSelector((s) => s.language.value)
  const { user }  = useSelector((s) => s.user)
  const { theme, fontSize, tabSize } = useEditorPreferences()

  // Set boilerplate when language changes
  useEffect(() => {
    const boilerplate = getBoilerplateCode(language, slug)
    dispatch(updateCode(boilerplate))
  }, [language, slug, dispatch])

  const handleChange = (value) => {
    dispatch(updateCode(value))
    if (socket && roomID) {
      socket.emit("codeUpdate", { code: value, roomID })
    }
  }

  return (
    <div className="w-full h-full">
      <AceEditor
        mode={ACE_LANGUAGE_MAP[language] ?? "python"}
        theme={theme}
        fontSize={fontSize}
        tabSize={parseInt(tabSize)}
        name="ace-editor"
        width="100%"
        height="100%"
        value={code ?? ""}
        onChange={handleChange}
        showPrintMargin={false}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets:           true,
          useWorker:                false,
        }}
        wrapEnabled={true}
      />
    </div>
  )
}

export default CodeEditor