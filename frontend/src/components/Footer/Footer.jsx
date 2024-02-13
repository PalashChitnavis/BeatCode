/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
	return (
		<div className=' w-full  max-h-[4vh] flex items-center justify-start border-t-2 border-[#fff]/[.2]'>
			<a
				className='w-[33%] flex gap-3 items-center text-white pl-4 text-lg hover:text-blue-500'
				target='_blank'
				href='https://github.com/PalashChitnavis/BeatCode'>
				GitHub Code{" "}
				<i className='fab fa-github  hover:text-blue-500  text-[#fff] fa-lg'></i>
			</a>
			<div className='text-white w-[67%] flex gap-5 text-lg justify-start items-center'>
				Made with <i className='fa-solid  fa-heart fa-beat text-red-500'></i> by
				<a
					href='https://github.com/PalashChitnavis'
					target='_blank'
					className='hover:text-green-500 hover:scale-95'>
					Palash Chitnavis
				</a>
				&
				<a
					href='https://github.com/maheshcodes12'
					target='_blank'
					className='hover:text-green-500 hover:scale-95'>
					Mahesh Suryawanshi
				</a>
			</div>
		</div>
	);
};

export default Footer;
