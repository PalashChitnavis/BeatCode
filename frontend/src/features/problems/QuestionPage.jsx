import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useSelector, useDispatch } from "react-redux"
import { clearOutput } from "@/store/slices/outputSlice"
import { getProblem, getMySubmissions } from "@/services/problemsApi"
import { submitSolution } from "@/services/executionApi"
import { setRunning, setOutput } from "@/store/slices/outputSlice"
import { toast } from "react-toastify"
import Navbar from "@/components/layout/Navbar"
import CodeEditor from "@/components/editor/CodeEditor"
import EditorNavbar from "@/components/editor/EditorNavbar"
import OutputPanel from "@/components/editor/OutputPanel"
import FullScreenConfetti from "@/components/ui/FullScreenConfetti"

const DIFFICULTY_STYLES = {
  easy:   "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  hard:   "text-red-400 bg-red-400/10",
}

const STATUS_STYLES = {
  accepted:          "text-green-400 bg-green-400/10",
  wrong_answer:      "text-red-400 bg-red-400/10",
  runtime_error:     "text-orange-400 bg-orange-400/10",
  compilation_error: "text-red-400 bg-red-400/10",
  time_limit_exceeded: "text-yellow-400 bg-yellow-400/10",
}

const TabButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium border-b-2 transition
      ${active
        ? "border-blue-500 text-white"
        : "border-transparent text-gray-400 hover:text-gray-200"
      }`}
  >
    {label}
  </button>
)

const QuestionTab = ({ problem }) => (
  <div className="p-4 flex flex-col gap-4">
    <div className="flex items-center gap-3 flex-wrap">
      <h1 className="text-white font-bold text-xl">{problem.title}</h1>
      <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${DIFFICULTY_STYLES[problem.difficulty]}`}>
        {problem.difficulty}
      </span>
    </div>

    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
      {problem.description}
    </p>

    {problem.examples?.length > 0 && (
      <div className="flex flex-col gap-3">
        <h3 className="text-white font-semibold text-sm">Examples</h3>
        {problem.examples.map((ex, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-3 text-sm font-mono">
            <p className="text-gray-400">Input:</p>
            <pre className="text-gray-200 mt-1">{ex.input}</pre>
            <p className="text-gray-400 mt-2">Output:</p>
            <pre className="text-gray-200 mt-1">{ex.expectedOutput}</pre>
          </div>
        ))}
      </div>
    )}

    {problem.constraints && (
      <div>
        <h3 className="text-white font-semibold text-sm mb-1">Constraints</h3>
        <p className="text-gray-300 text-sm font-mono bg-gray-800 rounded-lg p-3">
          {problem.constraints}
        </p>
      </div>
    )}

    {problem.tags?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {problem.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-md">
            {tag}
          </span>
        ))}
      </div>
    )}
  </div>
)

const SubmissionsTab = ({ problemId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["submissions", problemId],
    queryFn:  () => getMySubmissions(problemId),
    enabled:  !!problemId,
  })

  const submissions = data?.submissions ?? []

  if (isLoading) return (
    <div className="flex items-center justify-center h-32">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
    </div>
  )

  if (submissions.length === 0) return (
    <div className="p-6 text-center text-gray-500 text-sm">No submissions yet.</div>
  )

  return (
    <div className="flex flex-col divide-y divide-gray-700">
      {submissions.map((sub) => (
        <div key={sub._id} className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_STYLES[sub.status] ?? "text-gray-400 bg-gray-700"}`}>
              {sub.status.replace(/_/g, " ")}
            </span>
            <span className="text-gray-400 text-xs capitalize">{sub.language}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {sub.runtime > 0 && <span>{sub.runtime}ms</span>}
            <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const QuestionPage = () => {
  const { slug }   = useParams()
  const dispatch   = useDispatch()
  const [tab, setTab]               = useState("question")
  const [showOutput, setShowOutput] = useState(false)
  const { status }  = useSelector((s) => s.output)
  const isRunning   = useSelector((s) => s.output.isRunning)
  const code        = useSelector((s) => s.code.value)
  const language    = useSelector((s) => s.language.value)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["problem", slug],
    queryFn:  () => getProblem(slug),
    enabled:  !!slug,
  })

  const problem = data?.problem

  // Show output panel automatically after a submission
  useEffect(() => {
    if (status !== null) setShowOutput(true)
  }, [status])

  // Clear output when navigating to a new problem
  useEffect(() => {
    dispatch(clearOutput())
    setShowOutput(false)
    setTab("question")
  }, [slug, dispatch])

  const handleSubmit = async () => {
    if (!code?.trim()) {
      toast.warn("Write some code first")
      return
    }
    dispatch(setRunning())
    setShowOutput(true)
    try {
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
        toast.error(data.status.replace(/_/g, " "))
      }
    } catch (err) {
      dispatch(setOutput({ stdout: null, stderr: err.message, runtime: null, status: null }))
      toast.error("Submission failed")
    }
  }

  if (isLoading) return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
      </div>
    </div>
  )

  if (isError || !problem) return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Problem not found.
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden">
      {status === "accepted" && <FullScreenConfetti />}
      <Navbar />

      <div className="flex flex-col lg:flex-row flex-1 gap-2 p-2 overflow-hidden min-h-0">

        {/* Left panel — problem info */}
        <div className="flex flex-col w-full lg:w-[42%] bg-gray-900 border border-gray-700 rounded-xl overflow-hidden min-h-0">
          <div className="flex border-b border-gray-700 px-2 shrink-0">
            <TabButton label="Question"    active={tab === "question"}    onClick={() => setTab("question")} />
            <TabButton label="Submissions" active={tab === "submissions"} onClick={() => setTab("submissions")} />
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {tab === "question"    && <QuestionTab problem={problem} />}
            {tab === "submissions" && <SubmissionsTab problemId={problem._id} />}
          </div>
        </div>

        {/* Right panel — editor + output */}
        <div className="flex flex-col flex-1 gap-2 min-h-0">
          <EditorNavbar />

          <div className={`min-h-0 transition-all ${showOutput ? "flex-[2]" : "flex-1"}`}>
            <CodeEditor slug={slug} />
          </div>

          {/* Output toggle bar */}
          <button
            onClick={() => setShowOutput((v) => !v)}
            className="flex items-center justify-between px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition shrink-0"
          >
            <span>Output</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${showOutput ? "rotate-180" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          {showOutput && (
            <div className="h-48 shrink-0">
              <OutputPanel />
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isRunning}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition shrink-0 text-sm"
          >
            {isRunning ? "Running..." : "Submit Solution"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionPage