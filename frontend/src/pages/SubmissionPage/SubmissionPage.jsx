/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import SubmissionList from "../../components/SubmissionList/SubmissionList";
import Loading from "../../components/Loading/Loading";
import Register from "../../components/Login/Register";
const SubmissionPage = () => {
	return (
		<div className='flex flex-col w-[100vw] h-[100vh]'>
			<div className='h-[8vh] w-[100vw] flex justify-center items-center'>
				<Header />
			</div>
			<div className='w-full min-h-[87vh]'>
				{isLoggedIn() ? (
					<div className='h-full w-full flex justify-center items-center'>
						<SubmissionList />
					</div>
				) : (
					<div className='z-1999 fixed w-full h-[87vh] flex justify-center items-center  bg-[#000] bg-opacity-50 '>
						<div className='bg-[#2f3136] z-[2000] w-[95%] h-[90%] flex-col flex justify-evenly items-center p-8 rounded-2xl text-white'>
							<div className='text-2xl text-center'>
								To use this feature please register yourself, thank you 😊
							</div>
							<div>
								<Register />
							</div>
						</div>
					</div>
				)}
			</div>
			<div className='h-[5vh] w-[100vw] flex justify-center items-center'>
				<Footer />
			</div>
		</div>
	);
};

export default SubmissionPage;
