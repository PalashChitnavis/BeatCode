/* eslint-disable no-inner-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import { getUserData } from "../../services/getUserData";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Loading from "../../components/Loading/Loading";
const Settings = () => {
	const [user, setUser] = useState(null);
	useEffect(() => {
		if (isLoggedIn()) {
			const email = localStorage.getItem("email");
			async function handle() {
				const res = await getUserData(email);
				setUser(res.data);
				console.log(user);
			}
			handle();
		}
	}, []);
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
		<div>
			<Header />
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
					<div className='w-[40%] gap-5 border border-red-200 rounded-md text-[#fff] flex-col flex justify-center  text-2xl p-8 leading-relaxed'>
						<table>
							<tr>
								<td>
									<div className='text-red-400'>Name :</div>
								</td>
								<td>
									<span className='text-red-100'>{user.username}</span>
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
									<div className='text-red-400'>BeatCoder since :</div>
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
			<Footer />
		</div>
	);
};

export default Settings;
