import axios from "axios";

const getChatData = async (chatId) => {

    try {
        const response = await axios.post('https://connectify-lzvt.onrender.com/chatRoute/user-chat', {
            chatId
        });

        return response.data;
    } catch (error) {
        return error.response?.data || { success: false, message: error.message || "Something went wrong" };
    }
}




export {
    getChatData,

};