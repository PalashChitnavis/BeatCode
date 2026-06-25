import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "@/components/layout/Navbar"
import { getProblems } from "@/services/problemsApi"

const DIFFICULTIES = ["all", "easy", "medium", "hard"]

const DIFFICULTY_STYLES = {
  easy:   "text-green-400",
  medium: "text-yellow-400",
  hard:   "text-red-400",
}

const PracticeProblems = () => {
  const { user } = useSelector((s) => s.user)
  const [difficulty, setDifficulty] = useState("all")
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["problems", difficulty, page],
    queryFn:  () => getProblems({
      difficulty: difficulty === "all" ? undefined : difficulty,
      page,
    }),
  })

  const problems = data?.problems ?? []
  const total    = data?.total    ?? 0
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="flex flex-col h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">Practice Problems</h1>
            {user && (
              <p className="text-gray-400 text-sm mt-1">
                Welcome back, {user.username}
              </p>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => { setDifficulty(d); setPage(1) }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition
                  ${difficulty === d
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-left">
                  <th className="px-6 py-3 font-medium w-12">#</th>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Difficulty</th>
                  <th className="px-6 py-3 font-medium">Tags</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="px-6 py-4"><div className="h-4 w-6 bg-gray-800 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-48 bg-gray-800 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-800 rounded animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-800 rounded animate-pulse" /></td>
                    </tr>
                  ))
                )}

                {isError && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Failed to load problems. Try refreshing.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && problems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No problems found.
                    </td>
                  </tr>
                )}

                {!isLoading && problems.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                  >
                    <td className="px-6 py-4 text-gray-500">
                      {(page - 1) * 20 + index + 1}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/practiceproblems/questions/${problem.slug}`}
                        className="text-white hover:text-blue-400 transition font-medium"
                      >
                        {problem.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={DIFFICULTY_STYLES[problem.difficulty] ?? "text-gray-400"}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {problem.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition"
              >
                Previous
              </button>
              <span className="text-gray-400 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-700 transition"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default PracticeProblems