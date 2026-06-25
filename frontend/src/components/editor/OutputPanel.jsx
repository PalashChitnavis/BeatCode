import { useSelector } from "react-redux"

const STATUS_STYLES = {
  accepted:             "text-green-400",
  wrong_answer:         "text-red-400",
  time_limit_exceeded:  "text-yellow-400",
  runtime_error:        "text-orange-400",
  compilation_error:    "text-red-400",
}

const STATUS_LABELS = {
  accepted:             "✓ Accepted",
  wrong_answer:         "✗ Wrong Answer",
  time_limit_exceeded:  "⏱ Time Limit Exceeded",
  runtime_error:        "⚠ Runtime Error",
  compilation_error:    "⚠ Compilation Error",
}

const OutputPanel = () => {
  const { stdout, stderr, runtime, status, isRunning } = useSelector((s) => s.output)

  if (isRunning) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-xs text-gray-400 font-medium px-1 pb-1">Output</p>
        <div className="flex-1 flex items-center justify-center bg-gray-800 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-blue-500" />
            Running...
          </div>
        </div>
      </div>
    )
  }

  const hasOutput = stdout !== null || stderr !== null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-1 pb-1">
        <p className="text-xs text-gray-400 font-medium">Output</p>
        {runtime !== null && (
          <p className="text-xs text-gray-500">{runtime}ms</p>
        )}
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 overflow-auto font-mono text-sm">
        {!hasOutput && (
          <p className="text-gray-600">Run your code to see output here.</p>
        )}

        {status && (
          <p className={`font-semibold mb-2 ${STATUS_STYLES[status] ?? "text-gray-300"}`}>
            {STATUS_LABELS[status] ?? status}
          </p>
        )}

        {stdout && (
          <pre className="text-gray-200 whitespace-pre-wrap">{stdout}</pre>
        )}

        {stderr && (
          <pre className="text-red-400 whitespace-pre-wrap mt-2">{stderr}</pre>
        )}
      </div>
    </div>
  )
}

export default OutputPanel