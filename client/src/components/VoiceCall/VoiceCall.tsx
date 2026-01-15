import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import socketService from '../../services/socket';
import { useAuthStore } from '../../store/authStore';

interface VoiceCallProps {
  targetUserId?: string;
  callType: 'voice' | 'video';
  onClose: () => void;
}

const VoiceCall: React.FC<VoiceCallProps> = ({ targetUserId, callType, onClose }) => {
  const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    initializeCall();

    // Listen for WebRTC signaling events
    socketService.onCallOffer(handleCallOffer);
    socketService.onCallAnswer(handleCallAnswer);
    socketService.onIceCandidate(handleIceCandidate);
    socketService.onCallEnd(handleCallEnd);

    return () => {
      cleanupCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: callType === 'video',
      });

      setStream(mediaStream);

      if (localVideoRef.current && callType === 'video') {
        localVideoRef.current.srcObject = mediaStream;
      }

      // If we have a target user, initiate the call
      if (targetUserId) {
        const newPeer = new SimplePeer({
          initiator: true,
          stream: mediaStream,
          trickle: true,
        });

        newPeer.on('signal', (data) => {
          socketService.sendCallOffer(targetUserId, data, callType);
        });

        newPeer.on('stream', (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setCallStatus('connected');
        });

        newPeer.on('error', (err) => {
          console.error('Peer error:', err);
          setCallStatus('ended');
        });

        setPeer(newPeer);
      }
    } catch (error) {
      console.error('Failed to get media stream:', error);
      alert('Failed to access camera/microphone');
      onClose();
    }
  };

  const handleCallOffer = (data: { from: string; offer: any; callType: 'voice' | 'video' }) => {
    if (!stream) return;

    const newPeer = new SimplePeer({
      initiator: false,
      stream: stream,
      trickle: true,
    });

    newPeer.on('signal', (signalData) => {
      socketService.sendCallAnswer(data.from, signalData);
    });

    newPeer.on('stream', (remoteStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      setCallStatus('connected');
    });

    newPeer.signal(data.offer);
    setPeer(newPeer);
  };

  const handleCallAnswer = (data: { from: string; answer: any }) => {
    if (peer) {
      peer.signal(data.answer);
    }
  };

  const handleIceCandidate = (data: { from: string; candidate: any }) => {
    if (peer) {
      peer.signal(data.candidate);
    }
  };

  const handleCallEnd = () => {
    setCallStatus('ended');
    setTimeout(() => onClose(), 1000);
  };

  const cleanupCall = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    if (targetUserId) {
      socketService.endCall(targetUserId);
    }
  };

  const toggleMute = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (stream && callType === 'video') {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanupCall();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-full max-w-4xl p-6">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'connected' && `${callType === 'video' ? 'Video' : 'Voice'} Call`}
            {callStatus === 'ended' && 'Call Ended'}
          </h2>

          <div className="relative">
            {callType === 'video' && (
              <div className="space-y-4">
                {/* Remote Video */}
                <div className="bg-bg-dark rounded-lg overflow-hidden aspect-video">
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Local Video (PiP) */}
                <div className="absolute top-4 right-4 w-48 bg-bg-dark rounded-lg overflow-hidden aspect-video border-2 border-primary">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {callType === 'voice' && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone size={64} />
                  </div>
                  <p className="text-xl">Voice Call in Progress</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={toggleMute}
              className={`p-4 rounded-full transition-all ${
                isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-bg-dark hover:bg-primary'
              }`}
            >
              {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>

            {callType === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all ${
                  isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-bg-dark hover:bg-primary'
                }`}
              >
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
              </button>
            )}

            <button
              onClick={endCall}
              className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-all"
            >
              <PhoneOff size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCall;
