/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getUserData } from "../../services/getUserData";
import { getLeaderBoard } from "../../services/getLeaderBoard";
import Loading from "../../components/Loading/Loading";
function LeaderBoard() {
	const [data, setData] = useState();
	const [toggle, setToggle] = useState(false);
	const [user, setUser] = useState();
	useEffect(() => {
		async function fetchData() {
			const leaderboardData = await getLeaderBoard();
			// Sort the data by the length of attemptedQuestions
			leaderboardData.sort(
				(a, b) => b.attemptedQuestions.length - a.attemptedQuestions.length
			);
			setData(leaderboardData);
		}
		fetchData();
	}, []);

	useEffect(() => {
		async function getUser() {
			if (toggle != false) {
				const res = await getUserData(toggle);
				setUser(res.data);
			}
		}
		getUser();
	}, [toggle]);

	function handleClick(email) {
		setToggle(email);
	}

	function getDaysSince(dateString) {
		const currentDate = new Date();
		const createDate = new Date(dateString);

		// Calculate the difference in milliseconds
		const differenceMs = currentDate - createDate;

		// Convert milliseconds to days
		const daysSince = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

		return daysSince;
	}

	return (
		<>
			<Header />
			<div className='h-[82vh] w-full flex justify-center items-center max-[1024px]:text-lg'>
				{data ? (
					<div className='max-h-[80%] max-[1024px]:text-lg'>
						<table className='max-w-90% text-xl max-[1024px]:text-lg text-white border-4 rounded-md border-separate border-red-400 shadow-2xl bg-[#32085e] border-spacing-8 '>
							<thead className='text-voilet-700 text-3xl max-[1024px]:text-lg '>
								<tr>
									<th className='pb-4 px-32 text-left border-b-2 border-red-400 '>
										Username
									</th>
									<th className='pb-4 px-32 border-b-2 border-red-400 '>
										Leaderboard Rank
									</th>
								</tr>
							</thead>
							<tbody className='overflow-y-scroll max-[1024px]:text-lg'>
								{data.map((entry, index) => (
									<tr key={index}>
										<td
											onClick={() => {
												handleClick(entry.email);
											}}
											className={`hover:text-purple-600 text-2xl flex items-center gap-5 px-12 hover:cursor-pointer`}>
											<img
												className='h-10 rounded-[50%] cursor-pointer'
												src={`https://ui-avatars.com/api/?name=${entry.email.charAt(
													0
												)}&background=random`}
												alt='userProfile'
											/>
											{entry.username}
											{index + 1 === 1 ? (
												<i className='fa-solid fa-crown text-[#FFD700] flex items-center'></i>
											) : index + 1 === 2 ? (
												<i className='fa-solid fa-crown text-[#EAECEC] flex items-center'></i>
											) : index + 1 === 3 ? (
												<i className='fa-solid fa-crown text-[#CD7F32] flex items-center'></i>
											) : null}
										</td>
										<td className='text-center'>{index + 1}</td>
									</tr>
								))}
							</tbody>
						</table>
						{toggle && (
							<div
								onClick={() => {
									handleClick(false);
								}}
								className='z-2999 fixed top-0 left-0 w-full h-full flex justify-center items-center  bg-[#000] bg-opacity-50 '>
								<div className='bg-[#2f3136] bg-opacity-90 w-[60%] h-[70%]  flex-col flex justify-evenly items-center  rounded-2xl text-white'>
									{user ? (
										<div className='w-[100%] h-[88vh] flex justify-start flex-col gap-12 items-center'>
											<div className='mt-16'>
												<img
													className='h-20 rounded-[50%] cursor-pointer'
													src={`https://ui-avatars.com/api/?name=${user.email.charAt(
														0
													)}&background=random`}
													alt='userProfile'
												/>
											</div>
											<div className='w-[80%] gap-5 border border-red-200 rounded-md text-[#fff] flex-col flex justify-center  text-2xl p-8 leading-relaxed'>
												<table>
													<tr>
														<td>
															<div className='text-red-400'>Name :</div>
														</td>
														<td>
															<span className='text-red-100'>
																{user.username}
															</span>
														</td>
													</tr>
													<tr>
														<td>
															<div className='text-red-400'>Email :</div>
														</td>
														<td>
															<span className='text-red-100'>{user.email}</span>
														</td>
													</tr>
													<tr>
														<td>
															<div className='text-red-400'>
																BeatCoder since :
															</div>
														</td>
														<td>
															<span className='text-red-100'>
																{getDaysSince(user.createdAt)} days
															</span>
														</td>
													</tr>
												</table>
											</div>
										</div>
									) : (
										<div className='h-[88vh]'>
											<Loading />
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className='text-white text-3xl max-[1024px]:text-xl'>
						Leaderboard not available
					</div>
				)}
			</div>
			<Footer />
		</>
	);
}

export default LeaderBoard;
