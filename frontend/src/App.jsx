import { useAuth } from "@/hooks/useAuth"
import AppRoutes from "@/routes"

const App = () => {
  useAuth()
  return (
    <div className="h-full w-full">
      <AppRoutes />
    </div>
  )
}

export default App