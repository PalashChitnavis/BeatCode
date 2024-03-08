/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Settings from "../../pages/Settings/Settings";
const Profile = () => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const email = localStorage.getItem("email");
	const username = localStorage.getItem("username");
	const firstLetter = email?.charAt(0);
	const avatarUrl = `https://ui-avatars.com/api/?name=${firstLetter}&background=random`;
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};
	const handleLogout = () => {
		localStorage.clear();
		toast.success("Logging out , bye bye", { autoClose: 2000 });
		setTimeout(() => {
			window.location.reload();
		}, 2000);
	};
	return (
		<div>
			<div className='profile'>
				<div
					className='profile-info'
					onClick={toggleDropdown}>
					<img
						className='h-10 rounded-[50%] cursor-pointer border border-solid'
						src={avatarUrl}
						alt='userProfile'
					/>
				</div>
				{isDropdownOpen && (
					<div>
						<div
							className='fixed w-full h-full z-[1999] bg-[rgba(0,0,0,0.5)] left-0 top-0'
							onClick={toggleDropdown}></div>
						<div className='absolute top-20 flex flex-col px-6 py-2 gap-2 justify-center items-center bg-[#272822] border z-[2000] rounded-[10px] border-solid right-8'>
							<div className='flex items-center justify-center w-full  border-b-[white] border-b border-solid py-1'>
								{username}
							</div>
							<div className='flex items-center justify-center w-full  border-b-[white] border-b border-solid overflow-hidden py-1'>
								{email}
							</div>
							<div
								className='flex items-center justify-center w-full  border-b-[white] border-b border-solid hover:bg-[#16a34a] py-1'
								onClick={() => console.log("View Submissions")}>
								<Link to={"/submissions"}>View Submissions</Link>
							</div>
							<div className='flex items-center justify-center w-full  border-b-[white] border-b border-solid hover:bg-[#908383] py-1'>
								<Link to={"/settings"}>Settings</Link>
							</div>
							<div
								className='flex items-center justify-center w-full  py-1'
								onClick={handleLogout}>
								<button className='w-full h-full hover:bg-[rgba(255,0,0,0.8)]'>
									Log Out
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Profile;
