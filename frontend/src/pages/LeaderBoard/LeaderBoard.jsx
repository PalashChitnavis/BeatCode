/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { getLeaderBoard } from "../../services/getLeaderBoard";
function LeaderBoard() {
	const [data, setData] = useState();
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

	return (
		<>
			<Header />
			<div className='h-[88vh] flex justify-center items-center max-h-[88vh]'>
				{data ? (
					<div className='max-h-[80%]'>
						<table className=' text-xl border-4 rounded-md border-separate border-red-400 shadow-2xl bg-purple-300 border-spacing-8 '>
							<thead className='text-voilet-700 text-3xl  '>
								<tr>
									<th className='pb-4 px-32 text-left border-b-2 border-red-400 '>
										Username
									</th>
									<th className='pb-4 px-32 border-b-2 border-red-400 '>
										Leaderboard Rank
									</th>
								</tr>
							</thead>
							<tbody className='overflow-y-scroll'>
								{data.map((entry, index) => (
									<tr key={index}>
										<td className='hover:text-purple-600 px-12 hover:cursor-pointer'>
											{entry.username}
										</td>
										<td className='text-center'>{index + 1}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className='text-white text-3xl'>Leaderboard not available</div>
				)}
			</div>
			<Footer />
		</>
	);
}

export default LeaderBoard;
