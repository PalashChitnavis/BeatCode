/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import socketIOClient from "socket.io-client";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Register from "../../components/Login/Register";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Autocomplete, Button } from "@mui/material";
const Room = () => {
	const navigate = useNavigate();
	function hostClick() {
		const roomID = Math.random().toString(36).substring(7);
		console.log(roomID);
		navigate(`/room/${roomID}`);
	}
	function joinClick() {
		const roomID = document.getElementById("roomid").value;
		navigate(`/room/${roomID}`);
	}
	return (
		<div className='w-[100vw] h-[100vh]'>
			<div className='h-[8vh] w-[100vw] flex justify-center items-center'>
				<Header />
			</div>
			<div className='min-h-[87vh]'>
				{!isLoggedIn() ? (
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
				) : (
					<>
						<div className='w-full h-[83vh] flex flex-col lg:flex-row justify-evenly items-center lg:w-[75%] lg:mx-auto'>
							<div className='w-full h-[50%] flex flex-col items-center justify-evenly border-b-2 lg:border-b-0 lg:border-r-2'>
								<div className='text-3xl text-white border-b-2 '>
									Host a Room
								</div>
								<Button
									variant='outlined'
									color='success'
									onClick={hostClick}
									size='large'
									sx={{
										color: "#16a34a",
										fontSize: 22,
										borderRadius: 10,
										paddingX: 6,
										"&:hover": {
											backgroundColor: "#f0f0f0",
										},
									}}>
									Host a room
								</Button>
							</div>
							<div className='w-full  h-[50%] flex flex-col items-center justify-evenly'>
								<div className='text-3xl text-white border-b-2 '>
									Join a Room
								</div>
								<div className='flex gap-5 '>
									<div>
										<input
											className='text-xl indent-3 text-black placeholder-gray-600 py-2 w-56'
											type='text'
											name='roomid'
											id='roomid'
										/>
									</div>
									<div>
										<Button
											variant='outlined'
											onClick={joinClick}
											color='success'
											size='large'
											sx={{
												"&:hover": {
													backgroundColor: "#f0f0f0",
												},
											}}>
											Join
										</Button>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
			<div className='h-[5vh] w-[100vw] flex justify-center items-center'>
				<Footer />
			</div>
		</div>
	);
};

export default Room;
