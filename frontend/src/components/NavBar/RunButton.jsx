/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useEffect, useState } from "react";
import { useBody } from "../../context/BodyContext";
import { runCompilerCode, runPracticeCode } from "../../services/runCodeApi";
import { isLoggedIn } from "../Login/isLoggedIn";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./RunButton.css";
import LoadingButton from "@mui/lab/LoadingButton";

const RunButton = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { body, updateBody } = useBody();
	const [userEmail, setUserEmail] = useState("");
	const [userName, setUserName] = useState("");
	const location = useLocation();
	const { id } = useParams();
	useEffect(() => {
		if (isLoggedIn()) {
			const email = localStorage.getItem("email");
			const username = localStorage.getItem("username");
			setUserEmail(email);
			setUserName(username);
		}
	}, []);

	const handleClick = async () => {
		if (!isLoggedIn()) {
			toast.warn("To save your submissions, please register", {
				position: "bottom-right",
			});
		}
		setIsLoading(true);
		try {
			if (
				location.pathname.startsWith("/onlinecompiler") ||
				location.pathname.startsWith("/room")
			) {
				const reqBody = {
					code: body.code,
					userInput: body.userInput,
					language: body.language,
					userEmail: userEmail,
					userName: userName,
				};
				console.log(reqBody);
				const result = await runCompilerCode(reqBody);
				console.log(result);
				if (result.stdout) {
					updateBody({ ...body, toggleOutput: true, output: result.stdout });
				} else {
					updateBody({
						...body,
						toggleOutput: true,
						output: `Error During Execution : \n ${result.stderr}`,
					});
				}
			}
			if (location.pathname.startsWith("/practiceproblems")) {
				const reqBody = {
					code: body.code,
					language: body.language,
					userEmail: userEmail,
					questionID: id,
					userName: userName,
				};
				console.log(reqBody);
				const result = await runPracticeCode(reqBody);
				console.log(result);
				if (result?.resp?.stdout) {
					updateBody({
						...body,
						toggleOutput: true,
						output: result.resp.stdout,
						practiceStatus: result.status,
					});
				} else {
					updateBody({
						...body,
						toggleOutput: true,
						output: `Error During Execution (Please check for semicolons and syntax errors) : \n ${result.stderr}`,
					});
				}
			}
		} catch (err) {
			console.error("error : " + err);
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<LoadingButton
			onClick={handleClick}
			loading={isLoading}
			loadingPosition='end'
			variant='contained'
			sx={{
				backgroundColor: "#16a34a",
				paddingX: 4,
				width: "100%",
				"&.Mui-disabled": {
					backgroundColor: "blue",
					color: "#fff",
					paddingRight: 6,
				},
			}}>
			<span>Run</span>
		</LoadingButton>
	);
};

export default RunButton;
