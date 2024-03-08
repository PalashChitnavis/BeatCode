/* eslint-disable no-unused-vars */
import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

function HomePage() {
	return (
		<div>
			<Header />

			<div className='flex min-h-[82vh] w-[100%] justify-evenly px-10 gap-12 text-white font-sans text-left py-8'>
				<div className=' font-bold flex flex-col justify-center w-[50%] '>
					<p className='text-6xl max-[1024px]:text-4xl'>BeatCode</p>
					<p className='text-4xl mt-6 max-[1024px]:text-2xl'>
						A better way to level up your coding.
					</p>
					<div className='flex justify-left mt-16 gap-10  flex-wrap '>
						<Link to='/practiceproblems'>
							<Button
								variant='outlined'
								color='success'
								size='large'
								sx={{
									color: "#16a34a",
									fontSize: 22,
									borderRadius: 10,
									"&:hover": {
										// Adjust the hover radius as needed
										backgroundColor: "#f0f0f0", // Change background color on hover if needed
									},
									"@media (max-width: 1024px)": {
										fontSize: 16,
									},
								}}>
								Practice Problems
							</Button>
						</Link>
						<Link to='/room'>
							<Button
								variant='outlined'
								color='success'
								size='large'
								sx={{
									color: "#16a34a",
									fontSize: 22,
									borderRadius: 10,
									"&:hover": {
										backgroundColor: "#f0f0f0",
									},
									"@media (max-width: 1024px)": {
										fontSize: 16,
									},
								}}>
								Code Room
							</Button>
						</Link>
						<Link to='/practiceproblems'>
							<Button
								variant='outlined'
								color='success'
								size='large'
								sx={{
									color: "#16a34a",
									fontSize: 22,
									borderRadius: 10,
									"&:hover": {
										// Adjust the hover radius as needed
										backgroundColor: "#f0f0f0", // Change background color on hover if needed
									},
									"@media (max-width: 1024px)": {
										fontSize: 16,
									},
								}}>
								Practice Problems
							</Button>
						</Link>
					</div>
				</div>
				<div className='m-8  w-[35%] flex justify-center'>
					<img
						src='Home-Page-Tree.svg'
						alt='Coding Tree Image'
						className='  w-[100%] '
					/>
				</div>
			</div>

			<Footer />
		</div>
	);
}

export default HomePage;
