import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setRunning, setOutput } from "@/store/slices/outputSlice"
import { runCode } from "@/services/executionApi"
import { toast } from "react-toastify"
import Navbar from "@/components/layout/Navbar"
import CodeEditor from "@/components/editor/CodeEditor"
import EditorNavbar from "@/components/editor/EditorNavbar"
import InputArea from "@/components/editor/InputArea"
import OutputPanel from "@/components/editor/OutputPanel"

const OnlineCompiler = () => {
  const dispatch  = useDispatch()
  const code      = useSelector((s) => s.code.value)
  const language  = useSelector((s) => s.language.value)
  const isRunning = useSelector((s) => s.output.isRunning)
  const [stdin, setStdin] = useState("")

  const handleRun = async () => {
    if (!code?.trim()) {
      toast.warn("Write some code first")
      return
    }
    dispatch(setRunning())
    try {
      const data = await runCode({ code, language, stdin })
      dispatch(setOutput({
        stdout:  data.stdout,
        stderr:  data.stderr,
        runtime: data.runtime,
        status:  null,
      }))
    } catch (err) {
      dispatch(setOutput({ stdout: null, stderr: err.message, runtime: null, status: null }))
      toast.error("Execution failed")
    }
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 gap-3 p-3 overflow-hidden">

        {/* Left — editor */}
        <div className="flex flex-col flex-1 gap-2 min-h-0">
          <EditorNavbar />
          <div className="flex-1 min-h-0">
            <CodeEditor />
          </div>
        </div>

        {/* Right — input + output + run */}
        <div className="flex flex-col w-full lg:w-80 xl:w-96 gap-3 min-h-0">
          <div className="h-36 shrink-0">
            <InputArea value={stdin} onChange={setStdin} />
          </div>

          <div className="flex-1 min-h-0">
            <OutputPanel />
          </div>

          <button
            onClick={handleRun}
            disabled={isRunning}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shrink-0"
          >
            {isRunning ? "Running..." : "Run Code"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default OnlineCompiler