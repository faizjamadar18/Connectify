import React, { useState, useMemo, useRef } from 'react';
import VideoCallContext from './VideoCallContext';


export default function VideoCallContextProvider({ children }) {

    const [localMic, setLocalMic] = useState(true);
    const [localVideo, setLocalVideo] = useState(true);

    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    
    const peerConnection = useRef(new RTCPeerConnection({       // to initialize webrtc connection 
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]  // to know the public IPs of the to users over the internet 
    }));
peerConnection.current

    const contextValue = useMemo(() => ({
        localMic,
        setLocalMic,
        localVideo,
        setLocalVideo,
        localVideoRef,
        remoteVideoRef,
        peerConnection
    }), [localMic, localVideo]);

    return (
        <VideoCallContext.Provider value={contextValue}>
            {children}
        </VideoCallContext.Provider>
    );
}