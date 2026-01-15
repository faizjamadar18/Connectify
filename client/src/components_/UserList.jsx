import React, { useContext, useState } from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import List from '@mui/material/List';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import UserContext from '../context/UserContext';

import ConnectionsList from './NetworkList/ConnectionsList.jsx';


import { v4 as uuidv4 } from 'uuid';


export default function UserList() {

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedButton, setSelectedButton] = useState('users');

    const { loginUser } = useContext(UserContext);

    const componentContent = () => {
        let content = null;

        if (!loginUser) {
            content = Array(10).fill().map((_) => (
                <div key={uuidv4()} className="flex space-x-3 mb-4">
                    <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: '#595959e0' }} />
                    <div className='flex-1'>
                        <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ bgcolor: '#595959e0', borderRadius: '3px' }} />
                        <Skeleton sx={{ bgcolor: '#595959e0' }} />
                    </div>
                </div>
            ));
        } else  {
            content = <ConnectionsList searchQuery={searchQuery} />;
        } 

        return <>{content}</>;
    };


    return (
        < >
            <div className='px-2 py-2 space-y-2 bg-black '>
                <div className="flex">
                    <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        className="w-full py-1 px-2 rounded-s bg-gray-800 text-gray-200"
                        placeholder="Search"
                    />
                    <button className="py-1 px-2 bg-gray-600 rounded-e text-gray-400 hover:text-white cursor-pointer">
                        <SearchRoundedIcon />
                    </button>
                </div>

            </div>

            <div className="overflow-y-auto edit-scroll flex-1 px-2 pb-20 bg-black">
                <List className="space-y-2">
                    {
                        componentContent()
                    }
                </List>
            </div>
        </>
    );
}