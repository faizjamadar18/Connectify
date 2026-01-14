import axios from "axios";


const getUserProfile = async (username) => {
    try {
        const response = await axios.post("https://connectify-lzvt.onrender.com/chat-user/user-profile", {
            username
        });
        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message || "Unable to fetch user profile, please try again." };
    }
}


const connectToUser = async (remoteId, userId) => {
    try {
        const response = await axios.post('https://connectify-lzvt.onrender.com/chat-user/create-connection', {
            remoteId,
            userId
        });

        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message || "Unable to join user, please try again." };
    }
}



const getUsersData = async (usersId) => {
    try {
        const response = await axios.post('https://connectify-lzvt.onrender.com/chat-user/live-users-data', {
            usersId
        });

        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message || "Unable to get live users data." };
    }
}

const getTotalConnectionData = async (joinedUsers) => {

    try {
        const response = await axios.post('https://connectify-lzvt.onrender.com/chat-user/total-Network', {
            joinedUsers
        });

        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message || "Unable to fetch network data." };
    }
}

export {
    getUserProfile,
    connectToUser,
    getUsersData,
    getTotalConnectionData
};