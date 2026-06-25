import { Link } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"

const ErrorPage = () => (
  <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white">
    <Navbar />
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-8xl font-bold text-gray-700">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-gray-400 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
      >
        Go home
      </Link>
    </div>
  </div>
)

export default ErrorPage