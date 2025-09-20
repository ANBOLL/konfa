import React, { useState, useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { Room } from './components/Room';
import { Participant } from './types';
import { getRoomIdFromUrl } from './utils/roomUtils';

function App() {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Participant | null>(null);

  // Check URL for room ID on load
  useEffect(() => {
    const roomIdFromUrl = getRoomIdFromUrl();
    if (roomIdFromUrl) {
      // If there's a room in the URL but no current user, stay on home page to get nickname
      // The room ID will be pre-filled
    }
  }, []);

  const handleJoinRoom = (roomId: string, nickname: string, isHost: boolean) => {
    const participant: Participant = {
      id: Date.now().toString(),
      nickname,
      isHost,
      isMuted: false,
      isCameraOn: true,
      isScreenSharing: false,
      joinedAt: new Date()
    };

    setCurrentUser(participant);
    setCurrentRoom(roomId);
    
    // Update URL without refreshing
    const newUrl = `${window.location.origin}/?room=${roomId}`;
    window.history.pushState({}, '', newUrl);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setCurrentUser(null);
    
    // Clear URL
    window.history.pushState({}, '', window.location.origin);
  };

  return (
    <div className="App">
      {currentRoom && currentUser ? (
        <Room
          roomId={currentRoom}
          currentUser={currentUser}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <HomePage onJoinRoom={handleJoinRoom} />
      )}
    </div>
  );
}

export default App;