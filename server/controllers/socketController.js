import { Server } from "socket.io";
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Chat from "../models/Chat.js";

import User from "../models/User.js";
import Connection from "../models/Connection.js";


dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const onlineUsers = new Map();
// Map() is bacically a key-vlue pair 
// onlineUsers = {
//   "userA_id" => Set { "socket1", "socket2" },
//   "userB_id" => Set { "socket3" }
// }

const ongoingCalls = new Set();


const connectToSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: ["https://connectify-lzvt.onrender.com", "http://localhost:5173"],
            methods: ["GET", "POST", "DELETE", "PUT"],
        },
        maxHttpBufferSize: 1e8
    });

    console.log("Socket.IO is running...");

    io.on("connection", (socket) => {

        console.log(`A user connected: ${socket.id}`);

        socket.on('user-online', ({ userId }) => {

            if (!onlineUsers.has(userId)) {
                onlineUsers.set(userId, new Set());
            }

            onlineUsers.get(userId).add(socket.id);


            io.emit('update-online-users', Array.from(onlineUsers.keys()));
        });

        socket.on('add-chat-message', async ({ message, video, pdf, image, userId, recipientId }) => {

            let uploadedFiles = { image: null, video: null, pdf: null };

            try {
                if (!message && !video && !pdf && !image) {
                    return socket.emit("error-notification", { message: "Message must contains text, poll, video, pdf or image." });
                }


                if (!userId || !recipientId) {
                    return socket.emit("error-notification", { message: "User ID and Recipient ID are required." });
                }

                const senderExists = await User.findById(userId);
                if (!senderExists) {
                    return socket.emit("error-notification", { message: "Sender not found." });
                }

                if (image) {

                    const uploadedImage = await cloudinary.uploader.upload(image, { folder: "ChatMeetUp_Message_Files" });
                    uploadedFiles.image = uploadedImage.secure_url;

                }

                if (video) {
                    const uploadedVideo = await cloudinary.uploader.upload(video, {
                        resource_type: "video",
                        folder: "ChatMeetUp_Message_Files"
                    });
                    uploadedFiles.video = uploadedVideo.secure_url;
                }

                if (pdf) {
                    const uploadedPdf = await cloudinary.uploader.upload(pdf, {
                        resource_type: "raw",
                        folder: "ChatMeetUp_Message_Files"
                    });
                    uploadedFiles.pdf = uploadedPdf.secure_url;
                }

                const newMessageData = {
                    sender: userId,
                    attachments: uploadedFiles,
                    message,
                };


                const newMessage = new Chat(newMessageData);
                await newMessage.save();

                const connection = await Connection.findById(recipientId);

                let joinUserIds = [];

                if (connection) {
                    connection.messages.push(newMessage._id);
                    await connection.save();

                    joinUserIds = [connection.user1.toString(), connection.user2.toString()];

                } else {
                    return socket.emit("error-notification", { message: "Recipient not found." });
                }

                const populatedMessage = await Chat.findById(newMessage._id).populate({
                    path: 'sender',
                    select: 'username image',
                });

                joinUserIds.forEach(userId => {
                    if (onlineUsers.has(userId)) {
                        onlineUsers.get(userId).forEach(socketId => {
                            io.to(socketId).emit('add-chat-message-success', {
                                recipientId,
                                data: populatedMessage,
                            });
                        });
                    }
                });

            } catch (error) {
                socket.emit("error-notification", { message: error.message || "Something went wrong, Can't send message. Try again." });
            }
        });
        socket.on('user-logout', ({ userId }) => {
            const userSockets = onlineUsers.get(userId);

            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                }
            }

            io.emit("update-online-users", Array.from(onlineUsers.keys()));
        });

        socket.on("disconnect", () => {

            console.log(`user disconnect ${socket?.id}`);
            onlineUsers.forEach((socketSet, userId) => {
                socketSet.delete(socket.id);
                if (socketSet.size === 0) {
                    onlineUsers.delete(userId);
                }
            });

            io.emit('update-online-users', Array.from(onlineUsers.keys()));
        });


        socket.on('video-call-request', ({ to, username, userId }) => {
            const userSocketId = onlineUsers.get(to)?.values().next().value;

            if (!userSocketId) {
                return socket.emit("error-notification", { message: "User is offline at the moment." });
            }


            if (ongoingCalls.has(to) || ongoingCalls.has(userId)) {
                return socket.emit("error-notification", {
                    message: "users is already in another call."
                });
            }

            io.to(userSocketId).emit('video-call-invitation', {
                from: userId,
                username
            });

        })

        socket.on('video-call-invitation-response', ({ from, to, action }) => {

            const userSocketId = onlineUsers.get(to)?.values().next().value;

            if (!userSocketId) {
                return socket.emit("error-notification", { message: "User is no longer available to receive your response." });
            }

            if (action === 'allow') {
                ongoingCalls.add(from);
                ongoingCalls.add(to);
            }

            io.to(userSocketId).emit('video-call-invitation-remote-response', {
                action,
                from
            });
        });

        // It receives the offer and fetch the corresponding userId and send it to that particular userId an offer
        socket.on('offer', ({ offer, to }) => {
            try {
                if (!to) {
                    return socket.emit("error-notification", { message: "Invalid recipient for offer." });
                }

                const userSockets = onlineUsers?.get(to);

                if (!userSockets || userSockets.size === 0) {
                    return socket.emit("error-notification", { message: "User is offline at the moment." });
                }

                const userSocketId = userSockets.values().next().value;

                if (!userSocketId) {
                    return socket.emit("error-notification", { message: "No active connection found for the user." });
                }

                io.to(userSocketId).emit('offer', { offer, sender: socket.id });

            } catch (error) {
                socket.emit("error-notification", { message: "An error occurred while sending the offer." });
            }
        });

        // When the remote user call the answer function This below function is invoked
        // It basically receives the ID of the user To which the answer has to be send ,and fetch the corresponding socket id  And send the response by sending the socket ID itself
        socket.on('answer', ({ answer, to }) => {
            try {
                if (!to) {
                    return socket.emit("error-notification", { message: "Invalid recipient for answer." });
                }

                io.to(to).emit('answer', { answer, sender: socket.id });
            } catch (error) {
                socket.emit("error-notification", { message: "An error occurred while sending the answer." });
            }
        });


        // This function is only called when The frontend call the function ice candidate(route) With corresponding candidate(route) towards the user ID 
        socket.on('ice-candidate', ({ candidate, to }) => {
            try {
                if (!to) {
                    return socket.emit("error-notification", { message: "Invalid recipient for ICE candidate." });
                }

                const userSockets = onlineUsers?.get(to);

                if (!userSockets || userSockets.size === 0) {
                    return socket.emit("error-notification", { message: "User is offline at the moment." });
                }

                const userSocketId = userSockets.values().next().value;

                if (!userSocketId) {
                    return socket.emit("error-notification", { message: "No active connection found for the user." });
                }

                io.to(userSocketId).emit('ice-candidate', { candidate, sender: socket.id });
            } catch (error) {
                socket.emit("error-notification", { message: "An error occurred while sending the ICE candidate." });
            }
        });


        
        socket.on('leave-call', ({ from, to }) => {

            // If neither user is in an active call, do nothing
            if (!ongoingCalls.has(from) && !ongoingCalls.has(to)) {
                return;
            }

            // Remove both users from ongoing call tracking
            ongoingCalls.delete(from);
            ongoingCalls.delete(to);

            // Notify the sender to leave the call
            socket.emit('leave-call');

            // Get ALL active socket connections of the remote user
            const remoteUserSockets = onlineUsers.get(to);

            // If the remote user is online
            if (remoteUserSockets) {
                // Notify every open tab/device of the remote user
                remoteUserSockets.forEach((userSocketId) => {
                    socket.to(userSocketId).emit('leave-call');
                });
            }
        });



    })

}
export { connectToSocket };