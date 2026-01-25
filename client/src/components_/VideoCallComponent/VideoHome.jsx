import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { socket } from '../../services/socketService';
import RemoteUserRoom from './RemoteUserRoom';
import LocalUserRoom from './LocalUserRoom';
import VideoCallContext from '../../context/VideoCallContext';

export default function VideoHome() {

    const navigate = useNavigate();
    const { id } = useParams();  // This ID is not ours its of the remote user
    const { localVideoRef, remoteVideoRef, localMic, localVideo, peerConnection } = useContext(VideoCallContext);

    const [isJoin, setIsJoin] = useState(false);



    // This function basically get cold when the Local user end the call by clicking the End Call button which is located in remote user on the big screen First refer the remoteuserroom.jsx
    const handleLeaveCall = () => {

        if (localVideoRef?.current?.srcObject) {
            localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            localVideoRef.current.srcObject = null;
        }

        if (remoteVideoRef?.current?.srcObject) {
            remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            remoteVideoRef.current.srcObject = null;
        }

        if (peerConnection.current) {
            peerConnection.current.close();
            peerConnection.current = new RTCPeerConnection();
        }

        socket.off('offer');
        socket.off('answer');
        socket.off('ice-candidate');
        socket.off('leave-call');
    };


    // This use effect basically Turn on our localVideo By accepting Chrome permissions And after that according to the permission Send this stream To the peer connexion to the remote user
    useEffect(() => {
        // Run only when the video element is ready in the DOM
        if (localVideoRef?.current) {

            // Ask browser for camera and microphone based on current ON/OFF state
            navigator.mediaDevices.getUserMedia({
                video: localVideo,   // true = camera ON, false = camera OFF
                audio: localMic      // true = mic ON, false = mic OFF
            })
                .then((stream) => {

                    // Show the live camera stream inside the video element
                    localVideoRef.current.srcObject = stream;

                    // Check if a call connection with another user already exists  
                    if (peerConnection.current) {

                        // Send each camera and microphone track to the other user
                        stream.getTracks().forEach(track =>
                            peerConnection.current.addTrack(track, stream)
                        );
                    }
                })
                // Handle error if camera or microphone access is denied or fails
                .catch((err) => console.error('Error accessing media devices', err));
        }

        // Re-run this effect when mic, camera, video element, or connection changes
    }, [localVideoRef, localMic, localVideo, peerConnection]);




    // This use effect basically Run When UI  is painted and peer connection is automatically get established 
    // 
    useEffect(() => {
        if (peerConnection.current) {
            // peerConnection.current = the active call connection object


            //ICE candidates are discovered only after setLocalDescription() is called, And the below function Only get cold when the icecandidate is Discovered
            peerConnection.current.onicecandidate = (event) => {
                // onicecandidate = runs whenever browser finds a possible connection path

                if (event.candidate) {
                    // event = info given by browser
                    // candidate = one possible internet path for the call

                    socket.emit('ice-candidate', {
                        candidate: event.candidate,
                        // candidate = the possible connection path found by browser
                        to: id
                        // to = user ID of the person we are calling
                    });
                }
            };

            peerConnection.current.ontrack = (event) => {
                // ontrack = runs when audio/video from other user arrives

                if (remoteVideoRef.current) {
                    // remoteVideoRef.current = the video box for other user

                    remoteVideoRef.current.srcObject = event.streams[0];
                    // srcObject = attach live video/audio stream to video box
                    // event.streams[0] = other user’s live camera + mic
                }
            };
        }

    }, [peerConnection, remoteVideoRef, id]);
    // dependency array = re-run this when connection, video box, or user ID changes


    useEffect(() => {

        // When the offer is received set that offer in the Remotedescription(as it is from the remote user) And create an answer for that offer and again call the answer function which is defined in the backend
        const handleOffer = async ({ offer, sender }) => {

            // remoteDescription = other user’s call setup info
            if (!peerConnection.current.remoteDescription) {

            
                // setRemoteDescription = save other user’s call setup
                // We have to convert it back to WebRTC description as when it was passed to the socket ID it has been converted into a json format
                await peerConnection.current.setRemoteDescription(   
                    // RTCSessionDescription = browser-readable call description
                    new RTCSessionDescription(offer)  
                );
            }

            // createAnswer = create call acceptance response
            const answer = await peerConnection.current.createAnswer();

            // setLocalDescription = save own call setup
            await peerConnection.current.setLocalDescription(answer);

            // socket.emit = send data to other user
            socket.emit('answer', { answer, to: sender });

            // setIsJoin = update UI that call is joined
            setIsJoin(true);
        };


        // And when the answer is received from the remote user it is set in the remotedescription
        const handleAnswer = async ({ answer }) => {

            // setRemoteDescription = save other user’s call setup (acceptance)
            // Again it is converted into a web RTC description as well passing to the socket ID it was converted into json format
            await peerConnection.current.setRemoteDescription(
                // RTCSessionDescription = browser-readable call details
                new RTCSessionDescription(answer)
            );
        };


        // handleIceCandidate = runs when a connection path is received
        const handleIceCandidate = async ({ candidate }) => {

            // candidate = possible internet route
            if (candidate) {

                // addIceCandidate = try this route to connect the call
                await peerConnection.current.addIceCandidate(
                    // RTCIceCandidate = browser-usable network path
                    new RTCIceCandidate(candidate)
                );
            }
        };


        const LeaveCall = () => {
            handleLeaveCall();
            navigate(-1);
        };

        socket.on('offer', handleOffer);
        socket.on('answer', handleAnswer);
        socket.on('ice-candidate', handleIceCandidate);
        socket.on('leave-call', LeaveCall);

        return () => {
            socket.off('offer', handleOffer);
            socket.off('answer', handleAnswer);
            socket.off('ice-candidate', handleIceCandidate);
            socket.off('leave-call', LeaveCall);
        };
    }, []);

    const handleJoinCall = async () => {
        if (peerConnection.current) {
            setIsJoin(true);
            // create offer and set that offer locally in localdescription and call 'offer' function Which is defined in backend By sending him the remote usersID from the URL and offer which was created recently 
            const offer = await peerConnection.current.createOffer();
            await peerConnection.current.setLocalDescription(offer);
            socket.emit('offer', { offer, to: id });
        }
    };

    return (
        <>
            {
                (!isJoin) && <div className='flex-1 w-full h-full absolute top-0 bg-[#000000a1] z-50 flex justify-center items-center'>
                    <button
                        onClick={handleJoinCall}
                        className=' px-5 py-2 rounded-full bg-white text-gray-500 hover:bg-amber-500 hover:text-white cursor-pointer'
                    >Join</button>
                </div>
            }

            <div className="h-screen w-screen bg-gradient-to-r from-black to-gray-800 flex justify-center items-center" >
                <div className="p-4 h-full w-full relative">

                    <RemoteUserRoom />

                    <LocalUserRoom />

                </div>
            </div>
        </>
    );
}