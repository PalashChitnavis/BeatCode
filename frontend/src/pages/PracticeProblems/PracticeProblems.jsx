/* eslint-disable no-inner-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import ProblemList from "../../components/ProblemList/ProblemList";
import Header from "../../components/Header/Header";
import Stats from "../../components/Stats/Stats";
import Footer from "../../components/Footer/Footer";
import { getUserStatus } from "../../services/getUserStats";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Loading from "../../components/Loading/Loading";
const PracticeProblems = () => {
	const [response, setResponse] = useState();
	useEffect(() => {
		if (isLoggedIn()) {
			const email = localStorage.getItem("email");
			async function handleStats() {
				const response = await getUserStatus(email);
				setResponse(response);
			}
			handleStats();
		}
	}, []);
	return (
		<>
			<Header />
			<div className='h-[83vh] flex flex-col justify-center'>
				<div className='flex justify-around w-full max-[768px]:flex-col max-[768px]:justify-center max-[768px]:items-center gap-8 overflow-scroll max-[768px]:pt-[0vh] max-[480px]:pt-[44vh]'>
					<div className='w-[20%] max-[768px]:w-[50%]'>
						<Stats response={response} />
					</div>

					<div className='w-[60%] max-[768px]:w-[89%]'>
						<ProblemList response={response} />
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default PracticeProblems;
