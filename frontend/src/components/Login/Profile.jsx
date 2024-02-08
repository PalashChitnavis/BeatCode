/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { Link } from "react-router-dom";
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
                window.location.reload();
        };
        return (
                <div>
                        <div className="profile">
                                <div className="profile-info" onClick={toggleDropdown}>
                                        <img
                                                className="h-10 rounded-[50%] cursor-pointer"
                                                src={avatarUrl}
                                                alt="userProfile"
                                        />
                                </div>
                                {isDropdownOpen && (
                                        <div>
                                                <div
                                                        className="fixed w-full h-full z-[1999] bg-[rgba(0,0,0,0.5)] left-0 top-0"
                                                        onClick={toggleDropdown}
                                                ></div>
                                                <div className="absolute w-[15vw] h-[28vh] flex flex-col justify-center items-center bg-[#272822] border z-[2000] rounded-[10px] border-solid border-[white] right-[2.5vw] top-[8vh]">
                                                        <div className="flex items-center justify-center w-full h-[7vh] border-b-[white] border-b border-solid">
                                                                {username}
                                                        </div>
                                                        <div className="flex items-center justify-center w-full h-[7vh] border-b-[white] border-b border-solid">
                                                                {email}
                                                        </div>
                                                        <div
                                                                className="flex items-center justify-center w-full h-[7vh] border-b-[white] border-b border-solid hover:bg-[#16a34a]"
                                                                onClick={() => console.log("View Submissions")}
                                                        >
                                                                <Link to={"/submissions"}>View Submissions</Link>
                                                        </div>
                                                        <div className="flex items-center justify-center w-full h-[7vh] border-b-[white] border-b border-solid hover:bg-[#908383]">
                                                                <Link to={"/settings"}>Settings</Link>
                                                        </div>
                                                        <div
                                                                className="flex items-center justify-center w-full h-[7vh] border-b-[white] border-b border-solid"
                                                                onClick={handleLogout}
                                                        >
                                                                <button className="w-full h-full hover:bg-[rgba(255,0,0,0.8)]">
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
