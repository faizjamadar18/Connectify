import axios from "axios";

const getChatData = async (chatId) => {

    try {
        const response = await axios.post('http://localhost:3000/chatRoute/user-chat', {
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