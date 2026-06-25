import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import api from "@/lib/axios"

const STATUS_STYLES = {
  accepted:             "text-green-400 bg-green-400/10",
  wrong_answer:         "text-red-400 bg-red-400/10",
  runtime_error:        "text-orange-400 bg-orange-400/10",
  compilation_error:    "text-red-400 bg-red-400/10",
  time_limit_exceeded:  "text-yellow-400 bg-yellow-400/10",
}

const getAllSubmissions = async () => {
  const res = await api.get("/api/submissions")
  return res.data
}

const SubmissionPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["all-submissions"],
    queryFn:  getAllSubmissions,
  })

  const submissions = data?.submissions ?? []

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white">
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">My Submissions</h1>

          <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-left">
                  <th className="px-5 py-3 font-medium">Problem</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Language</th>
                  <th className="px-5 py-3 font-medium">Runtime</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-800">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))}

                {isError && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                      Failed to load submissions.
                    </td>
                  </tr>
                )}

                {!isLoading && submissions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                      No submissions yet.{" "}
                      <Link to="/practiceproblems" className="text-blue-400 hover:underline">
                        Solve a problem
                      </Link>
                    </td>
                  </tr>
                )}

                {!isLoading && submissions.map((sub) => (
                  <tr key={sub._id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800/40 transition">
                    <td className="px-5 py-3">
                      <Link
                        to={`/practiceproblems/questions/${sub.problemId?.slug ?? ""}`}
                        className="text-blue-400 hover:underline"
                      >
                        {sub.problemId?.title ?? "Unknown"}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${STATUS_STYLES[sub.status] ?? "text-gray-400 bg-gray-700"}`}>
                        {sub.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-300 capitalize">{sub.language}</td>
                    <td className="px-5 py-3 text-gray-300">{sub.runtime > 0 ? `${sub.runtime}ms` : "—"}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{new Date(sub.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubmissionPage