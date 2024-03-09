/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "../NavBar/NavBar";
import CodeEditor from "../CodeEditor/CodeEditor";

const LeftPart = () => {
	return (
		<div className='flex flex-col mt-4 lg:mt-0 w-full h-[58%] lg:h-[99%]'>
			<div className='w-[96%] h-[20%] lg:h-[10%]'>
				<NavBar />
			</div>
			<CodeEditor />
		</div>
	);
};

export default LeftPart;
