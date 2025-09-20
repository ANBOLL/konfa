import React from 'react';
import { Mic, MicOff, Video, VideoOff, Monitor, Crown, UserX, VolumeX } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  isCurrentUser: boolean;
  canControl: boolean;
  onToggleMute?: (participantId: string) => void;
  onKickParticipant?: (participantId: string) => void;
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  isCurrentUser,
  canControl,
  onToggleMute,
  onKickParticipant,
  videoRef
}) => {
  const handleMuteToggle = () => {
    if (onToggleMute) {
      onToggleMute(participant.id);
    }
  };

  const handleKick = () => {
    if (onKickParticipant) {
      onKickParticipant(participant.id);
    }
  };

  const getVideoSource = () => {
    if (isCurrentUser && videoRef?.current) {
      return videoRef.current.srcObject;
    }
    return participant.stream;
  };

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video group">
      {/* Video */}
      <div className="w-full h-full flex items-center justify-center">
        {participant.isCameraOn ? (
          isCurrentUser ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-white">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-3">
              <span className="text-xl font-semibold">
                {participant.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="text-sm font-medium">Камера отключена</p>
          </div>
        )}
      </div>

      {/* Screen sharing indicator */}
      {participant.isScreenSharing && (
        <div className="absolute top-3 left-3">
          <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            Экран
          </div>
        </div>
      )}

      {/* Host indicator */}
      {participant.isHost && (
        <div className="absolute top-3 right-3">
          <div className="bg-orange-600 text-white p-1 rounded-lg">
            <Crown className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Control buttons for host */}
      {canControl && !isCurrentUser && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-1">
            <button
              onClick={handleMuteToggle}
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg transition-colors"
              title={participant.isMuted ? "Включить микрофон" : "Отключить микрофон"}
            >
              <VolumeX className="w-4 h-4" />
            </button>
            <button
              onClick={handleKick}
              className="bg-red-600 hover:bg-red-700 text-white p-1 rounded-lg transition-colors"
              title="Исключить участника"
            >
              <UserX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm truncate">
              {participant.nickname}
              {isCurrentUser && ' (Вы)'}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {participant.isMuted ? (
              <MicOff className="w-4 h-4 text-red-400" />
            ) : (
              <Mic className="w-4 h-4 text-green-400" />
            )}
            
            {participant.isCameraOn ? (
              <Video className="w-4 h-4 text-green-400" />
            ) : (
              <VideoOff className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};