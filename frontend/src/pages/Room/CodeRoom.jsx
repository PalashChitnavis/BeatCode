/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
import InputWindow from "../../components/InputWindow/InputWindow";
import OutputWindow from "../../components/OutputWindow/OutputWindow";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import io from "socket.io-client";
import { useNavigate, useLocation } from "react-router-dom";
import peer from "../../services/peer";
import { isLoggedIn } from "../../components/Login/isLoggedIn";
import Register from "../../components/Login/Register";
import ReactPlayer from "react-player";
import { useSelector, useDispatch } from "react-redux";
import { updateCode } from "../../redux/slices/codeSlice";
import { updateLanguage } from "../../redux/slices/languageSlice";
import { updateUserInput } from "../../redux/slices/userInputSlice";
const CodeRoom = () => {
	const dispatch = useDispatch();
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	const [users, setUsers] = useState([]);
	const [me, setMe] = useState({
		username: "User 1",
		socketID: "",
	});
	const [otherUser, setOtherUser] = useState({
		username: "User 2",
		socketID: "",
	});
	const location = useLocation();
	const [socket, setSocket] = useState(null);
	const { roomID } = useParams();
	useEffect(() => {
		if (!socket) {
			setSocket(io(backendUrl));
			socket &&
				socket.emit("languageChange", { language: "java", roomID: roomID });
		}

		return () => {
			socket?.disconnect();
		};
	}, [socket]);

	const navigate = useNavigate();
	function leaveRoom() {
		window.location.href = "/room";
		socket && socket.emit("endVideoCall", { to: otherUser.socketID });
	}

	useEffect(() => {
		const username = localStorage.getItem("username");
		socket &&
			socket.emit("userdetails", { username: username, roomID: roomID });
		socket &&
			socket.on("getUserDetails", (userRoom) => {
				const { users } = userRoom;
				setUsers(users);

				if (isLoggedIn() && users.length == 1) {
					setMe(users[0]);
					setOtherUser({
						username: "User 2",
						socketID: "",
					});
					const userNamesString = users[0].username;
					toast.info(`1 Room member : ${userNamesString}`, {
						position: "top-right",
					});
				}
				if (isLoggedIn() && users.length == 2) {
					if (users[0].username == username) {
						setMe(users[0]);
						setOtherUser(users[1]);
					} else {
						setMe(users[1]);
						setOtherUser(users[0]);
					}
					const userNamesString =
						users[0].username + " and " + users[1].username;
					toast.info(`2 Room members : ${userNamesString}`, {
						position: "top-right",
					});
				}
			});
		socket &&
			socket.on("roomFull", () => {
				toast.warn("The room is already full");
				navigate("/room");
			});

		return () => {
			socket && socket.off("getUserDetails");
			socket && socket.off("roomFull");
		};
	}, [socket]);

	useEffect(() => {
		socket &&
			socket.emit("languageChange", { language: "cpp", roomID: roomID });
	}, []);

	useEffect(() => {
		socket &&
			socket.on("codeUpdate", ({ code }) => {
				console.log("code update ON : " + code);
				dispatch(updateCode(code));
			});

		socket &&
			socket.on("inputUpdate", ({ userInput }) => {
				console.log("userinput update ON : " + userInput);
				dispatch(updateUserInput(userInput));
			});
		socket &&
			socket.on("languageChange", ({ language }) => {
				console.log("language update ON : " + language);
				dispatch(updateLanguage(language));
			});

		return () => {
			socket && socket.off("codeUpdate");
			socket && socket.off("inputUpdate");
			socket && socket.off("languageChange");
		};
	}, [socket]);
	//Video Call Logic
	const [myStream, setMyStream] = useState();
	const [otherStream, setOtherStream] = useState();
	const [acceptCallButton, setAcceptCallButton] = useState(false);
	const [endCall, setEndCall] = useState(false);

	const startVideoCall = useCallback(async () => {
		if (users && users.length == 1) {
			toast.warn("Wait for second person to join !");
		} else {
			setEndCall(true);
			console.log("starting video call ... ");

			setAcceptCallButton(false);
			toast.info("Starting Video Call", { position: "top-right" });
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: true,
			});
			const offer = await peer.getOffer();
			socket.emit("startCall", { to: otherUser.socketID, offer });
			setMyStream(stream);
		}
	}, [otherUser.socketID, socket]);
	function endVideoCall() {
		setEndCall(false);
		setAcceptCallButton(false);
		console.log("ending video call ...");
		if (myStream) {
			myStream.getTracks().forEach((track) => {
				track.stop();
			});
		}
		setMyStream(null);
		setOtherStream(null);
		socket && socket.emit("endVideoCall", { to: otherUser.socketID });
		toast.info("Ending Video Call", { position: "top-right" });
	}

	const incommingCall = useCallback(
		async ({ from, offer }) => {
			console.log("incoming call ...");
			if (!endCall) {
				setAcceptCallButton(true);
			}
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: true,
			});
			const videoTracks = stream.getVideoTracks();
			const videoStream = new MediaStream(videoTracks);
			setMyStream(videoStream);
			const answer = await peer.getAnswer(offer);
			socket.emit("callAccepted", { to: from, answer });
		},
		[socket]
	);

	const sendStreams = useCallback(() => {
		for (const track of myStream.getTracks()) {
			peer.peer.addTrack(track, myStream);
		}
	}, [myStream]);

	const handleCallAccepted = useCallback(
		({ from, answer }) => {
			peer.setLocalDescription(answer);
			sendStreams();
		},
		[sendStreams]
	);

	const handleEndCall = useCallback(() => {
		setOtherStream(null);
		setMyStream(null);
		setEndCall(false);
		setAcceptCallButton(false);
	});

	const handleNegoNeeded = useCallback(async () => {
		const offer = await peer.getOffer();
		socket.emit("peer:nego:needed", { offer, to: otherUser.socketID });
	}, [otherUser.socketID, socket]);

	useEffect(() => {
		peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
		return () => {
			peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
		};
	}, [handleNegoNeeded]);

	const handleNegoNeedIncomming = useCallback(
		async ({ from, offer }) => {
			const answer = await peer.getAnswer(offer);
			socket.emit("peer:nego:done", { to: from, answer });
		},
		[socket]
	);

	const handleNegoNeedFinal = useCallback(async ({ answer }) => {
		await peer.setLocalDescription(answer);
	}, []);

	useEffect(() => {
		peer.peer.addEventListener("track", async (ev) => {
			const remoteStream = ev.streams;
			console.log("GOT TRACKS!!");
			setOtherStream(remoteStream[0]);
		});
	}, []);

	useEffect(() => {
		socket && socket.on("incommingCall", incommingCall);
		socket && socket.on("callAccepted", handleCallAccepted);
		socket && socket.on("peer:nego:needed", handleNegoNeedIncomming);
		socket && socket.on("peer:nego:final", handleNegoNeedFinal);
		socket && socket.on("endVideoCall", handleEndCall);
		return () => {
			socket && socket.off("incommingCall");
			socket && socket.off("callAccepted");
			socket && socket.off("peer:nego:needed");
			socket && socket.off("peer:nego:final");
			socket && socket.off("endVideoCall");
		};
	}, [
		socket,
		incommingCall,
		handleCallAccepted,
		handleNegoNeedFinal,
		handleNegoNeedIncomming,
		handleEndCall,
	]);

	return (
		<div className='h-[100vh] w-[100vw]'>
			<div className='h-[8vh] w-[100vw] flex justify-center items-center'>
				<Header />
			</div>
			<div className='min-h-[87vh] w-full'>
				{!isLoggedIn() ? (
					<div className='z-1999 fixed w-full h-[87vh] flex justify-center items-center  bg-[#000] bg-opacity-50 '>
						<div className='bg-[#2f3136] z-[2000] w-[95%] h-[90%] flex-col flex justify-evenly items-center p-8 rounded-2xl text-white'>
							<div className='text-2xl text-center'>
								To use this feature please register yourself, thank you 😊
							</div>
							<div>
								<Register />
							</div>
						</div>
					</div>
				) : (
					<div className='flex items-center h-full w-full'>
						<div className='w-[50%] h-full'>
							<div className='w-[96%] h-[8vh]'>
								{isLoggedIn() && (
									<NavBar
										socket={socket}
										roomID={roomID}
									/>
								)}
							</div>
							<div className='w-[100%] h-[78vh]'>
								{isLoggedIn() && (
									<CodeEditor
										className='z-10'
										socket={socket}
										roomID={roomID}
										users={users}
									/>
								)}
							</div>
						</div>

						<div>
							<div className='flex w-[50vw] gap-5'>
								<div className='w-[48%] pt-[4vh] h-[85vh] flex flex-col gap-10'>
									<div className='h-[40%]'>
										<InputWindow
											socket={socket}
											roomID={roomID}
										/>
									</div>
									<div className=' h-[40%]'>
										<OutputWindow />
									</div>
								</div>
								<div className='flex justify-evenly items-center h-[85vh] flex-col w-[48%]'>
									<CopyToClipboard
										text={roomID}
										onCopy={() =>
											toast.success(`Room ID : ${roomID} copied to clipboard`, {
												position: "top-right",
											})
										}>
										<div className='ml-[2vw] pt-[2vh] w-[50%] h-[6vh] bg-[#2f3136] rounded-lg flex justify-between p-3 cursor-pointer hover:bg-[#9298a8]'>
											<div className='text-white  flex pl-5 items-center h-[100%] text-3xl'>
												{roomID}
											</div>
											<button className='text-white flex justify-center items-center text-xl '>
												<i className='fa-solid fa-copy'></i>
											</button>
										</div>
									</CopyToClipboard>
									<div className='w-[90%] ml-[2vw] pt-[2vh] h-[90%] flex flex-col gap-5'>
										<div className=' h-[45%] bg-[#272822] flex justify-center items-center rounded-lg text-white'>
											{!myStream && !otherStream && me && me.username}
											{myStream && (
												<div className='flex justify-center items-center rounded-xl'>
													<ReactPlayer
														playing
														height='90%'
														width='100%'
														url={myStream}
														volume={5}
													/>
												</div>
											)}
										</div>
										<div className=' h-[45%] bg-[#272822] flex justify-center items-center rounded-lg text-white'>
											{!myStream &&
												!otherStream &&
												otherUser &&
												otherUser.username}
											{otherStream && (
												<div className='flex justify-center items-center'>
													<ReactPlayer
														playing
														height='90%'
														width='100%'
														url={otherStream}
													/>
												</div>
											)}
										</div>
									</div>
									<div className='w-[90%] ml-[2vw]  h-[10%] flex flex-col gap-5'>
										<div className='flex w-[100%] justify-around h-[6vh]'>
											{endCall ? (
												<div
													onClick={endVideoCall}
													className='bg-red-500 w-[40%] flex justify-center items-center rounded-2xl gap-3 cursor-pointer hover:bg-red-700 text-white'>
													<i className='fa-solid fa-phone-slash'></i>
													End Call
												</div>
											) : acceptCallButton ? (
												<div
													onClick={startVideoCall}
													className='bg-green-500 w-[40%] flex justify-center items-center rounded-2xl gap-3 cursor-pointer hover:bg-green-700 text-white'>
													<i className='fa-solid fa-video'></i>
													Accept Call
												</div>
											) : (
												<div
													onClick={startVideoCall}
													className='bg-blue-500 w-[40%] flex justify-center items-center rounded-2xl gap-3 cursor-pointer hover:bg-blue-700 text-white'>
													<i className='fa-solid fa-video'></i>
													Video Call
												</div>
											)}

											<div
												onClick={leaveRoom}
												className='bg-red-500 w-[40%] flex gap-2 justify-center items-center rounded-2xl text-white text-l cursor-pointer hover:bg-red-700'>
												<i className='fa-solid fa-arrow-right-from-bracket'></i>{" "}
												Leave Room
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className='h-[5vh] w-[100vw] flex justify-center items-center'>
				<Footer />
			</div>
		</div>
	);
};

export default CodeRoom;
