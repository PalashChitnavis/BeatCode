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
                <div className="h-full w-full">
                        <div className="profile">
                                <div className="profile-info flex justify-end" onClick={toggleDropdown}>
                                        <img
                                                className="h-10 rounded-[50%] border-white border-[2px] cursor-pointer"
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
                                                <div className="fixed w-[70%] lg:w-[40%] lg:text-xl h-[50%] left-[15%] lg:left-[30%] top-[25%] flex justify-center  flex-col p-4 gap-2  items-center bg-[#272822]  z-[2000] shadow-sm border-solid">
                                                        <div className="flex items-center justify-center w-full h-[20%] border-b-[white] border-b border-solid">
                                                                {username}
                                                        </div>
                                                        <div className="flex items-center justify-center w-full h-[20%] border-b-[white] border-b border-solid">
                                                                {email}
                                                        </div>
                                                        <div className="flex items-center justify-center w-full h-[20%] border-b-[white] border-b border-solid hover:bg-[#16a34a] bg-green-600">
                                                                <Link to={"/submissions"}>View Submissions</Link>
                                                        </div>
                                                        <div className="flex items-center justify-center w-full h-[20%] border-b-[white] border-b border-solid hover:bg-[#908383] bg-gray-600">
                                                                <Link to={"/settings"}>Settings</Link>
                                                        </div>
                                                        <div
                                                                className="flex items-center justify-center w-full h-[20%] border-b-[white] border-b border-solid"
                                                                onClick={handleLogout}
                                                        >
                                                                <button className="w-full h-full hover:bg-[rgba(255,0,0,0.8)] bg-red-600">
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
