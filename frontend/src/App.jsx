import OnlineCompiler from "./pages/OnlineCompiler/OnlineCompiler";
import PracticeProblems from "./pages/PracticeProblems/PracticeProblems";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./main.css";
import HomePage from "./pages/HomePage/HomePage";
function App() {
        return (
                <>
                        {" "}
                        <Router>
                                <Routes>
                                        <Route path="/" element={<HomePage/>} />
                                        <Route path="/onlinecompiler" element={<OnlineCompiler />} />
                                        <Route path="/practiceproblems" element={<PracticeProblems />} />
                                </Routes>
                        </Router>
                </>
        );
}

export default App;
