import React, { useContext, useEffect, useState } from 'react';

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

import ChatContextProvider from './context/ChatContextProvider';
import { getLoginUser } from './services/authService';
import UserContext from './context/UserContext';
import { useSnackbar } from "notistack";
import { socket } from './services/socketService';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppRoutes from './AppRoutes';



function App() {


  const navigate = useNavigate()
  const { loginUser, setLoginUser, onlineUsers, setOnlineUsers } = useContext(UserContext);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [invitationData, setInvitationData] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchLoginUser = async () => {
      if (!token) return;

      try {
        const response = await getLoginUser();
        if (response.status === 200) {
          setLoginUser(response.data.user);
        }
      } catch (error) {
        enqueueSnackbar(error?.message || 'User not logged in.');
      }
    };

    fetchLoginUser();
  }, [token, setLoginUser, enqueueSnackbar]);

  useEffect(() => {
    if (loginUser) {
      socket.emit('user-online', { userId: loginUser._id });
    }
  }, [loginUser]);



  const handleErrorNotification = ({ message }) => {
    enqueueSnackbar(message, { variant: "error" });
  };

  const handleUpdateOnlineUsers = (users) => {
    setOnlineUsers(users);
  };

  const handleVideoCallInvitation = ({ from, username }) => {
    setInvitationData({ userId: from, username });
    setIsDialogOpen(true);
  }

  useEffect(() => {
    socket.on("update-online-users", handleUpdateOnlineUsers);
    socket.on('video-call-invitation', handleVideoCallInvitation);
    socket.on('error-notification', handleErrorNotification);
    return () => {
      socket.off("update-online-users", handleUpdateOnlineUsers);
      socket.off('error-notification', handleErrorNotification);
      socket.off('video-call-invitation', handleVideoCallInvitation);
    };
  }, [setOnlineUsers]);


  const handleCallResponse = (action) => {
    setIsDialogOpen(false);
    
    if (action === 'allow') {
      navigate(`/video-call/${invitationData?.userId}`);
    } else if (action === "reject") {
      enqueueSnackbar("Call rejected.", { variant: "warning" });
    }

    socket.emit('video-call-invitation-response', {
      from: loginUser?._id,
      to: invitationData.userId,
      action
    });
  }
  return (
    <div className='h-screen md:flex'>

      <ChatContextProvider>
        <AppRoutes />
      </ChatContextProvider>

      <Dialog
        open={isDialogOpen}
      >
        <DialogTitle>Incoming Video Call</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: '1.1rem' }}>
            <span className='text-gray-500' style={{ fontWeight: '800' }}>
              {invitationData?.username}
            </span> is calling you. Would you like to accept the call?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCallResponse("allow")} color="primary" variant="contained">
            Accept
          </Button>
          <Button onClick={() => handleCallResponse("reject")} color="secondary" variant="outlined">
            Decline
          </Button>
        </DialogActions>
      </Dialog>



    </div>
  );
}

export default App;