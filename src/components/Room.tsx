import React, { useState, useEffect } from 'react';
import { VideoGrid } from './VideoGrid';
import { ChatPanel } from './ChatPanel';
import { ControlPanel } from './ControlPanel';
import { useWebRTC } from '../hooks/useWebRTC';
import { useChat } from '../hooks/useChat';
import { Participant } from '../types';
import { copyToClipboard, generateRoomUrl } from '../utils/roomUtils';

interface RoomProps {
  roomId: string;
  currentUser: Participant;
  onLeaveRoom: () => void;
}

export const Room: React.FC<RoomProps> = ({
  roomId,
  currentUser,
  onLeaveRoom
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentUserState, setCurrentUserState] = useState(currentUser);
  
  const {
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
  } = useWebRTC(roomId, currentUserState);

  const {
    messages,
    sendMessage,
    addSystemMessage
  } = useChat(roomId, currentUserState.nickname);

  // Handle participant join/leave system messages
  useEffect(() => {
    if (participants.length > 0) {
      addSystemMessage(`${currentUserState.nickname} присоединился к комнате`);
    }
  }, []);

  const handleToggleMute = () => {
    toggleMute();
    const newMutedState = !currentUserState.isMuted;
    setCurrentUserState(prev => ({ ...prev, isMuted: newMutedState }));
  };

  const handleToggleCamera = () => {
    toggleCamera();
    const newCameraState = !currentUserState.isCameraOn;
    setCurrentUserState(prev => ({ ...prev, isCameraOn: newCameraState }));
  };

  const handleToggleScreenShare = () => {
    if (currentUserState.isScreenSharing) {
      stopScreenShare();
      setCurrentUserState(prev => ({ ...prev, isScreenSharing: false }));
    } else {
      startScreenShare().then((success) => {
        if (success) {
          setCurrentUserState(prev => ({ ...prev, isScreenSharing: true }));
        }
      });
    }
  };

  const handleMuteParticipant = (participantId: string) => {
    if (!currentUserState.isHost) return;
    
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, isMuted: true } : p
    ));
    
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      addSystemMessage(`${participant.nickname} был отключен модератором`);
    }
  };

  const handleKickParticipant = (participantId: string) => {
    if (!currentUserState.isHost) return;
    
    const participant = participants.find(p => p.id === participantId);
    if (participant) {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
      addSystemMessage(`${participant.nickname} был исключен из комнаты`);
    }
  };

  const handleCopyRoomLink = async () => {
    const url = generateRoomUrl(roomId);
    const success = await copyToClipboard(url);
    if (success) {
      addSystemMessage('Ссылка на комнату скопирована в буфер обмена');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    addSystemMessage(`${currentUserState.nickname} покинул комнату`);
    onLeaveRoom();
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white text-lg">Подключение к комнате...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 relative">
      {/* Video Grid */}
      <div className="h-screen pb-20">
        <VideoGrid
          participants={participants}
          currentUserId={currentUserState.id}
          canControl={currentUserState.isHost}
          onToggleMute={handleMuteParticipant}
          onKickParticipant={handleKickParticipant}
          localVideoRef={localVideoRef}
        />
      </div>

      {/* Control Panel */}
      <ControlPanel
        isMuted={currentUserState.isMuted}
        isCameraOn={currentUserState.isCameraOn}
        isScreenSharing={currentUserState.isScreenSharing}
        participantCount={participants.length}
        roomId={roomId}
        onToggleMute={handleToggleMute}
        onToggleCamera={handleToggleCamera}
        onToggleScreenShare={handleToggleScreenShare}
        onLeaveRoom={handleLeaveRoom}
        onCopyRoomLink={handleCopyRoomLink}
      />

      {/* Chat Panel */}
      <ChatPanel
        messages={messages}
        onSendMessage={sendMessage}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
};