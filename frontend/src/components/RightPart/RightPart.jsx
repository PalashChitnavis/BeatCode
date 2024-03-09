/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";

const RightPart = () => {
	return (
		<div className='flex  w-full h-[45%] lg:h-[97%] lg:items-center items-start justify-around lg:flex-col lg:w-[45%] '>
			<div className='w-[45%] h-[50%] lg:h-[40%] lg:w-[90%]'>
				<InputWindow />
			</div>
			<div className='w-[45%] h-[50%] lg:h-[40%] lg:w-[90%]'>
				<OutputWindow />
			</div>
		</div>
	);
};

export default RightPart;
