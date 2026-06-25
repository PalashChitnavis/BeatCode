import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import HomePage          from "@/features/home/HomePage"
import OnlineCompiler    from "@/features/compiler/OnlineCompiler"
import PracticeProblems  from "@/features/problems/PracticeProblems"
import QuestionPage      from "@/features/problems/QuestionPage"
import SubmissionPage    from "@/features/problems/SubmissionPage"
import LeaderBoard       from "@/features/leaderboard/LeaderBoard"
import Room              from "@/features/room/Room"
import CodeRoom          from "@/features/room/CodeRoom"
import Settings          from "@/features/settings/Settings"
import LoginPage         from "@/features/auth/LoginPage"
import RegisterPage      from "@/features/auth/RegisterPage"
import ErrorPage         from "@/features/error/ErrorPage"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((s) => s.user)

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500" />
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => (
  <Routes>
    {/* public */}
    <Route path="/"                              element={<HomePage />} />
    <Route path="/onlinecompiler"                element={<OnlineCompiler />} />
    <Route path="/login"                         element={<LoginPage />} />
    <Route path="/register"                      element={<RegisterPage />} />

    {/* protected */}
    <Route path="/practiceproblems"              element={<ProtectedRoute><PracticeProblems /></ProtectedRoute>} />
    <Route path="/practiceproblems/questions/:slug" element={<ProtectedRoute><QuestionPage /></ProtectedRoute>} />
    <Route path="/submissions"                   element={<ProtectedRoute><SubmissionPage /></ProtectedRoute>} />
    <Route path="/leaderboard"                   element={<ProtectedRoute><LeaderBoard /></ProtectedRoute>} />
    <Route path="/room"                          element={<ProtectedRoute><Room /></ProtectedRoute>} />
    <Route path="/room/:roomID"                  element={<ProtectedRoute><CodeRoom /></ProtectedRoute>} />
    <Route path="/settings"                      element={<ProtectedRoute><Settings /></ProtectedRoute>} />

    <Route path="*"                              element={<ErrorPage />} />
  </Routes>
)

export default AppRoutes