import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { setRunning, setOutput } from "@/store/slices/outputSlice"
import { runCode, submitSolution } from "@/services/executionApi"

const RunButton = () => {
  const dispatch  = useDispatch()
  const location  = useLocation()
  const { slug }  = useParams()
  const code      = useSelector((s) => s.code.value)
  const language  = useSelector((s) => s.language.value)
  const isRunning = useSelector((s) => s.output.isRunning)
  const [stdin, setStdin] = useState("")

  const isPracticePage = location.pathname.startsWith("/practiceproblems/questions")

  const handleRun = async () => {
    if (!code?.trim()) {
      toast.warn("Write some code first")
      return
    }
    dispatch(setRunning())
    try {
      if (isPracticePage && slug) {
        const data = await submitSolution({ code, language, slug })
        dispatch(setOutput({
          stdout:  data.status,
          stderr:  data.stderr,
          runtime: data.runtime,
          status:  data.status,
        }))
        if (data.status === "accepted") {
          toast.success("All test cases passed!")
        } else {
          toast.error(`${data.status.replace(/_/g, " ")}`)
        }
      } else {
        const data = await runCode({ code, language, stdin: "" })
        dispatch(setOutput({
          stdout:  data.stdout,
          stderr:  data.stderr,
          runtime: data.runtime,
          status:  null,
        }))
      }
    } catch (err) {
      dispatch(setOutput({ stdout: null, stderr: err.message, runtime: null, status: null }))
      toast.error("Execution failed")
    }
  }

  return (
    <button
      onClick={handleRun}
      disabled={isRunning}
      className="px-5 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
    >
      {isRunning ? "Running..." : isPracticePage ? "Submit" : "Run"}
    </button>
  )
}

export default RunButton