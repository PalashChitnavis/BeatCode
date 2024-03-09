/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchQuestionById } from "../../services/practiceProblemsApi";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Question from "../../components/Question/Question.jsx";
import "./QuestionPage.css";
import ProblemList from "../../components/ProblemList/ProblemList.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import CodeEditor from "../../components/CodeEditor/CodeEditor.jsx";
import ProblemSolutions from "../../components/ProblemSolutions/ProblemSolutions.jsx";
import QuestionSubmission from "../../components/SubmissionList/QuestionSubmission.jsx";
import { isLoggedIn } from "../../components/Login/isLoggedIn.js";
import { getUserStatus } from "../../services/getUserStats.js";
import FullScreenConfetti from "../../components/Confetti/FullScreenConfetti.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { useDispatch, useSelector } from "react-redux";
import { updateToggleOutput } from "../../redux/slices/toggleOutput.js";
const QuestionPage = () => {
	const [loading, setLoading] = useState(false);
	const { id } = useParams();
	const [question, setQuestion] = useState(null);
	const [navigation, setNavigation] = useState("question");
	const dispatch = useDispatch();
	const toggleOutput = useSelector((state) => state.toggleOutput?.value);
	const practiceStatus = useSelector((state) => state.practiceStatus?.value);
	const output = useSelector((state) => state.output?.value);
	const [response, setResponse] = useState();
	const [screen, setScreen] = useState(window.screen.width);
	window.addEventListener("resize", () => {
		setScreen(window.screen.width);
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const question = await fetchQuestionById(id);
				setQuestion(question);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching questions:", error);
			}
		};
		setNavigation("question");
		fetchData();
		if (isLoggedIn()) {
			const email = localStorage.getItem("email");
			async function handleStats() {
				const response = await getUserStatus(email);
				setResponse(response);
			}
			handleStats();
		}
	}, [id]);

	const handleToggleOutput = () => {
		dispatch(updateToggleOutput(toggleOutput === true ? false : true));
	};

	return (
		<div className='w-[100vw] h-[100vh]'>
			<div className='h-[8vh] w-[100vw] flex justify-center items-center'>
				<Header />
			</div>
			{loading ? (
				<div className='h-[75vh] lg:h-[87vh] w-full mx-auto'>
					<Loading />
				</div>
			) : (
				<div className='lg:h-[87vh] w-[100vw] lg:w-[98%] lg:mx-auto lg:justify-between min-h-[75vh] flex flex-col lg:flex-row gap-4 items-center justify-start'>
					{practiceStatus && <FullScreenConfetti />}
					<div
						className={`bg-neutral-800 h-full w-full lg:border lg:rounded-[10px] lg:border-solid lg:border-[white] overflow-y-scroll pb-4 lg:h-[95%]`}>
						<div className='h-[7.5vh] w-full flex flex-wrap text-nowrap justify-around border-b-[rgb(76,76,76)] border-b border-solid'>
							<button
								className={`${
									navigation === `question` ? `active` : ``
								} questionpagebtn`}
								onClick={() => setNavigation("question")}>
								Question
							</button>
							<button
								className={`${
									navigation === `solution` ? `active` : ``
								} questionpagebtn`}
								onClick={() => setNavigation("solution")}>
								Solution
							</button>
							<button
								className={`${
									navigation === `submissions` ? `active` : ``
								} questionpagebtn`}
								onClick={() => {
									setNavigation("submissions");
								}}>
								Submissions
							</button>
							<button
								className={`${
									navigation === `problemlist` ? `active` : ``
								} questionpagebtn`}
								onClick={() => setNavigation("problemlist")}>
								Problem List
							</button>
						</div>
						<div className='w-[100%] '>
							{(() => {
								switch (navigation) {
									case "question":
										return question && <Question question={question} />;
									case "solution":
										return question && <ProblemSolutions question={question} />;
									case "submissions":
										return question && <QuestionSubmission />;
									case "problemlist":
										return <ProblemList response={response} />;
								}
							})()}
						</div>
					</div>
					{(navigation === "question" || screen > 1024) && (
						<div className='w-full bg-[#202020] h-[85vh] border rounded-[10px] border-solid border-[white] lg:h-[95%]'>
							<div className='w-[100%] bg-[#202020] h-[100%] border rounded-[10px] border-solid border-[white] '>
								<div className='w-[96%] h-[8%]'>
									<NavBar />
								</div>
								{toggleOutput ? (
									<div className={`h-[40%]`}>
										{question && <CodeEditor question={question} />}
									</div>
								) : (
									<div className={`h-[80%]`}>
										{question && <CodeEditor question={question} />}
									</div>
								)}
								<button
									onClick={handleToggleOutput}
									className={`palash flex items-center pl-[2%]  w-[96%] h-[8%] ml-[2%] text-[#fff]`}>
									Output Window{" "}
									{toggleOutput ? (
										<i className='pl-[10px] fa-solid fa-angle-down'></i>
									) : (
										<i className='pl-[10px] fa-solid fa-angle-up'></i>
									)}
								</button>
								{toggleOutput && (
									<div className='h-[35%] w-[96%] bg-[#272822] ml-[2%] mt-[2%]'>
										<textarea
											placeholder='Output will be displayed here'
											id='userOutput'
											className='bg-[#272822] text-[aliceblue] w-[100%] h-[100%] resize-none text-xl border p-4 rounded-[10px] border-solid border-[white] leading-8'
											readOnly
											value={output}></textarea>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
			<div className='h-[5vh] w-[100vw] flex justify-center items-center'>
				<Footer />
			</div>
		</div>
	);
};

export default QuestionPage;
