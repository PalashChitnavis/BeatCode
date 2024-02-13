/* eslint-disable no-unused-vars */
import React from "react";

import Register from "../Login/register";
import { isLoggedIn } from "../Login/isLoggedIn";
import Profile from "../Login/Profile";
import { Link } from "react-router-dom";
const Header = () => {
	return (
		<div className='h-[8vh] w-full flex justify-between items-center bg-[#2f3136] text-white px-5'>
			<div className='w-[60%] flex flex-row justify-between bg-[#2f3136]'>
				<Link
					className='w-[30%] flex justify-center items-center'
					to='/'>
					<div className='icon w-[100%] flex justify-center rounded-[10px] bg-[#fb690a]'>
						<img
							className='h-[8%] w-[90%]'
							src='/logo.svg'
							alt='beatcode-logo'
						/>
					</div>
				</Link>
				<div className='bg-[#2f3136] w-[60%] gap-5 flex justify-between items-center text-nowrap'>
					<div className='px-2 bg-[#16a34a] flex justify-center items-center h-[35px] font-semibold rounded-[10px]'>
						<Link to='/practiceproblems'>Practice Problems</Link>
					</div>
					<div className='px-2 bg-[#16a34a] flex justify-center items-center h-[35px] font-semibold rounded-[10px]'>
						<Link to='/onlinecompiler'>Online Compiler</Link>
					</div>
					<div className='px-2 bg-[#16a34a] flex justify-center items-center h-[35px] font-semibold rounded-[10px]'>
						<Link to='/room'>Code Room</Link>
					</div>
				</div>
			</div>
			<div className='bg-[#2f3136] h-[100%] w-[10%] flex flex-row items-center justify-end m-0'>
				<div>{isLoggedIn() ? <Profile /> : <Register />}</div>
			</div>
		</div>
	);
};

export default Header;
