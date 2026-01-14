import httpStatus from 'http-status';
import Connection from "../models/Connection.js";
import User from "../models/User.js"

const userProfile = async (req, res) => {

    const { username } = req.body;

    const user = await User.findOne({ username })
        .populate({
            path: 'connections',
            populate: [
                { path: 'user1', select: 'username image description' },
                { path: 'user2', select: 'username image description' },
            ]
        })

    if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "User not found",
        });
    }

    return res.status(httpStatus.OK).json({
        success: true,
        user
    });
}

const createNewConnection = async (req, res) => {

    const { remoteId, userId } = req.body;

    const user1 = await User.findById(remoteId);
    const user2 = await User.findById(userId);

    if (!user1 || !user2) {
        return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "One or both users not found",
        });
    }

    const existingConnection = await Connection.findOne({
        $or: [
            { user1: remoteId, user2: userId },
            { user1: userId, user2: remoteId },
        ],
    });

    if (existingConnection) {
        return res.status(httpStatus.CONFLICT).json({
            success: false,
            message: "Connection already exists",
            connectionId: existingConnection._id,
        });
    }

    const newConnection = new Connection({
        user1: remoteId,
        user2: userId,
    });

    const savedConnection = await newConnection.save();

    user1.connections.push(savedConnection._id);
    user2.connections.push(savedConnection._id);

    await user1.save();
    await user2.save();

    return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Connection created successfully",
        connectionId: savedConnection._id,
    });
}

const getLiveUsersData = async (req, res) => {
    const { usersId } = req.body;

    if (!Array.isArray(usersId) || usersId.length === 0) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid or empty usersId array" });
    }

    const users = await User.find({ _id: { $in: usersId } }).select('username email image description');
    return res.status(httpStatus.OK).json({ success: true, users });

}

const getNetworkData = async (req, res) => {

    const { joinedUsers } = req.body;

    const users = await User.find({ _id: { $nin: joinedUsers } }).select('username email image description');


    return res.status(httpStatus.OK).json({ success: true, users });
}

export {
    userProfile,
    createNewConnection,
    getLiveUsersData,
    getNetworkData
};