import httpStatus from 'http-status';
import mongoose from 'mongoose';
import Connection from '../models/Connection.js';



const getUserChat = async (req, res) => {

    const { chatId } = req.body;

    if (!chatId) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Chat ID not found."
        });
    }

    if (!mongoose.isValidObjectId(chatId)) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Invalid Chat ID format.",
        });
    }

    const currChat = await Connection.findById(chatId)
        .populate([
            { path: 'user1', select: 'username image description' },
            { path: 'user2', select: 'username image description' },
            {
                path: 'messages',
                populate: [
                    { path: 'sender', select: 'username image description' }
                ]
            }
        ])


    const chatData = currChat;

    if (!chatData) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Chat data not found, please try again."
        });
    }

    return res.status(httpStatus.OK).json({
        success: true,
        userChat: chatData,
    });
}




export {
    getUserChat,
};