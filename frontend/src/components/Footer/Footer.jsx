/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-unused-vars */
import React from "react";

const Footer = () => {
	return (
		<div className=' w-full h-full flex items-center justify-between gap-2 px-4 border-t-2 border-[#fff]/[.2] py-2 flex-col lg:flex-row'>
			<div className='lg:ml-auto lg:text-nowrap lg:text-xl'>
				<a
					className=' flex justify-center gap-3 items-center text-white text-lg hover:text-green-200  text-[0.8em] w-full'
					target='_blank'
					href='https://github.com/PalashChitnavis/BeatCode'>
					GitHub Code <i className='fab fa-github text-[#fff] fa-lg'></i>
				</a>
			</div>

			<div className='text-white  flex gap-2  justify-center items-center text-[0.8em] text-center   w-full lg:mx-auto lg:text-nowrap lg:text-xl'>
				Made with <i className='fa-solid  fa-heart fa-beat text-red-500'></i> by
				<a
					href='https://github.com/PalashChitnavis'
					target='_blank'
					className='hover:text-green-200 text-md'>
					Palash Chitnavis
				</a>
				&
				<a
					href='https://github.com/maheshcodes12'
					target='_blank'
					className='hover:text-green-200 text-md'>
					Mahesh Suryawanshi
				</a>
			</div>
		</div>
	);
};

export default Footer;
