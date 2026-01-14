import { useContext } from 'react';
import { Mic, MicOff, Videocam, VideocamOff, Person } from '@mui/icons-material';
import VideoCallContext from '../../context/VideoCallContext';

export default function LocalUserRoom() {

    const { localMic, setLocalMic, localVideoRef, localVideo, setLocalVideo, peerConnection } = useContext(VideoCallContext);

    const handleLocalMic = () => {
        if (localVideoRef.current?.srcObject) {                //srcObject : stream (data flow of audio and video)


            // 1> First we have to turn the mic off of the local user
            const stream = localVideoRef.current.srcObject;
            const audioTracks = stream.getAudioTracks();      // In that stream get only the audio tracks

            audioTracks.forEach(track => {          // In each audio track Make the track enable or disable as per the localMic
                track.enabled = !localMic
            })


            // Then we have to turn off the mic of the remote user using the peer connexions of Web Rtc
            if (peerConnection.current) {
                peerConnection.current.getSenders().forEach(sender => {   // getsender will give all the items Which are being shared using web RTC like here we are sharing video and audio So here's sender 1 is video and sender 2 is audio

                    if (sender.track && sender.track.kind === 'audio') {   // And only consider now audio sender And change the value according to the local mic
                        sender.track.enabled = !localMic;
                    }
                })
            }

            // And at the end Make the value of set local mic  Opposite of the previous value
            setLocalMic(prev => !prev);
        }
    };



    // Same as for the video as well as we discussed in the handleAudio
    const handleLocalVideo = () => {
        if (localVideoRef.current?.srcObject) {
            const stream = localVideoRef.current.srcObject;
            const videoTracks = stream.getVideoTracks(); 

            videoTracks.forEach(track => {
                track.enabled = !localVideo;
            });

            if (peerConnection.current) {
                peerConnection.current.getSenders().forEach(sender => {
                    if (sender.track && sender.track.kind === 'video') {  // Here you Consider the video sender only
                        sender.track.enabled = !localVideo;
                    }
                })
            }

            setLocalVideo(prev => !prev);
        }
    };


    return (
        <div className="absolute rounded-2xl w-55 h-30 md:w-64 md:h-36 bg-black shadow-lg overflow-hidden border border-gray-800 top-0 right-0" >
            <button
                onClick={handleLocalVideo}
                className='absolute right-20 top-2 z-40 rounded-full w-7 h-7 flex justify-center items-center bg-[#3f3f3f82] hover:bg-[#3f3f3f] cursor-pointer'
            >
                {localVideo ? <Videocam sx={{ fontSize: '1.1rem', color: 'white' }} /> : <VideocamOff sx={{ fontSize: '1.1rem', color: 'white' }} />}
            </button>

            <button
                onClick={handleLocalMic}
                className='absolute right-11 top-2 z-40 rounded-full w-7 h-7 flex justify-center items-center bg-[#3f3f3f82] hover:bg-[#3f3f3f] cursor-pointer'
            >
                {localMic ? <Mic sx={{ fontSize: '1.1rem', color: 'white' }} /> : <MicOff sx={{ fontSize: '1.1rem', color: 'white' }} />}
            </button>


            <video
                ref={localVideoRef}
                className="w-full h-full rounded-xl"
                autoPlay
                playsInline
                muted
            ></video>

            {
                !localVideo && <div className='absolute top-0 w-full h-full flex justify-center items-center'>
                    <Person sx={{ fontSize: '3rem' }} className='text-gray-600' />
                </div>
            }

        </div>
    );
}