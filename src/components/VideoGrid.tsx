import React from 'react';
import { ParticipantCard } from './ParticipantCard';
import { Participant } from '../types';

interface VideoGridProps {
  participants: Participant[];
  currentUserId: string;
  canControl: boolean;
  onToggleMute: (participantId: string) => void;
  onKickParticipant: (participantId: string) => void;
  localVideoRef: React.RefObject<HTMLVideoElement>;
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  participants,
  currentUserId,
  canControl,
  onToggleMute,
  onKickParticipant,
  localVideoRef
}) => {
  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
    if (count <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    if (count <= 9) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  // Sort participants to show current user first
  const sortedParticipants = [...participants].sort((a, b) => {
    if (a.id === currentUserId) return -1;
    if (b.id === currentUserId) return 1;
    if (a.isHost && !b.isHost) return -1;
    if (b.isHost && !a.isHost) return 1;
    return 0;
  });

  return (
    <div className={`grid ${getGridClass(participants.length)} gap-4 h-full p-4 auto-rows-fr`}>
      {sortedParticipants.map((participant) => (
        <ParticipantCard
          key={participant.id}
          participant={participant}
          isCurrentUser={participant.id === currentUserId}
          canControl={canControl && participant.id !== currentUserId}
          onToggleMute={onToggleMute}
          onKickParticipant={onKickParticipant}
          videoRef={participant.id === currentUserId ? localVideoRef : undefined}
        />
      ))}
    </div>
  );
};