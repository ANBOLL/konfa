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
    return participant.stream || null;
  };

  return (
    <div className="b-participant-card">
      {/* Video */}
      <div className="b-participant-card__video-container">
        {participant.isCameraOn && !participant.isScreenSharing ? (
          isCurrentUser ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="b-participant-card__video"
            />
          ) : (
            <video
              autoPlay
              playsInline
              className="b-participant-card__video"
              src={participant.stream ? URL.createObjectURL(participant.stream) : undefined}
            />
          )
        ) : participant.isScreenSharing ? (
          <div className="b-participant-card__screen-share">
            <div className="b-participant-card__screen-share-content">
              <Monitor className="b-participant-card__screen-share-icon" />
              <p className="b-participant-card__screen-share-title">Демонстрация экрана</p>
              <p className="b-participant-card__screen-share-name">{participant.nickname}</p>
            </div>
            {participant.stream && (
              <video
                autoPlay
                playsInline
                className="b-participant-card__screen-share-video"
                src={URL.createObjectURL(participant.stream)}
              />
            )}
          </div>
        ) : (
          <div className="b-participant-card__no-video">
            <div className="b-participant-card__avatar">
              <span className="b-participant-card__avatar-text">
                {participant.nickname.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="b-participant-card__no-video-text">Камера отключена</p>
          </div>
        )}
      </div>

      {/* Screen sharing indicator */}
      {participant.isScreenSharing && (
        <div className="b-participant-card__screen-indicator">
          <div className="b-participant-card__screen-badge">
            <Monitor className="w-3 h-3" />
            Экран
          </div>
        </div>
      )}

      {/* Host indicator */}
      {participant.isHost && (
        <div className="b-participant-card__host-indicator">
          <div className="b-participant-card__host-badge">
            <Crown className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* Control buttons for host */}
      {canControl && !isCurrentUser && (
        <div className="b-participant-card__controls">
          <div className="b-participant-card__controls-list">
            <button
              onClick={handleMuteToggle}
              className="b-participant-card__control-button"
              title={participant.isMuted ? "Включить микрофон" : "Отключить микрофон"}
            >
              <VolumeX className="w-4 h-4" />
            </button>
            <button
              onClick={handleKick}
              className="b-participant-card__control-button"
              title="Исключить участника"
            >
              <UserX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom info bar */}
      <div className="b-participant-card__info">
        <div className="b-participant-card__info-content">
          <div>
            <span className="b-participant-card__name">
              {participant.nickname}
              {isCurrentUser && ' (Вы)'}
            </span>
          </div>
          
          <div className="b-participant-card__status">
            {participant.isMuted ? (
              <MicOff className="b-participant-card__status-icon b-participant-card__status-icon_muted" />
            ) : (
              <Mic className="b-participant-card__status-icon b-participant-card__status-icon_unmuted" />
            )}
            
            {participant.isCameraOn ? (
              <Video className="b-participant-card__status-icon b-participant-card__status-icon_video-on" />
            ) : (
              <VideoOff className="b-participant-card__status-icon b-participant-card__status-icon_video-off" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};