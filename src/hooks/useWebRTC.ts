import { useState, useEffect, useRef, useCallback } from 'react';
import { Participant } from '../types';

export const useWebRTC = (roomId: string, currentUser: Participant) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([currentUser]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());

  // Initialize local media
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsConnecting(false);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      setIsConnecting(false);
      
      // Create a dummy participant without media
      setParticipants([{
        ...currentUser,
        isCameraOn: false,
        isMuted: true
      }]);
    }
  }, [currentUser]);

  // Toggle microphone
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        
        setParticipants(prev => prev.map(p => 
          p.id === currentUser.id 
            ? { ...p, isMuted: !audioTrack.enabled }
            : p
        ));
      }
    }
  }, [localStream, currentUser.id]);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        
        setParticipants(prev => prev.map(p => 
          p.id === currentUser.id 
            ? { ...p, isCameraOn: videoTrack.enabled }
            : p
        ));
      }
    }
  }, [localStream, currentUser.id]);

  // Start screen sharing
  const startScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      setScreenStream(stream);
      
      // Update participant state
      setParticipants(prev => prev.map(p => 
        p.id === currentUser.id 
          ? { ...p, isScreenSharing: true, stream }
          : p
      ));

      // Handle screen share end
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopScreenShare();
      });

      return true;
    } catch (error) {
      console.error('Error starting screen share:', error);
      return false;
    }
  }, [currentUser.id]);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      
      setParticipants(prev => prev.map(p => 
        p.id === currentUser.id 
          ? { ...p, isScreenSharing: false, stream: localStream }
          : p
      ));
    }
  }, [screenStream, localStream, currentUser.id]);

  // Leave room
  const leaveRoom = useCallback(() => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();

    setLocalStream(null);
    setScreenStream(null);
    setParticipants([]);
  }, [localStream, screenStream]);

  // Simulate adding participants for demo
  const addDemoParticipant = useCallback(() => {
    const demoParticipant: Participant = {
      id: `demo-${Date.now()}`,
      nickname: `Участник ${participants.length}`,
      isHost: false,
      isMuted: Math.random() > 0.5,
      isCameraOn: Math.random() > 0.3,
      isScreenSharing: false,
      joinedAt: new Date()
    };

    setParticipants(prev => [...prev, demoParticipant]);
  }, [participants.length]);

  // Initialize on mount
  useEffect(() => {
    initializeMedia();

    // Add demo participants after a delay for demonstration
    const timer1 = setTimeout(() => addDemoParticipant(), 3000);
    const timer2 = setTimeout(() => addDemoParticipant(), 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      leaveRoom();
    };
  }, []);

  return {
    localStream,
    participants,
    isConnecting,
    localVideoRef,
    toggleMute,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    leaveRoom,
    setParticipants
  };
};