/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
	return (
		<div className=' w-full  gap-3 flex items-center justify-start border-t-2 border-[#fff]/[.2] py-1 max-[486px]:flex-col '>
			<a
				className='w-[33%] flex justify-center gap-3 items-center text-white pl-4 text-lg hover:text-green-200  max-[768px]:text-[0.8em] max-[486px]:w-full'
				target='_blank'
				href='https://github.com/PalashChitnavis/BeatCode'>
				GitHub Code <i className='fab fa-github    text-[#fff] fa-lg'></i>
			</a>
			<div className='text-white w-[67%] flex gap-2 text-lg justify-center items-center max-[768px]:text-[0.8em] max-[486px]:w-full'>
				Made with <i className='fa-solid  fa-heart fa-beat text-red-500'></i> by
				<a
					href='https://github.com/PalashChitnavis'
					target='_blank'
					className='hover:text-green-200 max-[768px]:text-[0.8em] '>
					Palash Chitnavis
				</a>
				&
				<a
					href='https://github.com/maheshcodes12'
					target='_blank'
					className='hover:text-green-200 max-[768px]:text-[0.8em] '>
					Mahesh Suryawanshi
				</a>
			</div>
		</div>
	);
};

export default Footer;
