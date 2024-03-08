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

			<div className='flex h-[87.5vh] justify-around  text-white font-sans text-left'>
				<div className=' w-[55%] font-bold mt-44'>
					<p className='text-6xl'>BeatCode</p>
					<p className='text-4xl mt-6'>A better way to level up your coding.</p>
					<div className='flex justify-left mt-16 gap-10 w-[90%] '>
						<button className='text-green-600 w-[35%]  text-xl border-2 border-green-600 rounded-full px-6 py-4  hover:bg-green-600 hover:text-white'>
							<Link to='/practiceproblems'>Practice Problems</Link>
						</button>
						<button className='text-green-600 w-[35%] text-xl border-2 border-green-600 rounded-full px-6 py-4  hover:bg-green-600 hover:text-white'>
							<Link to='/onlinecompiler'>Online Compiler</Link>
						</button>
						<button className='text-green-600 w-[35%]  text-xl border-2 border-green-600 rounded-full px-6 py-4  hover:bg-green-600 hover:text-white'>
							<Link to='/room'>Code Room</Link>
						</button>
					</div>
				</div>
				<img
					src='Home-Page-Tree.svg'
					alt='Coding Tree Image'
					className='w-[40%]  mt-10 '
				/>
			</div>

			<Footer />
		</div>
	);
}

export default HomePage;
