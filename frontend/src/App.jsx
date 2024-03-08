/* eslint-disable react-hooks/exhaustive-deps */
import OnlineCompiler from "./pages/OnlineCompiler/OnlineCompiler";
import PracticeProblems from "./pages/PracticeProblems/PracticeProblems";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./main.css";
import HomePage from "./pages/HomePage/HomePage";
import Success from "./pages/Success/Success";
import QuestionPage from "./pages/QuestionPage/QuestionPage";
import SubmissionPage from "./pages/SubmissionPage/SubmissionPage";
import Settings from "./pages/Settings/Settings";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Room from "./pages/Room/Room";
import CodeRoom from "./pages/Room/CodeRoom";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard";
import ErrorPage from "./pages/404/Error";
function App() {
	return (
		<div className='h-full w-full'>
			<Router>
				<Routes>
					<Route
						path='/'
						element={<HomePage />}
					/>
					<Route
						path='/onlinecompiler'
						element={<OnlineCompiler />}
					/>
					<Route
						path='/practiceproblems'
						element={<PracticeProblems />}
					/>
					<Route
						path='/practiceproblems/questions/:id'
						element={<QuestionPage />}
					/>
					<Route
						path='/submissions'
						element={<SubmissionPage />}
					/>
					<Route
						path='/settings'
						element={<Settings />}
					/>
					<Route
						path='/success'
						element={<Success />}
					/>
					<Route
						path='/room'
						element={<Room />}
					/>
					<Route
						path='/room/:roomID'
						element={<CodeRoom />}
					/>
					<Route
						path='/leaderboard'
						element={<LeaderBoard />}
					/>
					<Route
						path='*'
						element={<ErrorPage />}
					/>
				</Routes>
			</Router>
			<ToastContainer
				position='bottom-right'
				pauseOnFocusLoss={false}
				pauseOnHover={false}
			/>
		</div>
	);
}

export default App;
