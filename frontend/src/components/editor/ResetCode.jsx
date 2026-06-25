import { useLocation, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { updateCode } from "@/store/slices/codeSlice"
import { clearOutput } from "@/store/slices/outputSlice"
import { getBoilerplateCode } from "@/utils/getBoilerplateCode"

const ResetCode = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const { slug }  = useParams()
  const language  = useSelector((s) => s.language.value)

  const handleReset = () => {
    const code = getBoilerplateCode(language, slug)
    dispatch(updateCode(code))
    dispatch(clearOutput())
  }

  return (
    <button
      onClick={handleReset}
      className="text-gray-300 hover:text-white transition"
      title="Reset code"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-3.96"/>
      </svg>
    </button>
  )
}

export default ResetCode