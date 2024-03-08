/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import socketIOClient from "socket.io-client";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Register from "../../components/Login/register";
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
		<div>
			<Header />
			{!isLoggedIn() && (
				<div className='z-1999 fixed w-full h-full flex justify-center pt-[30vh] bg-[#000] bg-opacity-50 '>
					<div className='bg-[#2f3136] w-[40vw] h-[25vh] flex-col flex justify-evenly items-center  rounded-2xl text-white'>
						<div className='text-2xl'>
							To use this feature please register yourself, thank you
						</div>
						<Register />
					</div>
				</div>
			)}
			<div className='flex w-[100vw] h-[83vh] justify-evenly'>
				<div className='w-[50%] border-r-2 h-[100%] flex flex-col items-center justify-start'>
					<div className='text-3xl text-white border-b-2 mt-[5vh] align-top '>
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
							marginY: "auto",
							paddingX: 6,
							"&:hover": {
								backgroundColor: "#f0f0f0",
							},
						}}>
						Host a room
					</Button>
				</div>
				<div className='w-[50%] border-l-2 h-[100%] flex flex-col items-center'>
					<div className='text-3xl text-white border-b-2 mt-[5vh]'>
						Join a Room
					</div>
					<div className='flex gap-5 mt-[32vh]'>
						<input
							className='text-3xl indent-3 text-black placeholder-gray-600 py-2 max-w-[30vw]'
							type='text'
							name='roomid'
							id='roomid'
						/>
						<Button
							variant='outlined'
							onClick={joinClick}
							color='success'
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
			<Footer />
		</div>
	);
};

export default Room;
