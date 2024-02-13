import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
const Loading = () => {
	return (
		<div className='w-[100%] h-[100%] flex flex-col justify-between items-center p-48'>
			<i className='fa-solid fa-atom fa-spin text-[#be5333] text-8xl'></i>
		</div>
	);
};

export default Loading;
