/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import OutputWindow from "../OutputWindow/OutputWindow";
import InputWindow from "../InputWindow/InputWindow";

const RightPart = () => {
	return (
		<div className='flex flex-col w-[30%] h-[100%] gap-3 justify-evenly '>
			<div className='w-[95%] h-[38%]'>
				<InputWindow />
			</div>
			<div className='w-[95%] h-[38%]'>
				<OutputWindow />
			</div>
		</div>
	);
};

export default RightPart;
