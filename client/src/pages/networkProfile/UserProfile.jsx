import  { useContext, useEffect, useState, forwardRef, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {  getUserProfile } from '../../services/userchatService';
import {  updateUserProfileImage } from '../../services/userService';

import UserContext from '../../context/UserContext';

import LeftSidebar from '../../components_/SidebarLayout/LeftSidebar';

import { Avatar, CircularProgress } from '@mui/material';

import { Edit} from "@mui/icons-material";
import { socket } from '../../services/socketService';




export default function UserProfile() {

    const navigate = useNavigate();
    const { id } = useParams();
    const { loginUser, setLoginUser, onlineUsers } = useContext(UserContext);
    const { enqueueSnackbar } = useSnackbar();

    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [selectedComponent, setSelectedComponent] = useState("connections");


    const fileInputRef = useRef(null);
    const [selectedUpdateImage, setSelectedUpdateImage] = useState(null);

    const fetchUserProfile = async () => {
        try {
            setIsLoading(true);
            const response = await getUserProfile(id);
            if (response.success) {
                setUserProfile(response.user);
            } else {
                enqueueSnackbar(response.message || "Failed to fetch user data", { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error.message || "An error occurred", { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loginUser || !id) return;

        fetchUserProfile();
        setSelectedUpdateImage(null);
    }, [loginUser, id]);



    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);

            setUserProfile(prev => ({ ...prev, image: imageUrl }));
            setSelectedUpdateImage(file);
        }
    }

    const handleUpdateImage = async () => {
        try {
            setIsLoading(true);
            const response = await updateUserProfileImage(selectedUpdateImage, loginUser?._id);

            if (response.success) {
                setUserProfile((prev) => ({
                    ...prev,
                    image: response.imageUrl
                }));
                enqueueSnackbar(response.message || 'Profile image updated successfully.', { variant: 'success' });
            } else {
                enqueueSnackbar(response.message || 'Error updating profile image:', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(response.message || 'Something went wrong while updating profile image.', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
        setSelectedUpdateImage(null);
    }


    const handleUserLogout = () => {

        if (loginUser) {
            socket.emit('user-logout', { userId: loginUser._id });
        }

        localStorage.removeItem("authToken");
        setLoginUser(null);
        navigate("/login");
    }



    if (!userProfile && !isLoading) {
        return (
            <div className='h-full border w-full flex justify-center items-center text-gray-500 text-2xl bg-gradient-to-r from-black to-gray-800'>
                User Not Found
            </div>
        )
    }

    const getListComponent = () => {
        const joinConnectionFilter = userProfile.connections.filter(connection =>
            connection?.user1?._id === loginUser?._id ||
            connection?.user2?._id === loginUser?._id
        );
        let component = null;

        if (selectedComponent === 'connections') {
            component = joinConnectionFilter.length > 0 ? (
                <ul className="space-y-3">
                    {joinConnectionFilter.map((connection) => {
                        const chatUser = (connection.user1.username === id) ? connection.user2 : connection.user1;

                        return (
                            <li key={connection._id}>
                                <Link to={`/u/chatting/${connection?._id}`} className='block p-3 border border-neutral-800 rounded-lg shadow-sm hover:bg-[#80808023] cursor-pointer transition'>
                                    <div className="flex items-center gap-4 ">
                                        <Avatar src={chatUser.image} alt={chatUser.username} className="w-12 h-12" />
                                        <h3 className="text-lg font-semibold line-clamp-1">{chatUser?.username}</h3>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 text-center mt-10">No connections found.</p>
            );

        }

        return component;
    };

    return (
        <div className='w-full h-full overflow-auto bg-black'>

            <div className='block md:hidden sticky top-0 bg-black z-10'>
                <LeftSidebar />
            </div>

            <div className="w-full text-white flex flex-col items-center py-10">
                {isLoading ? (
                    <div className="flex justify-center items-center h-screen">
                        <CircularProgress color="inherit" />
                    </div>
                ) : (
                    userProfile && (
                        <div className="w-[90%] md:w-[50%]">

                            <div className="relative flex justify-center w-fit mx-auto">
                                <Avatar
                                    src={userProfile.image || "#"}
                                    sx={{ width: "10rem", height: "10rem", cursor: "pointer" }}
                                    className="border-2 border-gray-500 shadow-lg"
                                    onClick={() => {
                                        setSelectedImage(userProfile.image);
                                        setOpen(true);
                                    }}
                                />

                                <input
                                    type="file"
                                    accept='image/*'
                                    ref={fileInputRef}
                                    className='hidden'
                                    onChange={handleFileChange} />
                                {
                                    (loginUser?.username === id) && <button
                                        className='absolute bottom-0 right-0 text-gray-500 hover:text-green-500 cursor-pointer'
                                        onClick={() => fileInputRef.current.click()} >
                                        <Edit style={{ fontSize: '1.2rem' }} />
                                    </button>
                                }
                            </div>

                            {
                                (selectedUpdateImage) && <div className='flex justify-center mt-2'>
                                    <button onClick={handleUpdateImage} className='text-sm border rounded px-5 py-1 text-green-500 bg-[#00800030] hover:bg-[#00800055] cursor-pointer'>Update</button>
                                </div>
                            }

                            <h2 className="text-2xl font-bold text-center mt-4">{userProfile.username}</h2>
                            <p className="text-center text-gray-400">{userProfile.email}</p>

                            {
                                (loginUser?.username === id) && <div className='flex justify-center mt-2.5'>

                                    <button onClick={handleUserLogout} className="border rounded px-5 py-1 text-red-500 cursor-pointer hover:bg-[#ff000020]">Logout</button>


                                </div>
                            }
                            <div className="grid grid-cols-1 justify-between mt-6 space-x-2">
                                <Link to={'/u/chatting'}>
                                    <div className="text-center border border-neutral-700 rounded py-2 md:px-2 px-1 bg-[#80808023]">
                                        <p className="text-xl font-bold">{userProfile.connections.length}</p>
                                        <p className="text-gray-400 break-words">Connections</p>
                                    </div>
                                </Link>

                            </div>


                            <div className='mt-2'>
                                {
                                    getListComponent()
                                }
                            </div>

                        </div>
                    )
                )}


            </div>
        </div>
    );
}