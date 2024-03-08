/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./InputWindow.css";

import { useBody } from "../../context/BodyContext";
const InputWindow = ({ socket, roomID }) => {
	const { body, updateBody } = useBody();
	const { userInput } = body;
	const handleInputChange = (event) => {
		updateBody({ ...body, userInput: event.target.value });
		socket &&
			socket.emit("inputUpdate", {
				userInput: event.target.value,
				roomID: roomID,
			});
	};
	return (
		<div className='w-[100%] h-[100%] '>
			<p className='text-[#bcaf3a] text-2xl pl-2 '>
				Input
				<span className='text-sm pl-2.5 text-wrap leading-3'>
					(Enter input if required before pressing run)
				</span>
			</p>
			<textarea
				className='bg-[#272822] text-[aliceblue] w-[100%] h-[100%] resize-none text-xl leading-[1.3] border p-2.5 rounded-[10px] border-solid border-[white]'
				name='userInput'
				id='userInput'
				cols='50'
				rows='4'
				value={userInput}
				placeholder='Enter Input Value Here'
				onChange={handleInputChange}
			/>
		</div>
	);
};

export default InputWindow;
