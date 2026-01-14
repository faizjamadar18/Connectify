import React, { useMemo, useState } from 'react';

import ChatContext from './ChatContext';

const ChatContextProvider = ({ children }) => {

    const [userChat, setUserChat] = useState(null);

    const [inputComponent, setInputComponent] = useState("");
    const [inputFile, setInputFile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [joinedUsers, setJoinedUsers] = useState([]);

    const contextValue = useMemo(() => ({
        userChat,
        setUserChat,
        inputComponent,
        setInputComponent,
        inputFile,
        setInputFile,
        isDialogOpen,
        setIsDialogOpen,
        joinedUsers,
        setJoinedUsers
    }), [
        userChat,
        inputComponent,
        inputFile,
        isDialogOpen,
        joinedUsers
    ]);

    return (
        <ChatContext.Provider value={contextValue} >
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider;