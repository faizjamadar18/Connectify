import { useContext, useEffect, useState ,useCallback} from 'react';
import ChatContext from '../../context/ChatContext.js';
import Avatar from '@mui/material/Avatar';


import { Close } from "@mui/icons-material";

import UserContext from '../../context/UserContext.js';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

import { socket } from '../../services/socketService.js';




export default function ChatHeader() {

    const navigate = useNavigate()
    const { id } = useParams();
    const { userChat, isDialogOpen, setIsDialogOpen } = useContext(ChatContext);
    const [remoteUser, setRemoteUser] = useState(null);
    const { loginUser, onlineUsers } = useContext(UserContext);


    useEffect(() => {
        if (userChat) {
            setRemoteUser(userChat?.user1?.username === loginUser?.username ? userChat?.user2 : userChat?.user1);
        }
    }, [userChat, loginUser?.username]);


    const handleVideoCall = async () => {
        if (!onlineUsers.includes(remoteUser?._id)) {
            enqueueSnackbar("User is offline or unavailable for a call.", { variant: "warning" });
            return;
        }

        enqueueSnackbar("Waiting for response... Please do not navigate away.", { variant: "info", autoHideDuration: 3000 });


        socket.emit('video-call-request', {
            to: remoteUser._id,
            username: loginUser.username,
            userId: loginUser._id
        });
    }


    const handleRemoteUserResponse = useCallback(({ action, from }) => {
        if (action === 'allow') {
            navigate(`/video-call/${from}`);
        } else if (action === "reject") {
            enqueueSnackbar("Call has been rejected.", { variant: "error" });
        }
    }, [navigate]);

    useEffect(() => {
        socket.on('video-call-invitation-remote-response', handleRemoteUserResponse);

        return () => {
            socket.off('video-call-invitation-remote-response', handleRemoteUserResponse);
        }
    }, [handleRemoteUserResponse]);

    return (
        <>
            <div className='w-full flex items-center space-x-2'>

                <Link to={(userChat?.members?.length >= 1) ? `/community/${id}` : `/u/profile/${remoteUser?.username}`}>
                    <Avatar src={remoteUser?.image} className='rounded-0' sx={{ width: 40, height: 40 }} />
                </Link>

                <div className='pe-5 w-[3rem] flex-1'>
                    <Link to={`/u/profile/${remoteUser?.username}`}>
                        <h1 className='text-lg font-semibold m-0 truncate line-clamp-1 text-white'>{remoteUser?.username}</h1>
                    </Link>
                    <p className='text-sm '>
                        {
                            (onlineUsers?.includes(remoteUser?._id)) ? <span className='text-green-500'>Online</span> : <span className='text-gray-500'>Offline</span>
                        }
                    </p>

                </div>

                {
                    (remoteUser) && <button onClick={handleVideoCall} className='h-8 w-10 me-2 rounded bg-[#80808045] cursor-pointer text-gray-500 hover:text-white'>
                        <VideocamOutlinedIcon />
                    </button>
                }

            </div>

            <div className='flex'>

                {
                    (isDialogOpen) && <button className='block md:hidden h-8 w-10 ms-2 rounded bg-[#80808045] cursor-pointer text-gray-500 hover:text-white' onClick={() => setIsDialogOpen(false)}>
                        <Close />
                    </button>
                }
            </div>
        </>
    )
}