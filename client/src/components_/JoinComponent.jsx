import React, { useContext, useEffect, useState, forwardRef } from 'react';
import UserContext from '../context/UserContext';
import { connectToUser, getTotalConnectionData } from '../services/userchatService';
import { useSnackbar } from 'notistack';
import LeftSidebar from './SidebarLayout/LeftSidebar';
import { Link, useNavigate } from 'react-router-dom';

import { PersonAdd, Search, ArrowDropDown, ArrowDropUp, Group, Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { Avatar, CircularProgress, Dialog, DialogContent, DialogActions, DialogTitle, Button, Slide, Menu, MenuItem, Fade, Tooltip } from '@mui/material'



export default function JoinComponent() {

    const navigate = useNavigate();
    const { loginUser } = useContext(UserContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [totalConnections, setTotalConnections] = useState([]);


    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);

    const connectedUserIds = loginUser?.connections?.map(connection =>
        connection?.user1?._id === loginUser?._id ? connection?.user2?._id : connection?.user1?._id
    );




    const handleFetchData = async () => {
        try {
            setIsLoading(true);

            const response = await getTotalConnectionData([...connectedUserIds, loginUser?._id]);

            if (response?.success) {
                setTotalConnections({ users: response.users });
            } else {
                enqueueSnackbar(response?.message || 'Failed to fetch data', { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error?.message || 'An error occurred while fetching data', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {

        if (!loginUser) return;

        handleFetchData();
    }, [loginUser]);





    const handleUserConnection = async (remoteUserId) => {

        if (!remoteUserId || !loginUser) {
            enqueueSnackbar('User not found, please try again.', { variant: 'error' });
            return;
        }

        try {
            setIsLoading(true);
            const response = await connectToUser(remoteUserId, loginUser?._id);

            if (response.success) {
                navigate(`/u/chatting/${response?.connectionId}`);
                enqueueSnackbar('Connected successfully! Redirecting to chat...', { variant: 'success' });
            } else {
                enqueueSnackbar(response.message || "Can not connect to user, please try again.", { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error.message || "Can not connect to user, please try again.", { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    }


    const filteredData = totalConnections?.users?.filter(item =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.username?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleSelectedComponent = () => {
        return (
            <ul className="space-y-4">
                {filteredData
                    .filter((item) => item?._id !== loginUser?._id)
                    .map((item) => (
                        <li key={item?._id} className="p-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition duration-300 shadow-md border border-gray-700 flex space-x-3">

                            <Link to={`/u/profile/${item?.username}`}>
                                <Avatar
                                    src={item?.image || "/default-avatar.png"}
                                    sx={{ height: "3rem", width: "3rem" }}
                                    className='sticky top-0 left-0'
                                />
                            </Link>

                            <div className="flex gap-4 flex-1">

                                <div className="flex-1">
                                    <Link to={`/u/profile/${item?.username}`}>
                                        <h2 className="text-lg text-white" style={{ fontWeight: '600' }}>{item?.username}</h2>
                                    </Link>
                                    {
                                        <p className="text-sm text-gray-400">{item?.email}</p>
                                    }


                                    <div className="mt-3 flex justify-end">
                                        <button
                                            onClick={()=>handleUserConnection(item?._id)} className="text-sm rounded-lg px-4 py-2 text-gray-300 hover:text-white bg-gray-700 hover:bg-orange-500 transition flex items-center gap-2 cursor-pointer">
                                            <PersonAdd sx={{ fontSize: "1.2rem" }} />
                                            <span>Connect</span>
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </li>
                    ))}
            </ul>
        );
    };

    return (
        <>
            <div className='bg-gradient-to-r from-black to-gray-800 md:bg-none'>
                <LeftSidebar />
            </div>

            <div className='flex-1 bg-gradient-to-r from-black to-gray-800 h-full overflow-auto'>

                <header className='h-fit sticky top-0 p-4 md:flex items-center justify-center w-full z-10 bg-gradient-to-r from-black to-gray-800 sm:space-x-2'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-2xl text-orange-500 flex items-center md:border md:px-3 rounded'
                            style={{ fontWeight: "800" }}>
                            Join
                        </h1>
                        <div className='flex md:hidden text-gray-300 items-center space-x-1'>
                            <span className='text-sm'>{filteredData?.length || 0}</span>
                            <Group sx={{ fontSize: '1.2rem' }} />
                        </div>
                    </div>

                    <div className='flex space-x-2 w-full md:w-fit mt-2 md:mt-0'>
                        <div className='flex flex-nowrap border border-gray-500 rounded flex-1'>
                            <input type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search users..."
                                className='flex-1 p-1 text-sm md:w-[22rem] lg:w-[31rem]' />
                            <button className='py-1 px-2 text-gray-500 bg-gray-800 rounded-e hover:bg-gray-700 hover:text-white cursor-pointer'>
                                <Search sx={{ fontSize: "1.3rem" }} />
                            </button>
                        </div>

                    </div>
                </header>

                {
                    (isLoading)
                        ? <div className='mt-15 text-gray-500 flex justify-center space-x-5 items-center'>
                            <CircularProgress size={30} />
                            <span>Loading...</span>
                        </div>
                        : <div className="p-4 mx-auto flex-1 md:w-[37rem] lg:w-[46rem]">
                            {filteredData?.length > 0 ? (
                                <ul className="space-y-3 pb-15">
                                    {
                                        handleSelectedComponent()
                                    }
                                </ul>
                            ) : (
                                <div className="text-center text-gray-500 text-lg mt-10">
                                    No <span className='text-white break-words'>{searchQuery}</span>  User available to join.
                                </div>
                            )}
                        </div>
                }
            </div>

        </>
    )
}