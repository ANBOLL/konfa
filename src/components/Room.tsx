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
      <div className="b-room__loading">
        <div className="b-room__loading-content">
          <div className="b-room__loading-spinner"></div>
          <p className="b-room__loading-text">Подключение к комнате...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="b-room">
      {/* Video Grid */}
      <div className="b-room__video-container">
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