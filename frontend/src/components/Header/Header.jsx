/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import Register from "../Login/Register";
import { isLoggedIn } from "../Login/isLoggedIn";
import Profile from "../Login/Profile";
import { Link } from "react-router-dom";
import { Button, colors } from "@mui/material";
const Header = () => {
	const [screen, setScreen] = React.useState(window.screen.width);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	window.addEventListener("resize", handleResize);
	function handleResize() {
		setScreen(window.screen.width);
	}
	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	return (
		<div className=' w-full  flex justify-evenly items-center bg-[#2f3136] text-white p-5  z-10 shadow-md max-[1024px]:flex-wrap text-wrap'>
			<>
				<div className='w-[80%] flex flex-row justify-between items-center gap-12 bg-[#2f3136]'>
					{screen > 1024 ? (
						<div className='bg-[#2f3136] w-[100%]  flex justify-between items-center gap-16 text-nowrap'>
							<div className='icon w-[20%] flex justify-center rounded-[10px] bg-[#fb690a] p-2'>
								<Link to='/'>
									<img
										className=' w-[100%]'
										src='/logo.svg'
										alt='beatcode-logo'
									/>
								</Link>
							</div>

							<div className='bg-[#2f3136] w-[75%] gap-2 flex justify-between items-center text-nowrap'>
								<Link to='/practiceproblems'>
									<Button
										variant='contained'
										color='success'
										sx={{ backgroundColor: "#16a34a", borderRadius: 2 }}>
										Practice Problems
									</Button>
								</Link>
								<Link to='/onlinecompiler'>
									<Button
										variant='contained'
										color='success'
										sx={{ backgroundColor: "#16a34a", borderRadius: 2 }}>
										Online Compiler
									</Button>
								</Link>
								<Link to='/room'>
									<Button
										variant='contained'
										color='success'
										sx={{ backgroundColor: "#16a34a", borderRadius: 2 }}>
										Code Room
									</Button>
								</Link>
								<Link to='/leaderboard'>
									<Button
										variant='contained'
										color='success'
										sx={{ backgroundColor: "#16a34a", borderRadius: 2 }}>
										Leaderboard
									</Button>
								</Link>
							</div>
						</div>
					) : (
						<div className=''>
							{isMenuOpen ? (
								<div className='flex'>
									<div
										className='flxed left-0 w-full h-full z-[1999] bg-[rgba(0,0,0,0.5)]  top-0'
										onClick={toggleMenu}></div>
									<i
										onClick={toggleMenu}
										class='fa-solid fa-xmark fa-lg'></i>

									<div className=' absolute left-0 w-56 h-[100vh]  flex flex-col p-4 gap-2 justify-start  items-center bg-[#272822]  z-[2000] shadow-sm'>
										<div>
											<Link to='/'>Home </Link>
										</div>
										<div>
											<Link to='/practiceproblems'>Practice Problems</Link>
										</div>
										<div>
											<Link to='/onlinecompiler'>Online Compiler</Link>
										</div>
										<div>
											<Link to='/room'>Code Room</Link>
										</div>
										<div>
											<Link to='leaderboard'>Leaderboard</Link>
										</div>
									</div>
								</div>
							) : (
								<div className='flex gap-4 justify-start items-center'>
									<i
										class='fa-solid fa-bars'
										onClick={toggleMenu}></i>
									<div className='icon w-[35%] flex justify-center rounded-[10px] bg-[#fb690a] p-2'>
										<Link to='/'>
											<img
												className=' w-[100%]'
												src='/logo.svg'
												alt='beatcode-logo'
											/>
										</Link>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
				<div className='bg-[#2f3136] h-[100%] w-[10%] flex flex-row items-center justify-end m-0'>
					<div>{isLoggedIn() ? <Profile /> : <Register />}</div>
				</div>
			</>
		</div>
	);
};

export default Header;
