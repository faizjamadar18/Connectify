import { useCallback, useContext, useEffect, useState } from 'react';
import ChatHeader from './ChatHeader.jsx';
import ChatFooter from './ChatFooter.jsx';
import { ChatMain } from './ChatMain.jsx';
import { Link, useParams } from 'react-router-dom';
import { getChatData } from "../../services/chatService.js";
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';
import ChatContext from '../../context/ChatContext.js';
import UserContext from '../../context/UserContext.js';
import { socket } from '../../services/socketService.js';
import LoaderContext from '../../context/LoaderContext.js';


export default function ChatRoom() {

    const [isLoading, setIsLoading] = useState(false);
    const [remoteUser, setRemoteUser] = useState(null);

    const { enqueueSnackbar } = useSnackbar();
    const { userChat, setUserChat, joinedUsers, setJoinedUsers } = useContext(ChatContext);
    const { setIsMessageProcessing } = useContext(LoaderContext);
    const { loginUser } = useContext(UserContext);

    const { id } = useParams();


    const handleNewChatMessage = useCallback(({ recipientId, data }) => {

        if (userChat?._id !== recipientId) return;

        setUserChat(prev => ({
            ...prev,
            messages: [...prev.messages, data]
        }));



        if (loginUser?._id === data?.sender?._id) {
            setIsMessageProcessing(false);
        }
    }, [userChat, loginUser, setIsMessageProcessing, setUserChat]);


    const getCurrentChatData = useCallback(async () => {

        if (!id || !loginUser)
            return;

        setIsLoading(true);
        try {
            const response = await getChatData(id);

            if (response.success) {
                let userIds = [];
                if (response.userChat?.user1 && response.userChat?.user2) {
                    userIds = [response.userChat.user1._id.toString(), response.userChat.user2._id.toString()];

                    setRemoteUser(
                        response.userChat.user1?._id === loginUser?._id
                            ? response.userChat?.user2
                            : response.userChat?.user1
                    );
                }

                setJoinedUsers(userIds);
                setUserChat(response.userChat);

            } else {
                setUserChat(null);
                enqueueSnackbar(response.message || "Something went wrong, please try again.", { variant: "error" });
            }
        } catch (error) {
            enqueueSnackbar(error.message || "Something went wrong.", { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    }, [enqueueSnackbar, id, loginUser, setJoinedUsers, setUserChat]);


    useEffect(() => {

        if (!socket.hasListeners("add-chat-message-success")) {
            socket.on("add-chat-message-success", handleNewChatMessage);
        }


        return () => {
            if (socket.hasListeners("add-chat-message-success")) {
                socket.off("add-chat-message-success", handleNewChatMessage);
            }

        };
    }, [handleNewChatMessage, enqueueSnackbar, setIsMessageProcessing]);


    useEffect(() => {
        if (userChat?._id === id) return;

        getCurrentChatData();
    }, [id, getCurrentChatData, userChat?._id]);



    if (!localStorage.getItem('authToken')) {
        return (
            <div className="h-full flex justify-center items-center p-3">
                <CircularProgress sx={{ color: "white" }} />
                <p className="text-gray-300 ml-3">Checking login status...</p>
            </div>
        );
    }

    if (!id) {
        return (
            <div className="flex justify-center h-full items-center p-3">
                <h1 className="text-xl text-center font-bold text-gray-300 rounded bg-[#000000ab] p-2">Please Select Chat</h1>
            </div>
        );
    }

    if (!userChat && !isLoading) {
        return (
            <div className='h-full flex justify-center text-center items-center p-3'>
                <h1 className='text-xl text-red-500 p-3 rounded bg-[#000000ab]'>UserChat not found, please try again!</h1>
            </div>
        )
    }


    if (!joinedUsers.includes(loginUser?._id)) {
        return (
            <div className='h-full flex justify-center text-center items-center p-3'>
                <div className='p-3 rounded bg-[#000000ab] space-y-1'>
                    <h1 className='text-xl'>You have not joined this {remoteUser ? 'user chat' : 'group'}</h1>
                    <Link to={'/u/join-requests'} className='text-orange-500 hover:text-orange-700'>
                        Click to join
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <header className='py-2 px-3 bg-[#000000d1] flex justify-between items-center w-full'>
                <ChatHeader />
            </header>

            <main className='flex-1 h-full overflow-hidden relative'>
                {isLoading ? (
                    <div className='h-full flex justify-center items-center'>
                        <CircularProgress sx={{ color: "white" }} />
                    </div>
                ) : (
                    <ChatMain />
                )}
            </main>

            <footer className='bg-[#000000d1] p-3 space-x-3 w-full'>
                <ChatFooter />
            </footer>
        </>
    );
}