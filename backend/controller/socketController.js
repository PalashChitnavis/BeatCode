const socketIO = require("socket.io");
const dotenv = require("dotenv");
dotenv.config();
function socketController(server) {
        const frontendUrl = process.env.FRONTEND_URL;
        const io = socketIO(server, {
                cors: {
                        origin: "*", // Allow requests from all origins (you can specify your origins instead)
                        methods: ["GET", "POST"], // Allowed HTTP methods
                },
        });
        let allRooms = [];
        io.on("connection", (socket) => {
                console.log("user connected : ", socket.id);
                socket.on("userdetails", ({ username, roomID }) => {
                        const user = {
                                username: username,
                                socketID: socket.id,
                        };

                        let existingRoom = allRooms.find((room) => room.roomID === roomID);
                        //console.log(existingRoom);
                        if (existingRoom && existingRoom.users.length == 2) {
                                io.to(socket.id).emit("roomFull");
                        } else {
                                if (existingRoom) {
                                        existingRoom.users.push(user);
                                        console.log(existingRoom);
                                } else {
                                        const newRoom = {
                                                roomID: roomID,
                                                users: [user],
                                        };
                                        allRooms.push(newRoom);
                                        //console.log(newRoom);
                                }
                                socket.join(roomID);
                                let userRoom = allRooms.find((room) => room.roomID === roomID);
                                io.to(roomID).emit("getUserDetails", userRoom);
                        }
                });

                socket.on("codeUpdate", ({ code, roomID }) => {
                        io.to(roomID).emit("codeUpdate", { code: code });
                });
                socket.on("inputUpdate", ({ userInput, roomID }) => {
                        console.log("updated input : ", userInput);
                        io.to(roomID).emit("inputUpdate", { userInput: userInput });
                });
                socket.on("languageChange", ({ language, roomID }) => {
                        console.log("updated language : ", language);
                        io.to(roomID).emit("languageChange", { language: language });
                });

                socket.on("startCall", ({ to, offer }) => {
                        console.log("triggertostart");
                        io.to(to).emit("incommingCall", { from: socket.id, offer });
                });

                socket.on("callAccepted", ({ to, answer }) => {
                        console.log("call has been accepted");
                        io.to(to).emit("callAccepted", { from: socket.id, answer });
                });

                socket.on("peer:nego:needed", ({ to, offer }) => {
                        console.log("peer:nego:needed");
                        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
                });

                socket.on("peer:nego:done", ({ to, answer }) => {
                        console.log("peer:nego:done");
                        io.to(to).emit("peer:nego:final", { from: socket.id, answer });
                });

                socket.on("endVideoCall", ({ to }) => {
                        io.to(to).emit("endVideoCall");
                });

                socket.on("disconnect", () => {
                        console.log("user disconnected : ", socket.id);
                        // Remove the disconnected user from allRooms
                        allRooms.forEach((room, index) => {
                                const userIndex = room.users.findIndex((user) => user.socketID === socket.id);
                                if (userIndex !== -1) {
                                        room.users.splice(userIndex, 1);
                                        // Emit updated user details to all users in the room
                                        io.to(room.roomID).emit("getUserDetails", room);
                                }
                                if (room.users.length == 0) {
                                        allRooms.splice(index, 1);
                                }
                        });
                        allRooms.map((room) => {
                                console.log(room);
                        });
                });
        });
}

module.exports = socketController;
