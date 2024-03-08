/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "../NavBar/NavBar";
import CodeEditor from "../CodeEditor/CodeEditor";

const LeftPart = () => {
	return (
		<div className='flex flex-col w-[68%] h-[100%]'>
			<div className='w-[96%] h-[8%]'>
				<NavBar />
			</div>
			<CodeEditor />
		</div>
	);
};

export default LeftPart;
