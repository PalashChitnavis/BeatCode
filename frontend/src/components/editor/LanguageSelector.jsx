import { useSelector, useDispatch } from "react-redux"
import { updateLanguage } from "@/store/slices/languageSlice"
import { clearOutput } from "@/store/slices/outputSlice"

const LANGUAGES = [
  { label: "Python",     value: "python"     },
  { label: "C++",        value: "cpp"        },
  { label: "Java",       value: "java"       },
  { label: "JavaScript", value: "javascript" },
]

const LanguageSelector = ({ socket, roomID }) => {
  const dispatch = useDispatch()
  const language = useSelector((s) => s.language.value)

  const handleChange = (e) => {
    const lang = e.target.value
    dispatch(updateLanguage(lang))
    dispatch(clearOutput())
    if (socket && roomID) {
      socket.emit("languageChange", { language: lang, roomID })
    }
  }

  return (
    <select
      value={language}
      onChange={handleChange}
      className="bg-gray-800 text-white text-sm border border-gray-600 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer transition"
    >
      {LANGUAGES.map((l) => (
        <option key={l.value} value={l.value}>{l.label}</option>
      ))}
    </select>
  )
}

export default LanguageSelector