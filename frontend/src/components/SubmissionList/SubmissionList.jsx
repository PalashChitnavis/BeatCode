/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
	onlineCompilerSubmissions,
	practiceProblemsSubmissions,
} from "../../services/submissionsApi";
import "./SubmissionList.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
const SubmissionList = () => {
	const [toggleSubmission, setToggleSubmission] = useState("practiceproblems");
	const email = localStorage.getItem("email");
	const [compilersubmissions, setCompilerSubmissions] = useState(null);
	const [practicesubmissions, setPracticeSubmissions] = useState(null);
	function handleToggle(name) {
		setToggleSubmission(name);
		if (name === "practiceproblems") {
			practiceProblemsSubmissions(email).then((res) => {
				setPracticeSubmissions([...res].reverse());
			});
		}
		if (name === "onlinecompiler") {
			onlineCompilerSubmissions(email).then((res) => {
				setCompilerSubmissions([...res].reverse());
			});
		}
	}
	const formatDateTime = (dateTime) => {
		const date = new Date(dateTime);
		const options = { month: "long", day: "numeric", year: "numeric" };
		const dateString = date.toLocaleDateString(undefined, options);
		const timeString = date.toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
		return `${dateString} at ${timeString}`;
	};
	useEffect(() => {
		practiceProblemsSubmissions(email).then((res) => {
			setPracticeSubmissions([...res].reverse());
		});
		onlineCompilerSubmissions(email).then((res) => {
			setCompilerSubmissions([...res].reverse());
		});
	}, []);
	return (
		<>
			<div className='z-[1] w-full h-full flex flex-col justify-center items-center'>
				<div className='flex w-full items-center justify-center lg:justify-evenly lg:w-[75%]'>
					<button
						className={`border w-[45%] lg:w-[35%] bg-[#179b77] border-solid border-[white] hover:bg-[#179b77] py-2 ${
							toggleSubmission === "practiceproblems"
								? "bg-[#179b77]"
								: "bg-[#435359] text-[#bab5b5]"
						}`}
						onClick={() => handleToggle("practiceproblems")}>
						Practice Problems Submissions
					</button>
					<button
						className={`border w-[45%] lg:w-[35%] bg-[#179b77]  border-solid border-[white] hover:bg-[#179b77] py-2 ${
							toggleSubmission === "onlinecompiler"
								? `bg-[#179b77]`
								: `bg-[#435359] text-[#bab5b5]`
						}`}
						onClick={() => handleToggle("onlinecompiler")}>
						Online Compiler & Code Room Submissions
					</button>
				</div>
				{toggleSubmission === "practiceproblems" ? (
					<div className='onlinecompilersub w-[90%] lg:w-[75%]'>
						{practicesubmissions && practicesubmissions.length > 0 ? (
							practicesubmissions.map((submission, index) => {
								const i = submission.output?.indexOf("Test case 1");
								const trimmed_result = submission.output?.substring(i);
								return (
									<div
										key={submission._id}
										className='xyzabcd w-full  border-b border-solid pb-4'>
										<div className='abcd text-sm w-full'>
											<span className='text-sm lg:text-lg'>{index + 1}] </span>
											<span className='text-sm lg:text-lg'>
												{" "}
												Created : {formatDateTime(submission.createdAt)}
											</span>
										</div>
										<div className='flex flex-col justify-between items-center gap-2 w-full'>
											<div className='w-[99%]'>
												<SyntaxHighlighter
													customStyle={{
														width: "100%",
														fontSize: 12,
														"@media (min-width: 768px)": {
															fontSize: "1.5em",
														},
													}}
													className='xyz'
													language={submission.language}
													wrapLines={true}>
													{submission.code}
												</SyntaxHighlighter>
											</div>

											<div className='flex flex-col bcd w-full justify-center border overflow-scroll py-4'>
												<div>
													<span className='text-[#4ec9b0]'>Status :</span>{" "}
													<span className='text-[#ce9178] '>
														{submission.status}
													</span>
												</div>
												<div>
													<span className='text-[#4ec9b0]'>Output :</span>{" "}
													<span className='text-[#ce9178] '>
														{trimmed_result}
													</span>
												</div>
											</div>
										</div>
									</div>
								);
							})
						) : (
							<div className='flex w-full h-full justify-center items-center text-white lg:text-2xl'>
								No submissions made yet{"    "}&nbsp;&nbsp;
								<i className='fa-solid fa-heart-crack text-red-500'></i>
							</div>
						)}
					</div>
				) : (
					<div className='onlinecompilersub w-[90%] lg:w-[75%]'>
						{compilersubmissions && compilersubmissions.length > 0 ? (
							compilersubmissions.map((submission, index) => (
								<div
									key={submission._id}
									className='xyzabcd w-full  border-b border-solid pb-4'>
									<div className='abcd text-sm w-full'>
										<span className='text-sm lg:text-lg'>{index + 1}] </span>
										<span className='text-sm lg:text-lg'>
											{" "}
											Created : {formatDateTime(submission.createdAt)}
										</span>
									</div>
									<div className='flex flex-col justify-between gap-2 w-full'>
										<div className=''>
											<SyntaxHighlighter
												customStyle={{
													width: "100%",
													fontSize: 12,
													"@media (min-width: 768px)": {
														fontSize: "1.5em",
													},
												}}
												className='xyz'
												language={submission.language}
												wrapLines={true}>
												{submission.code}
											</SyntaxHighlighter>
										</div>
										<div className='flex flex-col bcd justify-center border py-4'>
											<div>
												<span className='text-[#4ec9b0]'>Input :</span>{" "}
												<span className='text-[#ce9178] text-wrap'>
													{submission.input}
												</span>
											</div>
											<div className=''>
												<span className='text-[#4ec9b0]'>Output :</span>{" "}
												<span className='text-[#ce9178] '>
													{submission.output}
												</span>
											</div>
										</div>
									</div>
								</div>
							))
						) : (
							<div className='flex w-full h-full justify-center items-center text-white lg:text-2xl'>
								No submissions made yet{"    "}&nbsp;&nbsp;
								<i className='fa-solid fa-heart-crack text-red-500'></i>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
};

export default SubmissionList;
