import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { CircularProgress, Tooltip } from "@mui/material";
import { useSnackbar } from 'notistack';
import ChatContext from '../../context/ChatContext.js';
import { formatTime } from '../../utils/helpers.js';
import UserContext from '../../context/UserContext.js';

import ChatAttachment from "./ChatMain/ChatAttachment.jsx"
import LoaderContext from '../../context/LoaderContext.js';



export function ChatMain() {


    const { isMessageProcessing } = useContext(LoaderContext);
    const { userChat } = useContext(ChatContext);
    const { loginUser, onlineUsers } = useContext(UserContext);

    const [localChat, setLocalChat] = useState(userChat || {});



    useEffect(() => {
        setLocalChat(userChat);
    }, [userChat]);




    const cleanChat = userChat
    const filterUserChat = useMemo(() => {
        if (!localChat?.messages) return [];

        return localChat.messages.filter(chatData => {
            let isMessageVisible = true;

            if (cleanChat) {
                const messageCreatedAt = new Date(chatData.createdAt);
                const chatClearedAt = new Date(cleanChat.clearedAt);

                if (messageCreatedAt < chatClearedAt) {
                    isMessageVisible = false;
                }
            }

            const hasText =
                chatData.message &&
                chatData.message.trim().length > 0;

            const hasAttachment =
                chatData.attachments?.image ||
                chatData.attachments?.pdf ||
                chatData.attachments?.video;

            return isMessageVisible && (hasText || hasAttachment);
        });
    }, [localChat?.messages, cleanChat]);





    if (filterUserChat?.length == 0) {
        return <div className='flex justify-center items-center h-full'>
            <p className="p-3 bg-[#000000ab] w-fit rounded text-white">No messages found</p>
        </div>
    }

    const chatMessageRefs = useRef([]);

    return (
        <>
            <ul className='space-y-3 h-full overflow-auto p-3'>

                {filterUserChat?.map((data, index) => (

                    <li key={data?._id ?? 'default-id'}
                        ref={(el) => (chatMessageRefs.current[index] = el)}
                        data-message-id={data._id}
                        className={`flex ${data?.sender?.username === loginUser?.username ? 'justify-end' : ''}`}
                    >

                        <div className={`group relative flex ${data?.sender?.username === loginUser?.username ? 'flex-row-reverse' : ''}`}>

                            {(onlineUsers.includes(data?.sender?._id) && loginUser._id !== data.sender._id) ? (
                                <Tooltip title="User Online" arrow>
                                    <div className="relative h-fit cursor-pointer" style={{ position: 'sticky', top: '0' }}>
                                        <Link to={`/u/profile/${data?.sender?.username}`}>
                                            <Avatar src={data?.sender?.image ?? ''} />
                                        </Link>
                                        <span className="absolute bottom-0 right-0 flex size-3">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                                            <span className="inline-flex size-3 rounded-full bg-green-700"></span>
                                        </span>
                                    </div>
                                </Tooltip>
                            ) : (
                                <div className="relative h-fit cursor-pointer" style={{ position: 'sticky', top: '0' }}>
                                    <Link to={`/u/profile/${data?.sender?.username}`}>
                                        <Avatar src={data?.sender?.image ?? ''} />
                                    </Link>
                                </div>
                            )}

                            <div className={`bg-[#1F1F1F] p-2 mt-4 rounded-b-lg ${loginUser?.username === data?.sender?.username ? 'rounded-s-lg me-2 ms-10' : 'rounded-e-lg me-10 ms-2'}`}>

                                {/* Message Header */}
                                <div className="text-[0.8rem] space-x-2 flex justify-between border-b border-neutral-700 pb-1 text-gray-400">
                                    <p>{data?.sender?.username ?? 'Unknown'}</p>
                                    <p className='pe-2'>{formatTime(data?.createdAt) ?? 'Just now'}</p>
                                </div>

                                <div>


                                    {/* Message Content */}
                                    {data?.message && <p className='whitespace-pre-line pt-3 text-gray-200 break-all'>{data.message}</p>}

                                    {/* Attachment */}
                                    <ChatAttachment data={data} />



                                </div>


                            </div>
                        </div>
                    </li>
                ))}
            </ul>



            {
                isMessageProcessing && <div className='absolute  top-0 left-0 bg-[#00000055] w-full h-full flex justify-center items-center'><CircularProgress sx={{ color: "white" }} /></div>
            }

        </>
    );
}