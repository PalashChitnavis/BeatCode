import { Link } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"

const FEATURES = [
  {
    title:       "Practice Problems",
    description: "Solve curated coding problems across difficulty levels. Track your progress and climb the leaderboard.",
    link:        "/practiceproblems",
    label:       "Start Practicing",
    color:       "blue",
  },
  {
    title:       "Online Compiler",
    description: "Write and run code instantly in Python, C++, Java, or JavaScript. No setup required.",
    link:        "/onlinecompiler",
    label:       "Open Compiler",
    color:       "green",
  },
  {
    title:       "Code Room",
    description: "Collaborate in real time with a partner. Share code, run it together, and video call.",
    link:        "/room",
    label:       "Create a Room",
    color:       "purple",
  },
]

const COLOR_MAP = {
  blue:   { border: "border-blue-500",   text: "text-blue-400",   bg: "bg-blue-600 hover:bg-blue-700"   },
  green:  { border: "border-green-500",  text: "text-green-400",  bg: "bg-green-600 hover:bg-green-700"  },
  purple: { border: "border-purple-500", text: "text-purple-400", bg: "bg-purple-600 hover:bg-purple-700" },
}

const HomePage = () => (
  <div className="flex flex-col min-h-screen w-full bg-gray-950 text-white">
    <Navbar />

    {/* Hero */}
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-center gap-6">
      <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
        Beat<span className="text-blue-500">Code</span>
      </h1>
      <p className="text-xl lg:text-2xl text-gray-400 max-w-xl">
        A better way to level up your coding.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link
          to="/practiceproblems"
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-lg"
        >
          Get Started
        </Link>
        <Link
          to="/onlinecompiler"
          className="px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition text-lg"
        >
          Try Compiler
        </Link>
      </div>
    </div>

    {/* Feature cards */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-24 max-w-6xl mx-auto w-full">
      {FEATURES.map((f) => {
        const c = COLOR_MAP[f.color]
        return (
          <div
            key={f.title}
            className={`bg-gray-900 border ${c.border} border-opacity-30 rounded-2xl p-6 flex flex-col gap-4 hover:border-opacity-60 transition`}
          >
            <h2 className={`text-xl font-bold ${c.text}`}>{f.title}</h2>
            <p className="text-gray-400 text-sm leading-relaxed flex-1">{f.description}</p>
            <Link
              to={f.link}
              className={`${c.bg} text-white text-sm font-semibold px-4 py-2 rounded-lg transition text-center`}
            >
              {f.label}
            </Link>
          </div>
        )
      })}
    </div>
  </div>
)

export default HomePage