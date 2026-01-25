import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import Login from './pages/userAuthentication/Login';
import Register from './pages/userAuthentication/Register';
import JoinComponent from './components_/JoinComponent';
import VideoCall from './pages/VideoCall';
import HomePage from './pages/HomePage';
import UserProfile from './pages/networkProfile/UserProfile';
import NotFound from './pages/NotFound';
import LiveUserList from './components_/NetworkList/LiveUserList';
import VideoCallContextProvider from './context/VideoCallContextProvider';


export default function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/u/chatting/:id?" element={<ChatPage />} />
            <Route path="/u/profile/:id" element={<UserProfile />} />
            <Route path="/u/join-requests" element={<JoinComponent />} />

            <Route path="/live-users" element={<LiveUserList />} />

            <Route path="/video-call/:id" element={
                <VideoCallContextProvider>
                    <VideoCall />
                </VideoCallContextProvider>
            } />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};