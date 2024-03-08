/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";

function ErrorPage() {
	return (
		<>
			<Header />
			<div className='h-full'>
				<div className='w-full h-[83vh] flex justify-around items-center px-12 text-wrap'>
					<div className='w-[60%]'>
						<div className='text-white font-sans text-6xl p-5 max-[1024px]:text-4xl'>
							Oops, this page doesn't exist
						</div>
						<div className='text-white font-sans text-4xl p-5 max-[1024px]:text-2xl'>
							Go back to{" "}
							<Link
								className='text-yellow-500'
								to={"/"}>
								home page
							</Link>
						</div>
					</div>
					<div className='w-[40%] flex justify-center items-center'>
						<img
							src='../../public/Error.png'
							alt='Error404'
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
}

export default ErrorPage;
