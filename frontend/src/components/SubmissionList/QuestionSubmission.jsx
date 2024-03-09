/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import capitalizeString from "../../services/capitaliseWord";
import { useParams } from "react-router-dom";
import { getSubmissions } from "../../services/getSubmissionsApi";
const QuestionSubmission = () => {
	const { id } = useParams();
	const [submissions, setSubmissions] = useState([]);

	useEffect(() => {
		const handleSubmissions = async () => {
			const sub = await getSubmissions(id);
			setSubmissions(sub);
			console.log(submissions);
		};

		handleSubmissions();
	}, [id]);

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
	return (
		<div className='w-[100%] overscroll-x-contain'>
			{submissions?.length != 0 ? (
				submissions.map((submission, index) => {
					return (
						<div
							key={submission._id}
							className='w-[100%] border-b-2'>
							<div className='abcd'>
								<div className='flex gap-5 ml-2 mt-2 text-lg'>
									{index + 1}]
									<div className='flex gap-3 justify-center items-center'>
										<div className='profile-info'>
											<img
												className='h-8 rounded-[50%] cursor-pointer'
												src={`https://ui-avatars.com/api/?name=${submission.user_email?.charAt(
													0
												)}&background=random`}
												alt='userProfile'
											/>
										</div>
										<div> {submission.user_name}</div>
									</div>
								</div>
								<div className='flex gap-10'>
									<div className='ml-12 mt-3 text-base'>
										{" "}
										Submitted On :{" "}
										<span className='text-[#ce9178]'>
											{formatDateTime(submission.createdAt)}
										</span>
									</div>
									<div className='text-base mt-3'>
										Language :{" "}
										<span className='text-[#4ec9b0]'>
											{capitalizeString(
												submission.language === "cpp"
													? "C++"
													: submission.language
											)}
										</span>
									</div>
								</div>
							</div>
							<div className='flex justify-between ml-[3vw] mb-[2vh] mt-[2vh] mr-[2vw]'>
								<div className='w-[100%]'>
									<SyntaxHighlighter
										wrapLines='true'
										language={submission.language}>
										{submission.code}
									</SyntaxHighlighter>
								</div>
							</div>
						</div>
					);
				})
			) : (
				<div className='text-[#fff] text-2xl flex justify-center mt-5'>
					No submissions yet , be the first one 😊
				</div>
			)}
		</div>
	);
};

export default QuestionSubmission;
