/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import RunButton from "./RunButton";
import ResetCode from "./ResetCode";
import Settings from "./Settings";
import { useDispatch } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";
import { updateLanguage } from "../../redux/slices/languageSlice";
import { updateOutput } from "../../redux/slices/outputSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
import { useLocation } from "react-router-dom";
import "./NavBar.css";
const NavBar = ({ socket, roomID }) => {
	const location = useLocation();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(updateLanguage("java"));
		dispatch(updateOutput(""));
		dispatch(updateUserInput(""));
		dispatch(updateCode(""));
	}, location.pathname);

	return (
		<div className='flex w-[100%] h-[100%] justify-between items-center gap-[20%] bg-neutral-800 text-[white] border ml-[2%] mt-[1%] pl-[2%] pr-[2%] rounded-[10px] border-solid border-[whitesmoke]'>
			<div className='w-[15%] h-[95%] flex items-center justify-center'>
				<LanguageSelector
					socket={socket}
					roomID={roomID}
				/>
			</div>
			<div className='w-[50%] flex items-center'>
				<div className='w-[30%]'>
					<ResetCode />
				</div>
				<div className='w-[30%]'>
					<Settings />
				</div>
				<div className='h-[35px] w-[50%]'>
					<RunButton />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
